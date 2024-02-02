import { Schema, model } from "mongoose"
import { Proveedor } from "../interfaces"

const ProveedorSchema = new Schema<Proveedor>(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    activo: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const ProveedorModel = model("proveedores", ProveedorSchema)