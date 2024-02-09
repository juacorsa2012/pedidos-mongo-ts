import { Request, Response } from "express"
import { ProveedorService } from "../services"
import { ProveedorModel } from "../models"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { Constant } from "../config/constants"
import { Features } from "../utils/Features"
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, 
         HttpResponseNotFound, HttpResponseOk } from "../utils/response"

export class ProveedorController {
  static async obtenerProveedores (req: Request, res: Response) {
    const sort = <string>req.query.sort || "createdAt"
    const page  = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || Constant.LIMITE_POR_DEFECTO

    try {
      const features = new Features(ProveedorModel.find(), req.query).filter().sort().paginate()
      const proveedores = await features.query 
      const totalProveedores = await ProveedorService.obtenerTotalProveedores()
      const meta = {
        page,
        limit,
        totalResults: proveedores.length,
        total: totalProveedores,
        sort,
        next: `/api/v1/clientes?page=${(+page + 1)}&limit=${+limit}`,
        prev: (+page-1 > 0) ? `/api/v1/clientes?page=${(+page-1)}&limit=${+limit}`: null
      }

      HttpResponseOk(res, proveedores, meta)        
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)  
    }   
  }

  static async obtenerProveedor (req: Request, res: Response) {
    const id = req.params.id
    try {
      const proveedor = await ProveedorService.obtenerProvedor(id)
  
      if (!proveedor) {
        HttpResponseNotFound(res, Message.PROVEEDOR_NO_ENCONTRADO)
        return
      }
  
      HttpResponseOk(res, proveedor, null)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async registrarProveedor (req: Request, res: Response) {
    const { nombre, activo } = req.body

    try {
      const proveedor = new ProveedorModel({ nombre, activo })
      
      const existeProveedor = await ProveedorService.existeProveedor(nombre)
  
      if (existeProveedor) {
        HttpResponseBadRequest(res, Message.PROVEEDOR_YA_EXISTE)      
        return
      }
  
      await ProveedorService.registrarProveedor(proveedor)
      HttpResponseCreated(res, proveedor, Message.PROVEEDOR_REGISTRADO)    
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }    
  }

  static async actualizarProveedor (req: Request, res: Response) {
    let proveedor
    const id = req.params.id
    const nombre = req.body.nombre.trim()
  
    try {
      proveedor = await ProveedorService.obtenerProvedor(id)
      if (!proveedor) {
        HttpResponseNotFound(res, Message.PROVEEDOR_NO_ENCONTRADO)
        return
      }
      
      proveedor = await ProveedorService.existeProveedor(nombre)
      if (proveedor) {
        HttpResponseBadRequest(res, Message.PROVEEDOR_YA_EXISTE)
        return
      }
  
      proveedor = await ProveedorService.actualizarProveedor(id, nombre)
      HttpResponseOk(res, proveedor, null, Message.PROVEEDOR_ACTUALIZADO)
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }
}