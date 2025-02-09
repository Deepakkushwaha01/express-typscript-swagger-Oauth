export const Models = {
  User: 'User' as const
} as const

export type Models = (typeof Models)[keyof typeof Models]
