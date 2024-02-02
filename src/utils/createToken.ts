import "dotenv/config"
import jwt from "jsonwebtoken"

export const crearToken = (id: any) => {
  return jwt.sign({ id }, <string>process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}      
