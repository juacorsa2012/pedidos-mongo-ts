import mongoose from "mongoose"
import { z } from "zod"
import { Message } from "../config/messages"
import { Constant } from "../config/constants"

export const CreateClienteSchema = z.object({
  body: z.object({
    nombre: z.string({
      required_error: Message.CLIENTE_NOMBRE_REQUERIDO,
      invalid_type_error: Message.CLIENTE_NOMBRE_CADENA
    })
    .min(Constant.LONGITUD_MINIMA_NOMBRE_CLIENTE, Message.CLIENTE_NOMBRE_CORTO)
    .max(Constant.LONGITUD_MAXIMA_NOMBRE_CLIENTE, Message.CLIENTE_NOMBRE_LARGO)
  })
})

export const UpdateClienteSchema = z.object({
  body: z.object({
    nombre: z.string({
      required_error: Message.CLIENTE_NOMBRE_REQUERIDO,
      invalid_type_error: Message.CLIENTE_NOMBRE_CADENA
    })
    .min(Constant.LONGITUD_MINIMA_NOMBRE_CLIENTE, Message.CLIENTE_NOMBRE_CORTO)
    .max(Constant.LONGITUD_MAXIMA_NOMBRE_CLIENTE, Message.CLIENTE_NOMBRE_LARGO)    
  }),
  params: z.object({
    id: z.custom<mongoose.Types.ObjectId>()
  })
})

