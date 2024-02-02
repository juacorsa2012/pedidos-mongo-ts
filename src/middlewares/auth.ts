import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { HttpResponseUnthorize } from "../utils/response"
import { Message } from "../config/messages"
import { UsuarioModel } from "../models"
import { logger } from "../config/logger"
import { Constant } from "../config/constants"

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token = ""

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]    
  }
  
  if (!token) {
    HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)
    return
  }

  try {
    const payload = jwt.verify(token, <string>process.env.JWT_SECRET)

    if (!payload) {
      HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)
      return  
    }

    const usuario = await UsuarioModel.findById({_id: payload.id}, {password: 0}) 

    if (!usuario) {
      HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)
      return  
    }     
    
    req.body.usuario = usuario   
    next()
  } catch (error: any) {
      logger.error(`${error}`)
      HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)
  }
}

export const isAdmin = (req: Request, res:Response, next: NextFunction) => {
  const { rol } = req.body.usuario  

  if (rol != Constant.ROL_ADMIN) {    
    HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)
    return
  }

  next()
}

export const isRol = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.body.usuario.rol)) {
      HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)      
      return
    }

    next()
  }
}
