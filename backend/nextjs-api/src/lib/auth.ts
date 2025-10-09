import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Use environment variable for JWT secret with fallback for development
const JWT_SECRET = process.env.JWT_SECRET || 'xtrawrkx-super-secret-jwt-key-2024-development-do-not-use-in-production'

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 12)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (payload: any): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET)
}
