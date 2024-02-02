import { Schema, model } from "mongoose"
import { Pedido } from "../interfaces"
import { Constant } from "../config/constants"

const PedidoSchema = new Schema<Pedido>(
  {
    cliente: { type: Schema.ObjectId, required: true, ref: "clientes" },
    producto: { type: Schema.ObjectId, required: true, ref: "productos" },
    proveedor: { type: Schema.ObjectId, required: true, ref: "proveedores" },
    modelo: { type: String, trim: true },
    referencia: { type: String, trim: true },
    unidades: { type: Number, required: true },
    oferta: { type: String, trim: true },
    numero_serie: { type: String, trim: true },
    observaciones: { type: String, trim: true },
    parte: { type: Number },
    estado: { 
      type: String, 
      enum: [Constant.ESTADO_ENTREGADO, Constant.ESTADO_FACTURADO, Constant.ESTADO_PEDIDO, Constant.ESTADO_PREPARADO],
      default: Constant.ESTADO_PEDIDO
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const PedidoModel = model("pedidos", PedidoSchema)