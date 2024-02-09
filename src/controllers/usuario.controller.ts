import bcrypt  from "bcryptjs"
import { Request, Response } from "express"
import { UsuarioService } from "../services"
import { UsuarioModel } from "../models"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { crearToken } from "../utils/createToken"
import { Constant } from "../config/constants"
import { Features } from "../utils/Features"
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, 
         HttpResponseNotFound, HttpResponseOk } from "../utils/response"

export class UsuarioController {
  static async obtenerUsuarios (req: Request, res: Response) {
    const sort = <string>req.query.sort || "createdAt"
    const page  = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || Constant.LIMITE_POR_DEFECTO

    try {
      const features = new Features(UsuarioModel.find(), req.query).filter().sort().paginate()
      const usuarios = await features.query 
      const totalUsuarios = await UsuarioService.obtenerTotalUsuarios()
      const meta = {
        page,
        limit,
        totalResults: usuarios.length,
        total: totalUsuarios,
        sort,
        next: `/api/v1/usuarios?page=${(+page + 1)}&limit=${+limit}`,
        prev: (+page-1 > 0) ? `/api/v1/usuarios?page=${(+page-1)}&limit=${+limit}`: null
      }

      HttpResponseOk(res, usuarios, meta)        
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }   
  }

  static async obtenerUsuario (req: Request, res: Response) {
    const id = req.params.id
    try {
      const usuario = await UsuarioService.obtenerUsuario(id)
  
      if (!usuario) {
        HttpResponseNotFound(res, Message.USUARIO_NO_ENCONTRADO)
        return
      }
  
      HttpResponseOk(res, usuario, null)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async registrarUsuario (req: Request, res: Response) {    
    try {            
      const { email, nombre, password, rol } = req.body
      const existeUsuario = await UsuarioService.buscarUsuarioPorEmail(email)
            
      if (existeUsuario) {
        HttpResponseBadRequest(res, Message.USUARIO_YA_EXISTE)      
        return
      }

      const salt = await bcrypt.genSalt(Constant.SALT)
      const hashPassword = await bcrypt.hash(password, salt)
      const usuario = { nombre, email, password: hashPassword, rol }      
      const usuario_nuevo = await UsuarioService.registrarUsuario(usuario)
      const token = crearToken(usuario_nuevo._id)          

      HttpResponseCreated(res, token, Message.USUARIO_REGISTRADO)
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }    
  }

  static async loginUsuario (req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const usuario = await UsuarioService.buscarUsuarioPorEmail(email)
            
      if (!usuario) {
        HttpResponseBadRequest(res, Message.USUARIO_CREDENCIALES_INCORRECTAS)      
        return
      }

      const esPasswordOk = await bcrypt.compare(password, usuario.password)

      if (!esPasswordOk) {
        HttpResponseBadRequest(res, Message.USUARIO_CREDENCIALES_INCORRECTAS)      
        return
      }

      const token = crearToken(usuario._id)          

      HttpResponseOk(res, token, "")      
    } catch (error: any) {
      logger.error(`${error}`)
      HttpResponseError(res, Message.ERROR_GENERAL) 
    }
  }

  static async borrarUsuario (req: Request, res: Response) {
    try {
      const id = req.params.id
      let usuario = await UsuarioService.obtenerUsuario(id)
  
      if (!usuario) {
        HttpResponseNotFound(res, Message.USUARIO_NO_ENCONTRADO)
        return
      }

      await UsuarioService.borrarUsuario(id)
      usuario.password = ""
  
      HttpResponseOk(res, usuario, null, Message.USUARIO_BORRADO)
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async actualizarUsuario (req: Request, res: Response) {    
    try {
      const id = req.params.id
      const existe = await UsuarioService.obtenerUsuario(id)

      if (!existe) {
        HttpResponseNotFound(res, Message.USUARIO_NO_ENCONTRADO)
        return
      }      
      
      const { email, nombre, password, rol } = req.body
      const salt = await bcrypt.genSalt(Constant.SALT)
      const hashPassword = await bcrypt.hash(password, salt)
      const usuario = { nombre, email, password: hashPassword, rol }      
  
      await UsuarioService.actualizarUsuario(id, usuario)
      HttpResponseOk(res, null, null, Message.USUARIO_ACTUALIZADO)
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }
}