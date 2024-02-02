import { Schema, model } from "mongoose"
import { Cliente } from "../interfaces"

const ClienteSchema = new Schema<Cliente>(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    activo: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const ClienteModel = model("clientes", ClienteSchema)