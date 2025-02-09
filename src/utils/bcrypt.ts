import bcrypt from 'bcrypt'

const slat = process.env.BCRYPT_SALT || 10
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, slat)
}

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword)
}
