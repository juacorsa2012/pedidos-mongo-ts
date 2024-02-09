import mongoose from "mongoose"
import { z } from "zod"
import { Message } from "../config/messages"
import { Constant } from "../config/constants"

export const CreateProveedorSchema = z.object({
  body: z.object({
    nombre: z.string({
      required_error: Message.PROVEEDOR_NOMBRE_REQUERIDO,
      invalid_type_error: Message.PROVEEDOR_NOMBRE_CADENA
    })
    .min(Constant.LONGITUD_MINIMA_NOMBRE_CLIENTE, Message.PROVEEDOR_NOMBRE_CORTO)
    .max(Constant.LONGITUD_MAXIMA_NOMBRE_CLIENTE, Message.PROVEEDOR_NOMBRE_LARGO)
  })
})

export const UpdateProveedorSchema = z.object({
  body: z.object({
    nombre: z.string({
      required_error: Message.PROVEEDOR_NOMBRE_REQUERIDO,
      invalid_type_error: Message.PROVEEDOR_NOMBRE_CADENA      
    })
    .min(Constant.LONGITUD_MINIMA_NOMBRE_PROVEEDOR, Message.PROVEEDOR_NOMBRE_CORTO)
    .max(Constant.LONGITUD_MAXIMA_NOMBRE_PROVEEDOR, Message.PROVEEDOR_NOMBRE_LARGO)    
  }),
  params: z.object({
    id: z.custom<mongoose.Types.ObjectId>()
  })
})