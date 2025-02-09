import type { Request, Response } from 'express'
import { UserModel } from '../../models/User/user.ts'
import type { IRefreshToken, IUser } from '../../models/User/user.interface.ts'
import { requiredUserFields } from '../../models/Schema/userSchema.ts'
import { HttpStatusCode } from '../../enums/statusCode.ts'
import { Message } from '../../enums/responseMessages.ts'
import { signJwtToken } from '../../utils/jwtToken.ts'
import { JwtExpiresIn } from '../../enums/globals.ts'
import { comparePassword, hashPassword } from '../../utils/bcrypt.ts'

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      password,
      profilePicture,
      avatarOptions,
      verificationID,
      currentAddress,
      userType,
      profession,
      socialPreferences,
      bio
    }: IUser = req.body

    // Validate required fields
    for (const requiredUserField of Object.keys(requiredUserFields)) {
      if (!req.body[requiredUserField]) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: `${requiredUserField} is required`
        })
      }
    }

    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {
      return res.status(HttpStatusCode.CONFLICT).json({
        message: Message.user.userExists
      })
    }

    const newUser = await UserModel.create({
      fullName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      password: await hashPassword(password),
      profilePicture,
      avatarOptions,
      verificationID,
      currentAddress,
      userType,
      profession,
      socialPreferences,
      bio,
      refreshTokens: []
    })

    const accessToken = signJwtToken(
      {
        userId: newUser._id as unknown as string,
        email
      },
      JwtExpiresIn.ACCESS_TOKEN.EXPIRES_IN
    )

    const refreshToken = signJwtToken(
      {
        userId: newUser._id as unknown as string,
        email
      },
      JwtExpiresIn.REFRESH_TOKEN.EXPIRES_IN
    )

    console.log('refreshToken', refreshToken)

    await UserModel.findByIdAndUpdate(
      newUser._id,
      {
        $push: { refreshTokens: { token: refreshToken } }
      },
      {
        new: true
      }
    )

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Prevents JavaScript access
      secure: true, // Only sent over HTTPS
      sameSite: 'strict', // CSRF protection
      maxAge: JwtExpiresIn.REFRESH_TOKEN.IN_MILI_SECONDS // 1 days in milliseconds
    })

    // Optional: Set access token in cookie if not using Authorization header
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: JwtExpiresIn.ACCESS_TOKEN.IN_MILI_SECONDS // 15 minutes in milliseconds
    })

    return res.status(HttpStatusCode.CREATED).json({
      message: Message.user.created,
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName
      },
      accessToken
    })
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Message.user.registrationFailed,
      error: (error as any)?.message
    })
  }
}

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: Message.user.emailAndPasswordRequired
      })
    }

    // Fetch only necessary fields to optimize DB query
    const existingUser = await UserModel.findOne({ email }).select(
      '_id fullName email password refreshTokens'
    )

    if (!existingUser) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: Message.global.invalidCredentials
      })
    }

    const isPasswordMatch = await comparePassword(
      password,
      existingUser.password
    )

    if (!isPasswordMatch) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: Message.global.invalidCredentials
      })
    }

    const accessToken = signJwtToken(
      { userId: existingUser._id.toString(), email },
      JwtExpiresIn.ACCESS_TOKEN.EXPIRES_IN
    )

    const refreshToken = signJwtToken(
      { userId: existingUser._id.toString(), email },
      JwtExpiresIn.REFRESH_TOKEN.EXPIRES_IN
    )

    // Remove expired refresh tokens and store only the latest ones
    const updatedRefreshTokens = existingUser.refreshTokens
      .filter((token: IRefreshToken) => token) // Remove undefined/null tokens
      .slice(-4) // Keep only the last 4 tokens to prevent token bloat
    updatedRefreshTokens.push({
      token: refreshToken,
      createdAt: new Date()
    })

    await UserModel.findByIdAndUpdate(existingUser._id, {
      $set: { refreshTokens: updatedRefreshTokens }
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: JwtExpiresIn.REFRESH_TOKEN.IN_MILI_SECONDS
    })

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: JwtExpiresIn.ACCESS_TOKEN.IN_MILI_SECONDS
    })

    return res.status(HttpStatusCode.OK).json({
      message: Message.global.loggedIn,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        fullName: existingUser.fullName
      },
      accessToken
    })
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Message.global.loginFailed,
      error: (error as any)?.message
    })
  }
}

export const logoutUserController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies

    if (refreshToken) {
      // Find the user with the given refresh token
      const user = await UserModel.findOneAndUpdate(
        { 'refreshTokens.token': refreshToken },
        { $pull: { refreshTokens: { token: refreshToken } } },
        { new: true }
      )

      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: Message.global.userNotFoundAndLoggedOut
        })
      }
    }

    // Clear the cookies
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    })

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    })

    return res.status(HttpStatusCode.OK).json({
      message: Message.global.userLoggedOut
    })
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: 'Logout failed',
      error: (error as any)?.message
    })
  }
}
