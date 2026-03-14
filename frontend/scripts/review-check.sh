#!/usr/bin/env bash

set -euo pipefail

VIETNAMESE_CHAR_PATTERN='[\x{0102}\x{0103}\x{0110}\x{0111}\x{0128}\x{0129}\x{0168}\x{0169}\x{01A0}\x{01A1}\x{01AF}\x{01B0}\x{1EA0}-\x{1EF9}]'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(git -C "$PROJECT_DIR" rev-parse --show-toplevel)"

# Relative path of web-admin in monorepo, empty when repo itself is web-admin.
PROJECT_REL="${PROJECT_DIR#$REPO_ROOT/}"
if [ "$PROJECT_REL" = "$PROJECT_DIR" ]; then
  PROJECT_REL=""
fi

cd "$PROJECT_DIR"

usage() {
  cat <<'EOF'
Usage:
  ./docs/review-check.sh local [base_ref]
  ./docs/review-check.sh self-review [base_ref]
  ./docs/review-check.sh pr <pr_number>
  ./docs/review-check.sh review-pr <pr_number>

Examples:
  ./docs/review-check.sh local main
  ./docs/review-check.sh self-review main
  ./docs/review-check.sh pr 34
  ./docs/review-check.sh review-pr 34
EOF
}

require_commands() {
  for cmd in "$@"; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
      echo "Missing required command: $cmd"
      exit 1
    fi
  done
}

run_local() {
  local base_ref="${1:-main}"
  local vietnamese_project_violation=0

  require_commands git rg jq

  if ! git rev-parse --verify "$base_ref" >/dev/null 2>&1; then
    echo "Base ref not found: $base_ref"
    exit 1
  fi

  echo "[1/1] Running objective checklist scans..."

  local tmp_raw_files
  local tmp_files
  local tmp_source_files
  tmp_raw_files="$(mktemp)"
  tmp_files="$(mktemp)"
  tmp_source_files="$(mktemp)"
  trap 'rm -f "$tmp_raw_files" "$tmp_files" "$tmp_source_files"' RETURN

  {
    # Changed by commits on current branch (vs base)
    git diff --name-only "$base_ref...HEAD" || true
    # Staged but not committed
    git diff --name-only --cached || true
    # Unstaged
    git diff --name-only || true
  } | sort -u > "$tmp_raw_files"

  if [ -n "$PROJECT_REL" ]; then
    rg "^${PROJECT_REL}/" "$tmp_raw_files" | sed "s#^${PROJECT_REL}/##" > "$tmp_files" || true
  else
    cp "$tmp_raw_files" "$tmp_files"
  fi

  # Subset used for source-code objective gates
  rg '^(src/.*\.(ts|tsx|json))$' "$tmp_files" > "$tmp_source_files" || true

  local changed_count
  local source_changed_count
  changed_count="$(wc -l < "$tmp_files" | tr -d ' ')"
  source_changed_count="$(wc -l < "$tmp_source_files" | tr -d ' ')"

  echo "Local self-review (objective)"
  echo "Base ref: $base_ref"
  echo "Changed files (all): $changed_count"
  echo "Changed files (source gates): $source_changed_count"
  echo

  if [ "$changed_count" -eq 0 ]; then
    echo "No local changes detected."
    echo "Continuing with project-wide gates (including Vietnamese full-scan)."
    echo
  fi

  run_check() {
    local title="$1"
    local pattern="$2"
    echo "=== $title ==="
    local matched=0
    while IFS= read -r file; do
      [ -z "$file" ] && continue
      if [ ! -f "$file" ]; then
        continue
      fi
      if rg -n -e "$pattern" "$file" >/dev/null 2>&1; then
        rg -n -e "$pattern" "$file"
        matched=1
      fi
    done < "$tmp_source_files"

    if [ "$matched" -eq 0 ]; then
      echo "(no matches)"
    fi
    echo
  }

  run_check "Gate A/B: empty onClick handlers" "onClick=\\{[[:space:]]*\\(\\)[[:space:]]*=>[[:space:]]*\\{[[:space:]]*\\}[[:space:]]*\\}"
  run_check "Gate C: non-null assertions" "[A-Za-z0-9_]+!\\."
  run_check "Gate C: identity select in react-query" "select:[[:space:]]*\\((res|data)\\)[[:space:]]*=>[[:space:]]*(res|data)"
  run_check "Gate A/C: truthy coercion to undefined (payload risk)" "\\|\\|[[:space:]]*undefined"
  run_check "Gate F: console debug/error logs" "console\\.(log|error|warn)\\("

  echo "=== Gate B/C: useQuery with enabled + isLoading (disabled-loading risk) ==="
  local query_loading_matched=0
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if [[ ! "$file" =~ \.(ts|tsx)$ ]]; then
      continue
    fi
    if [ ! -f "$file" ]; then
      continue
    fi
    if ! rg -n -e "useQuery\\(|useInfiniteQuery\\(" "$file" >/dev/null 2>&1; then
      continue
    fi
    if rg -n -e "enabled:[[:space:]]*" "$file" >/dev/null 2>&1 \
      && rg -n -e "isLoading" "$file" >/dev/null 2>&1; then
      echo "$file"
      rg -n -e "enabled:[[:space:]]*|isLoading" "$file" | sed 's/^/  /'
      query_loading_matched=1
    fi
  done < "$tmp_source_files"
  if [ "$query_loading_matched" -eq 0 ]; then
    echo "(no matches)"
  fi
  echo

  echo "=== Gate I: duplicate imports from same module in one file ==="
  local dup_import_matched=0
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if [[ ! "$file" =~ \.(ts|tsx)$ ]]; then
      continue
    fi
    if [ ! -f "$file" ]; then
      continue
    fi
    local modules
    modules="$(
      rg -o "from[[:space:]]+['\"][^'\"]+['\"]" "$file" \
        | sed -E "s/^from[[:space:]]+['\"]([^'\"]+)['\"]$/\\1/" \
        | sort \
        | uniq -d \
        || true
    )"
    if [ -n "$modules" ]; then
      echo "$file"
      printf '%s\n' "$modules" | sed 's/^/  - /'
      dup_import_matched=1
    fi
  done < "$tmp_source_files"
  if [ "$dup_import_matched" -eq 0 ]; then
    echo "(no matches)"
  fi
  echo

  echo "=== Gate B/I: hardcoded date literal in changed components ==="
  local hardcoded_date_matched=0
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if [[ ! "$file" =~ ^src/components/.*\.tsx$ ]]; then
      continue
    fi
    if [ ! -f "$file" ]; then
      continue
    fi
    if rg -n -e "[0-9]{4}-[0-9]{2}-[0-9]{2}" "$file" >/dev/null 2>&1; then
      echo "$file"
      rg -n -e "[0-9]{4}-[0-9]{2}-[0-9]{2}" "$file" | sed 's/^/  /'
      hardcoded_date_matched=1
    fi
  done < "$tmp_source_files"
  if [ "$hardcoded_date_matched" -eq 0 ]; then
    echo "(no matches)"
  fi
  echo

  echo "=== Gate C/D: mock leakage into components/hooks ==="
  local mock_matched=0
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if [ ! -f "$file" ]; then
      continue
    fi
    if [[ ! "$file" =~ ^src/(components|hooks)/ ]]; then
      continue
    fi
    if rg -n -e "from[[:space:]]+['\\\"].*\\.mock['\\\"]|MOCK_" "$file" >/dev/null 2>&1; then
      rg -n -e "from[[:space:]]+['\\\"].*\\.mock['\\\"]|MOCK_" "$file"
      mock_matched=1
    fi
  done < "$tmp_source_files"
  if [ "$mock_matched" -eq 0 ]; then
    echo "(no matches)"
  fi
  echo

  echo "=== Gate F: oversized changed TS/TSX files (>200 lines) ==="
  local oversized_matched=0
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if [[ ! "$file" =~ \.(ts|tsx)$ ]]; then
      continue
    fi
    if [ ! -f "$file" ]; then
      continue
    fi
    local line_count
    line_count="$(wc -l < "$file" | tr -d ' ')"
    if [ "${line_count:-0}" -gt 200 ]; then
      echo "$file:$line_count"
      oversized_matched=1
    fi
  done < "$tmp_source_files"
  if [ "$oversized_matched" -eq 0 ]; then
    echo "(no matches)"
  fi
  echo

  echo "=== Gate D/F (Critical): Vietnamese characters in frontend (full-scan, not diff-only, excluding vi.json and content files) ==="
  if rg -n -e "$VIETNAMESE_CHAR_PATTERN" "$PROJECT_DIR" --glob '!**/*.json' --glob '!**/sw.ts' --glob '!**/vite.config.ts' --glob '!**/index.html' --glob '!**/privacy-policy-page.tsx' --glob '!**/terms-of-use-page.tsx' >/dev/null 2>&1; then
    rg -n -e "$VIETNAMESE_CHAR_PATTERN" "$PROJECT_DIR" --glob '!**/*.json' --glob '!**/sw.ts' --glob '!**/vite.config.ts' --glob '!**/index.html' --glob '!**/privacy-policy-page.tsx' --glob '!**/terms-of-use-page.tsx' | sed -n '1,300p'
    echo "FAIL: Vietnamese characters detected in frontend source code."
    echo "Action: fix immediately where possible, then rerun review-check."
    vietnamese_project_violation=1
  else
    echo "(no matches)"
  fi
  echo

  echo "=== Gate E: test files changed ==="
  rg -n '\.test\.ts$|\.test\.tsx$' "$tmp_files" || echo "(no test file changes)"
  echo

  echo "=== Gate E (Major): logic changes without test changes ==="
  local logic_changed_count
  local test_changed_count
  logic_changed_count="$(rg -c '^src/(stores|hooks|api|lib/(utils|forms)|components/.+utils).*\.(ts|tsx)$' "$tmp_files" || true)"
  test_changed_count="$(rg -c '\.test\.(ts|tsx)$' "$tmp_files" || true)"
  if [ "${logic_changed_count:-0}" -gt 0 ] && [ "${test_changed_count:-0}" -eq 0 ]; then
    echo "logic files changed: $logic_changed_count, test files changed: $test_changed_count"
    rg '^src/(stores|hooks|api|lib/(utils|forms)|components/.+utils).*\.(ts|tsx)$' "$tmp_files" | sed -n '1,12p' | sed 's/^/  - /'
  else
    echo "(no issues)"
  fi
  echo

  echo "=== Gate D: i18n locale files changed ==="
  rg -n '^src/lib/i18n/locales/.*\.json$' "$tmp_files" || echo "(no locale changes)"
  echo

  echo "=== Gate D (Critical): locale key parity vs en.json ==="
  if [ -f "src/lib/i18n/locales/en.json" ]; then
    local locale_key_file
    locale_key_file="$(mktemp)"
    jq -r 'paths(scalars) | map(tostring) | join(".")' "src/lib/i18n/locales/en.json" | sort -u > "$locale_key_file"

    local locale_mismatch=0
    while IFS= read -r locale_file; do
      [ -z "$locale_file" ] && continue
      [ "$locale_file" = "src/lib/i18n/locales/en.json" ] && continue
      if [ ! -f "$locale_file" ]; then
        continue
      fi
      local tmp_locale_keys
      tmp_locale_keys="$(mktemp)"
      jq -r 'paths(scalars) | map(tostring) | join(".")' "$locale_file" | sort -u > "$tmp_locale_keys"

      local missing_count
      local extra_count
      missing_count="$(comm -23 "$locale_key_file" "$tmp_locale_keys" | wc -l | tr -d ' ')"
      extra_count="$(comm -13 "$locale_key_file" "$tmp_locale_keys" | wc -l | tr -d ' ')"

      if [ "$missing_count" -gt 0 ] || [ "$extra_count" -gt 0 ]; then
        echo "$locale_file -> missing:$missing_count extra:$extra_count"
        echo "  sample missing keys:"
        comm -23 "$locale_key_file" "$tmp_locale_keys" | sed -n '1,8p' | sed 's/^/    - /'
        locale_mismatch=1
      fi
      rm -f "$tmp_locale_keys"
    done < <(find src/lib/i18n/locales -type f -name '*.json' | sort)

    if [ "$locale_mismatch" -eq 0 ]; then
      echo "(no mismatches)"
    fi
    rm -f "$locale_key_file"
  else
    echo "en.json not found, skipped."
  fi
  echo

  if [ "$vietnamese_project_violation" -eq 1 ]; then
    echo "Local review checks failed."
    return 2
  fi

  echo "Local review checks completed."
}

summarize_pr_comments() {
  local pr_number="$1"
  local raw
  raw="$(gh api "repos/{owner}/{repo}/pulls/$pr_number/comments")"

  echo "PR #$pr_number comment summary"
  echo

  echo "=== Counts by severity tag ==="
  echo "$raw" | jq -r '
    map(
      if (.body | test("\\[\\s*Critical\\b"; "i")) then "Critical"
      elif (.body | test("\\[\\s*Major\\b"; "i")) then "Major"
      elif (.body | test("\\[\\s*Minor\\b"; "i")) then "Minor"
      elif (.body | test("\\[\\s*Suggestion\\b"; "i")) then "Suggestion"
      else "Unlabeled"
      end
    )
    | group_by(.)
    | map({severity: .[0], count: length})
    | sort_by(.severity)
    | .[]
    | "\(.severity)\t\(.count)"
  '
  echo

  echo "=== Counts by file ==="
  echo "$raw" | jq -r '
    group_by(.path)
    | map({path: .[0].path, count: length})
    | sort_by(-.count, .path)
    | .[]
    | "\(.count)\t\(.path)"
  '
  echo

  echo "=== Detailed lines ==="
  echo "$raw" | jq -r '
    .[]
    | [
        .path,
        ("line:" + ((.line // .start_line // 0) | tostring)),
        (.body | split("\n")[0])
      ]
    | @tsv
  '
  echo
}

run_pr() {
  local pr_number="$1"
  local vietnamese_project_violation=0

  require_commands gh jq rg git

  echo "[1/2] Running objective PR checks..."

  local base_sha
  local head_sha
  base_sha="$(gh pr view "$pr_number" --json baseRefOid --jq '.baseRefOid')"
  head_sha="$(gh pr view "$pr_number" --json headRefOid --jq '.headRefOid')"

  local repo_root
  local project_pathspec
  repo_root="$(git rev-parse --show-toplevel)"
  project_pathspec="projects/web-admin"
  if [ ! -d "$repo_root/projects/web-admin" ]; then
    project_pathspec="."
  fi

  local changed_files_raw
  local changed_files
  changed_files_raw="$(
    gh pr diff "$pr_number" --name-only \
      | rg '^projects/web-admin/src/.*\.(ts|tsx|json)$|^src/.*\.(ts|tsx|json)$' \
      || true
  )"

  # Normalize monorepo-style paths into this package-relative paths.
  changed_files="$(printf '%s\n' "$changed_files_raw" | sed 's#^projects/web-admin/##')"

  to_object_path() {
    local rel="$1"
    if [ "$project_pathspec" = "." ]; then
      printf '%s' "$rel"
    else
      printf '%s/%s' "$project_pathspec" "$rel"
    fi
  }

  echo "PR #$pr_number"
  echo "Base: $base_sha"
  echo "Head: $head_sha"
  echo "Changed files: $(echo "$changed_files" | sed '/^$/d' | wc -l | tr -d ' ')"
  echo

  if [ -z "$changed_files" ]; then
    echo "No matching source files changed."
  else
    run_check() {
      local title="$1"
      local pattern="$2"
      echo "=== $title ==="
      local matched=0
      while IFS= read -r file; do
        [ -z "$file" ] && continue
        if git grep -nE "$pattern" "$head_sha" -- "$file" >/dev/null 2>&1; then
          git grep -nE "$pattern" "$head_sha" -- "$file"
          matched=1
        fi
      done <<< "$changed_files"

      if [ "$matched" -eq 0 ]; then
        echo "(no matches)"
      fi
      echo
    }

    run_check "Gate A/B: empty onClick handlers" "onClick=\\{[[:space:]]*\\(\\)[[:space:]]*=>[[:space:]]*\\{[[:space:]]*\\}[[:space:]]*\\}"
    run_check "Gate C: non-null assertions" "[A-Za-z0-9_]+!\\."
    run_check "Gate C: identity select in react-query" "select:[[:space:]]*\\((res|data)\\)[[:space:]]*=>[[:space:]]*(res|data)"
    run_check "Gate A/C: truthy coercion to undefined (payload risk)" "\\|\\|[[:space:]]*undefined"
    run_check "Gate F: console debug/error logs" "console\\.(log|error|warn)\\("

    echo "=== Gate B/C: useQuery with enabled + isLoading (disabled-loading risk) ==="
    local query_loading_matched=0
    while IFS= read -r file; do
      [ -z "$file" ] && continue
      if [[ ! "$file" =~ \.(ts|tsx)$ ]]; then
        continue
      fi
      if ! git grep -nE "useQuery\\(|useInfiniteQuery\\(" "$head_sha" -- "$file" >/dev/null 2>&1; then
        continue
      fi
      if git grep -nE "enabled:[[:space:]]*" "$head_sha" -- "$file" >/dev/null 2>&1 \
        && git grep -nE "isLoading" "$head_sha" -- "$file" >/dev/null 2>&1; then
        echo "$file"
        git grep -nE "enabled:[[:space:]]*|isLoading" "$head_sha" -- "$file" | sed 's/^/  /'
        query_loading_matched=1
      fi
    done <<< "$changed_files"
    if [ "$query_loading_matched" -eq 0 ]; then
      echo "(no matches)"
    fi
    echo

    echo "=== Gate I: duplicate imports from same module in one file ==="
    local dup_import_matched=0
    while IFS= read -r file; do
      [ -z "$file" ] && continue
      if [[ ! "$file" =~ \.(ts|tsx)$ ]]; then
        continue
      fi
      local modules
      modules="$(
        git show "$head_sha:$file" 2>/dev/null \
          | rg -o "from[[:space:]]+['\"][^'\"]+['\"]" \
          | sed -E "s/^from[[:space:]]+['\"]([^'\"]+)['\"]$/\\1/" \
          | sort \
          | uniq -d \
          || true
      )"
      if [ -n "$modules" ]; then
        echo "$file"
        printf '%s\n' "$modules" | sed 's/^/  - /'
        dup_import_matched=1
      fi
    done <<< "$changed_files"
    if [ "$dup_import_matched" -eq 0 ]; then
      echo "(no matches)"
    fi
    echo

    echo "=== Gate B/I: hardcoded date literal in changed components ==="
    local hardcoded_date_matched=0
    while IFS= read -r file; do
      [ -z "$file" ] && continue
      if [[ ! "$file" =~ ^src/components/.*\.tsx$ ]]; then
        continue
      fi
      if git grep -nE "[0-9]{4}-[0-9]{2}-[0-9]{2}" "$head_sha" -- "$file" >/dev/null 2>&1; then
        echo "$file"
        git grep -nE "[0-9]{4}-[0-9]{2}-[0-9]{2}" "$head_sha" -- "$file" | sed 's/^/  /'
        hardcoded_date_matched=1
      fi
    done <<< "$changed_files"
    if [ "$hardcoded_date_matched" -eq 0 ]; then
      echo "(no matches)"
    fi
    echo

    echo "=== Gate C/D: mock leakage into components/hooks ==="
    local mock_matched=0
    while IFS= read -r file; do
      [ -z "$file" ] && continue
      if [[ ! "$file" =~ ^src/(components|hooks)/ ]]; then
        continue
      fi
      if git grep -nE "from[[:space:]]+['\\\"].*\\.mock['\\\"]|MOCK_" "$head_sha" -- "$file" >/dev/null 2>&1; then
        git grep -nE "from[[:space:]]+['\\\"].*\\.mock['\\\"]|MOCK_" "$head_sha" -- "$file"
        mock_matched=1
      fi
    done <<< "$changed_files"
    if [ "$mock_matched" -eq 0 ]; then
      echo "(no matches)"
    fi
    echo

    echo "=== Gate F: oversized changed TS/TSX files (>200 lines) ==="
    local oversized_matched=0
    while IFS= read -r file; do
      [ -z "$file" ] && continue
      if [[ ! "$file" =~ \.(ts|tsx)$ ]]; then
        continue
      fi
      local object_path
      object_path="$(to_object_path "$file")"
      if ! git cat-file -e "$head_sha:$object_path" >/dev/null 2>&1; then
        continue
      fi
      local line_count
      line_count="$(git show "$head_sha:$object_path" | wc -l | tr -d ' ')"
      if [ "${line_count:-0}" -gt 200 ]; then
        echo "$file:$line_count"
        oversized_matched=1
      fi
    done <<< "$changed_files"
    if [ "$oversized_matched" -eq 0 ]; then
      echo "(no matches)"
    fi
    echo

    echo "=== Gate E: test files changed ==="
    printf '%s\n' "$changed_files" | rg '\.test\.ts$|\.test\.tsx$' || echo "(no test file changes)"
    echo

    echo "=== Gate E (Major): logic changes without test changes ==="
    local logic_changed_count
    local test_changed_count
    logic_changed_count="$(printf '%s\n' "$changed_files" | rg -c '^src/(stores|hooks|api|lib/(utils|forms)|components/.+utils).*\.(ts|tsx)$' || true)"
    test_changed_count="$(printf '%s\n' "$changed_files" | rg -c '\.test\.(ts|tsx)$' || true)"
    if [ "${logic_changed_count:-0}" -gt 0 ] && [ "${test_changed_count:-0}" -eq 0 ]; then
      echo "logic files changed: $logic_changed_count, test files changed: $test_changed_count"
      printf '%s\n' "$changed_files" | rg '^src/(stores|hooks|api|lib/(utils|forms)|components/.+utils).*\.(ts|tsx)$' | sed -n '1,12p' | sed 's/^/  - /'
    else
      echo "(no issues)"
    fi
    echo

    echo "=== Gate D: i18n locale files changed ==="
    printf '%s\n' "$changed_files" | rg 'src/lib/i18n/locales/.*\.json$' || echo "(no locale changes)"
    echo

    echo "=== Gate D (Critical): locale key parity vs en.json ==="
    if git cat-file -e "$head_sha:$(to_object_path "src/lib/i18n/locales/en.json")" >/dev/null 2>&1; then
      local locale_key_file
      locale_key_file="$(mktemp)"
      git show "$head_sha:$(to_object_path "src/lib/i18n/locales/en.json")" \
        | jq -r 'paths(scalars) | map(tostring) | join(".")' \
        | sort -u > "$locale_key_file"

      local locale_mismatch=0
      while IFS= read -r locale_file; do
        [ -z "$locale_file" ] && continue
        [ "$locale_file" = "src/lib/i18n/locales/en.json" ] && continue
        local object_path
        object_path="$(to_object_path "$locale_file")"
        if ! git cat-file -e "$head_sha:$object_path" >/dev/null 2>&1; then
          continue
        fi

        local tmp_locale_keys
        tmp_locale_keys="$(mktemp)"
        git show "$head_sha:$object_path" \
          | jq -r 'paths(scalars) | map(tostring) | join(".")' \
          | sort -u > "$tmp_locale_keys"

        local missing_count
        local extra_count
        missing_count="$(comm -23 "$locale_key_file" "$tmp_locale_keys" | wc -l | tr -d ' ')"
        extra_count="$(comm -13 "$locale_key_file" "$tmp_locale_keys" | wc -l | tr -d ' ')"

        if [ "$missing_count" -gt 0 ] || [ "$extra_count" -gt 0 ]; then
          echo "$locale_file -> missing:$missing_count extra:$extra_count"
          echo "  sample missing keys:"
          comm -23 "$locale_key_file" "$tmp_locale_keys" | sed -n '1,8p' | sed 's/^/    - /'
          locale_mismatch=1
        fi
        rm -f "$tmp_locale_keys"
      done < <(git ls-tree -r --name-only "$head_sha" -- "$(to_object_path "src/lib/i18n/locales")" | sed "s#^$(to_object_path "")##; s#^/##")

      if [ "$locale_mismatch" -eq 0 ]; then
        echo "(no mismatches)"
      fi
      rm -f "$locale_key_file"
    else
      echo "en.json not found, skipped."
    fi
    echo
  fi

  echo "=== Gate D/F (Critical): Vietnamese characters in frontend (full-scan, not diff-only, excluding vi.json and content files) ==="
  if git grep -nE "$VIETNAMESE_CHAR_PATTERN" "$head_sha" -- "$project_pathspec" | grep -v '\.(json|tsx|ts|html):' | grep -v 'sw\.ts:\|vite\.config\.ts:\|index\.html:\|privacy-policy-page\.tsx:\|terms-of-use-page\.tsx:' >/dev/null 2>&1; then
    git grep -nE "$VIETNAMESE_CHAR_PATTERN" "$head_sha" -- "$project_pathspec" | grep -v '\.(json|tsx|ts|html):' | grep -v 'sw\.ts:\|vite\.config\.ts:\|index\.html:\|privacy-policy-page\.tsx:\|terms-of-use-page\.tsx:' | sed -n '1,300p'
    echo "FAIL: Vietnamese characters detected in frontend source code."
    echo "Action: fix immediately where possible, then rerun review-check."
    vietnamese_project_violation=1
  else
    echo "(no matches)"
  fi
  echo

  echo "[2/2] Summarizing real PR comments for comparison..."
  summarize_pr_comments "$pr_number"

  if [ "$vietnamese_project_violation" -eq 1 ]; then
    echo "PR review checks failed."
    return 2
  fi

  echo "PR review checks completed."
}

mode="${1:-}"

case "$mode" in
  local | self-review | self)
    run_local "${2:-main}"
    ;;
  pr | review-pr | pr-review)
    if [ $# -lt 2 ]; then
      usage
      exit 1
    fi
    run_pr "$2"
    ;;
  *)
    usage
    exit 1
    ;;
esac
