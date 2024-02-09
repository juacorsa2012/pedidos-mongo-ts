import { Request, Response } from "express"
import { ProductoService } from "../services"
import { ProductoModel } from "../models"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { Constant } from "../config/constants"
import { Features } from "../utils/Features"
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, 
         HttpResponseNotFound, HttpResponseOk } from "../utils/response"

export class ProductoController {
  static async obtenerProductos (req: Request, res: Response) {
    const sort = <string>req.query.sort || "createdAt"
    const page  = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || Constant.LIMITE_POR_DEFECTO

    try {
      const features = new Features(ProductoModel.find(), req.query).filter().sort().paginate()
      const productos = await features.query 
      const totalProductos = await ProductoService.obtenerTotalProductos()
      const meta = {
        page,
        limit,
        totalResults: productos.length,
        total: totalProductos,
        sort,
        next: `/api/v1/productos?page=${(+page + 1)}&limit=${+limit}`,
        prev: (+page-1 > 0) ? `/api/v1/productos?page=${(+page-1)}&limit=${+limit}`: null
      }

      HttpResponseOk(res, productos, meta)        
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }   
  }

  static async obtenerProducto (req: Request, res: Response) {
    const id = req.params.id
    try {
      const producto = await ProductoService.obtenerProducto(id)
  
      if (!producto) {
        HttpResponseNotFound(res, Message.PRODUCTO_NO_ENCONTRADO)
        return
      }
  
      HttpResponseOk(res, producto, null)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async registrarProducto (req: Request, res: Response) {    
    try {
      const { nombre } = req.body
      const producto = new ProductoModel({ nombre })
            
      const existeProducto = await ProductoService.existeProducto(nombre)
  
      if (existeProducto) {
        HttpResponseBadRequest(res, Message.PRODUCTO_YA_EXISTE)
        return
      }
  
      await ProductoService.registrarProducto(producto)
      HttpResponseCreated(res, producto, Message.PRODUCTO_REGISTRADO)    
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }    
  }

  static async actualizarProducto (req: Request, res: Response) {
    let producto
    const id = req.params.id
    const nombre = req.body.nombre.trim()
  
    try {
      producto = await ProductoService.obtenerProducto(id)
      if (!producto) {
        HttpResponseNotFound(res, Message.PRODUCTO_NO_ENCONTRADO)
        return
      }
      
      producto = await ProductoService.existeProducto(nombre)
      if (producto) {
        HttpResponseBadRequest(res, Message.PRODUCTO_YA_EXISTE)
        return
      }
  
      producto = await ProductoService.actualizarProducto(id, nombre)
      HttpResponseOk(res, producto, null, Message.PRODUCTO_ACTUALIZADO)
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }
}