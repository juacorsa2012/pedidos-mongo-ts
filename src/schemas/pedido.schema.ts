import mongoose from "mongoose"
import { z } from "zod"
import { Message } from "../config/messages"
import { Constant } from "../config/constants"

export const CreatePedidoSchema = z.object({
  body: z.object({
    cliente: z.string({
      required_error: Message.PEDIDO_CLIENTE_REQUERIDO
    }),
    producto: z.string({
      required_error: Message.PEDIDO_PRODUCTO_REQUERIDO      
    }),
    proveedor: z.string({
      required_error: Message.PEDIDO_PROVEEDOR_REQUERIDO     
    }),    
    unidades: z.number({
      required_error: Message.PEDIDO_UNIDADES_REQUERIDO,
      invalid_type_error: Message.PEDIDO_UNIDADES_TIPO_ENTERO,
    }).positive(Message.PEDIDO_UNIDADES_POSITIVO),
    estado: z.enum([Constant.ESTADO_ENTREGADO, Constant.ESTADO_FACTURADO, Constant.ESTADO_PEDIDO, Constant.ESTADO_PREPARADO])
  })
})

export const UpdatePedidoSchema = z.object({
  body: z.object({
    cliente: z.string({
      required_error: Message.PEDIDO_CLIENTE_REQUERIDO
    }),
    producto: z.string({
      required_error: Message.PEDIDO_PRODUCTO_REQUERIDO      
    }),
    proveedor: z.string({
      required_error: Message.PEDIDO_PROVEEDOR_REQUERIDO     
    }),    
    unidades: z.number({
      required_error: Message.PEDIDO_UNIDADES_REQUERIDO,
      invalid_type_error: Message.PEDIDO_UNIDADES_TIPO_ENTERO,
    }).positive(Message.PEDIDO_UNIDADES_POSITIVO),
    estado: z.enum([Constant.ESTADO_ENTREGADO, Constant.ESTADO_FACTURADO, Constant.ESTADO_PEDIDO, Constant.ESTADO_PREPARADO])
  }),
  params: z.object({
    id: z.custom<mongoose.Types.ObjectId>()
  })
})
