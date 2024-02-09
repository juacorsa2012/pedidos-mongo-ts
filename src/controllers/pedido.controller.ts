import { Request, Response } from "express"
import { PedidoService } from "../services"
import { PedidoModel } from "../models"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { Constant } from "../config/constants"
import { Features } from "../utils/Features"
import { HttpResponseCreated, HttpResponseError, 
         HttpResponseNotFound, HttpResponseOk } from "../utils/response"

export class PedidoController {
  static async obtenerPedidos (req: Request, res: Response) {
    const sort = req.query.sort || "createdAt"
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || Constant.LIMITE_POR_DEFECTO

    try {
      const features = new Features(PedidoModel.find().populate('cliente producto proveedor'), req.query)
        .sort()
        .filter()
        .paginate()
        .limitFields()

      const pedidos = await features.query
      const meta = {
        page,
        limit,
        totalResults: pedidos.length,        
        sort,
        next: `/api/v1/pedidos?page=${(+page + 1)}&limit=${+limit}`,
        prev: (+page-1 > 0) ? `/api/v1/pedidos?page=${(+page-1)}&limit=${+limit}`: null
      }

      HttpResponseOk(res, pedidos, meta)        
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }   
  }

  static async obtenerPedido (req: Request, res: Response) {
    const id = req.params.id
    try {
      const pedido = await PedidoService.obtenerPedido(id)
  
      if (!pedido) {
        HttpResponseNotFound(res, Message.PEDIDO_NO_ENCONTRADO)
        return
      }
  
      HttpResponseOk(res, pedido, null)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async registrarPedido (req: Request, res: Response) {
    const { cliente, producto, proveedor, oferta, parte, modelo, referencia, unidades, 
      numero_serie, observaciones, estado } = req.body
    
    try {
      const pedido = new PedidoModel({ cliente, producto, proveedor, oferta, parte, modelo, referencia, unidades, 
        numero_serie, observaciones, estado })
      
      const resultado = await PedidoService.registrarPedido(pedido)
      HttpResponseCreated(res, resultado, Message.PEDIDO_REGISTRADO)    
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }    
  }

  static async borrarPedido (req: Request, res: Response) {
    try {
      const id = req.params.id
      let pedido = await PedidoService.obtenerPedido(id)
  
      if (!pedido) {
        HttpResponseNotFound(res, Message.PEDIDO_NO_ENCONTRADO)
        return
      }

      await PedidoService.borrarPedido(id)  
  
      HttpResponseOk(res, pedido, null, Message.PEDIDO_BORRADO)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async actualizarPedido (req: Request, res: Response) {
    try {
      const id = req.params.id
      let pedido = await PedidoService.obtenerPedido(id)
  
      if (!pedido) {
        HttpResponseNotFound(res, Message.PEDIDO_NO_ENCONTRADO)
        return
      }
      
      pedido = await PedidoService.actualizarPedido(id, req.body)
  
      HttpResponseOk(res, pedido, null, Message.PEDIDO_ACTUALIZADO)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }  
}