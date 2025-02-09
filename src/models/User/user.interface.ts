import { Gender, UserType } from '../../enums/user.ts'
import mongoose, { Document } from 'mongoose'

export interface IVerificationID {
  idType: DocumentType
  documentNumber: string
}

export interface ISocialPreferences {
  smoking: boolean
  vegetarian: boolean
  pets: boolean
}

export interface IRefreshToken {
  token: string
  createdAt: Date
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  fullName: string
  email: string
  phoneNumber: string
  gender: Gender
  dateOfBirth: Date
  password: string
  profilePicture?: string
  avatarOptions?: string[]
  verificationID: IVerificationID
  currentAddress: string
  userType: UserType
  profession?: string
  socialPreferences: ISocialPreferences
  bio?: string
  createdAt: Date
  updatedAt: Date
  refreshTokens: IRefreshToken[]
}
