import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['xss'] }],
      tracking: [{ tracking: ['xss', 'xs'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}

export function lowerCaseAndCapitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1)
}
