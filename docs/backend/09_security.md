# I. Security

## 1. Threat model
- Credential stuffing
- Token leak
- Abuse API

## 2. Biện pháp
- Nếu có email/password: hash password (bcrypt/argon2)
- Rate limit login
- JWT expiry ngắn

## 3. Secret management
- Env vars
- Rotate định kỳ

## 4. Backup
- Export D1 định kỳ
- Test restore