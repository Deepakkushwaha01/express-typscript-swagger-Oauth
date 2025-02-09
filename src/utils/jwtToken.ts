import jwt from 'jsonwebtoken'
import { JwtExpiresIn } from '../enums/globals.ts'
import { Message } from '../enums/responseMessages.ts'

interface JwtPayload {
  userId: string
  email: string
}

export const signJwtToken = (
  payload: JwtPayload,
  expiresIn: string = JwtExpiresIn.ACCESS_TOKEN.EXPIRES_IN
) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error(Message.jwt.invalidValiables)
  }

  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn
  })
}
