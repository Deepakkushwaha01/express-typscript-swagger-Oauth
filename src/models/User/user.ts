import mongoose, { Model } from 'mongoose'
import { Models } from '../../enums/models.ts'
import type { IUser } from './user.interface.ts'
import { userSchemaFields } from '../Schema/userSchema.ts'
import { JwtExpiresIn } from '../../enums/globals.ts'
import { Message } from '../../enums/responseMessages.ts'

const userSchema = new mongoose.Schema<IUser>(userSchemaFields, {
  timestamps: true
})

userSchema.pre('save', function (next) {
  if (
    !this.profilePicture &&
    (!this.avatarOptions || this.avatarOptions.length === 0)
  ) {
    return next(new Error(Message.user.profilePictureOrAvatarOptionsRequired))
  }
  next()
})

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  Models.User,
  userSchema
)
