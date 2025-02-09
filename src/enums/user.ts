// src/enums/user.ts

export const Gender = {
  Male: 'Male',
  Female: 'Female',
  Other: 'Other'
} as const

export const UserType = {
  FlatOwner: 'Flat Owner',
  LookingForFlatmate: 'Looking for a Flatmate',
  LookingForFlat: 'Looking for Flat'
} as const

export const SocialPreference = {
  Smoking: 'Smoking',
  Vegetarian: 'Vegetarian',
  Pets: 'Pets'
} as const

export const DocumentType = {
  Aadhar: 'Aadhar',
  Passport: 'Passport',
  DrivingLicense: 'Driving License',
  VoterID: 'Voter ID',
  PANCard: 'PAN Card'
} as const

// Type definitions for better TypeScript support
export type Gender = (typeof Gender)[keyof typeof Gender]
export type UserType = (typeof UserType)[keyof typeof UserType]
export type SocialPreference =
  (typeof SocialPreference)[keyof typeof SocialPreference]
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]
