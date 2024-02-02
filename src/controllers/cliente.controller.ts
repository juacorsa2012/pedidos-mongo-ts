import { Request, Response } from "express"
import { ClienteService } from "../services"
import { ClienteModel } from "../models"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { Constant } from "../config/constants"
import { Features } from "../utils/Features"
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, 
         HttpResponseNotFound, HttpResponseOk } from "../utils/response"

export class ClienteController {    
  static async obtenerClientes (req: Request, res: Response) {
    const sort = <string>req.query.sort || "createdAt"
    const page  = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || Constant.LIMITE_POR_DEFECTO

    try {
      const features = new Features(ClienteModel.find(), req.query).filter().sort().paginate()
      const clientes = await features.query 
      const totalClientes = await ClienteService.obtenerTotalClientes()
      const meta = {
        page,
        limit,
        totalResults: clientes.length,
        total: totalClientes,
        sort,
        next: `/api/v1/clientes?page=${(+page + 1)}&limit=${+limit}`,
        prev: (+page-1 > 0) ? `/api/v1/clientes?page=${(+page-1)}&limit=${+limit}`: null
      }

      HttpResponseOk(res, clientes, meta)        
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, error.message)    
    }   
  }

  static async obtenerCliente (req: Request, res: Response) {
    const id = req.params.id
    try {
      const cliente = await ClienteService.obtenerCliente(id)
  
      if (!cliente) {
        HttpResponseNotFound(res, Message.CLIENTE_NO_ENCONTRADO)
        return
      }
  
      HttpResponseOk(res, cliente, null)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, error.message)
    }
  }

  static async registrarCliente (req: Request, res: Response) {
    const { nombre, activo } = req.body
    
    try {
      const cliente = new ClienteModel({ nombre, activo })
            
      const existeCliente = await ClienteService.existeCliente(nombre)
  
      if (existeCliente) {
        HttpResponseBadRequest(res, Message.CLIENTE_YA_EXISTE)      
        return
      }
  
      await ClienteService.registrarCliente(cliente)
      HttpResponseCreated(res, cliente, Message.CLIENTE_REGISTRADO)    
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, error.message)
    }    
  }

  static async actualizarCliente (req: Request, res: Response) {
    let cliente
    const id = req.params.id
    const nombre = req.body.nombre.trim()
  
    try {
      cliente = await ClienteService.obtenerCliente(id)
      if (!cliente) {
        HttpResponseNotFound(res, Message.CLIENTE_NO_ENCONTRADO)
        return
      }
      
      cliente = await ClienteService.existeCliente(nombre)
      if (cliente) {
        HttpResponseBadRequest(res, Message.CLIENTE_YA_EXISTE)
        return
      }
  
      cliente = await ClienteService.actualizarCliente(id, nombre)
      HttpResponseOk(res, cliente, null, Message.CLIENTE_ACTUALIZADO)
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, error.message)
    }
  }
}