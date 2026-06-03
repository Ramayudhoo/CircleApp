import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET as string

export const register = async (req: Request, res: Response) => {
  try {
    const { username, name, email, password } = req.body

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })

    if (existingUser) {
      return res.status(400).json({
        code: 400,
        status: 'error',
        message: 'Username atau email sudah digunakan'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.users.create({
      data: {
        username,
        full_name: name,
        email,
        password: hashedPassword
      }
    })

    const token = jwt.sign(
      { user_id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    return res.status(200).json({
      code: 200,
      status: 'success',
      message: 'Registrasi berhasil. Akun berhasil dibuat.',
      data: {
        user_id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        token
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Invalid register'
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body

    const user = await prisma.users.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }]
      }
    })

    if (!user) {
      return res.status(400).json({
        code: 400,
        status: 'error',
        message: 'Invalid Login'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({
        code: 400,
        status: 'error',
        message: 'Invalid Login'
      })
    }

    const token = jwt.sign(
      { user_id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    return res.status(200).json({
      code: 200,
      status: 'success',
      message: 'Login successful.',
      data: {
        user_id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        avatar: user.photo_profile,
        token
      }
    })
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Invalid Login'
    })
  }
}