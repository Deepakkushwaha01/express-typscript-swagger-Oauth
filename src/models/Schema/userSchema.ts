import { JwtExpiresIn } from '../../enums/globals.ts'
import { Gender, UserType, DocumentType } from '../../enums/user.ts'

export const requiredUserFields = {
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  gender: { type: String, required: true, enum: Object.values(Gender) },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true },
  verificationID: {
    type: {
      idType: {
        type: String,
        required: true,
        enum: Object.values(DocumentType)
      },
      documentNumber: { type: String, required: true }
    },
    required: true
  },
  currentAddress: { type: String, required: true },
  userType: { type: String, required: true, enum: Object.values(UserType) }
}

export const optionalUserFields = {
  profilePicture: { type: String },
  avatarOptions: [{ type: String }],
  profession: { type: String },
  socialPreferences: {
    smoking: { type: Boolean, default: false },
    vegetarian: { type: Boolean, default: false },
    pets: { type: Boolean, default: false }
  },
  bio: { type: String, maxlength: 500 },
  refreshTokens: [
    {
      token: String,
      createdAt: {
        type: Date,
        default: Date.now,
        expires: JwtExpiresIn.REFRESH_TOKEN.EXPIRES_IN
      }
    }
  ]
}

export const userSchemaFields = {
  ...requiredUserFields,
  ...optionalUserFields
}
