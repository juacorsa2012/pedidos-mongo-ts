import { Schema, model } from "mongoose"
import { Producto } from "../interfaces"

const ProductoSchema = new Schema<Producto>(
  {
    nombre: { type: String, required: true, unique: true, trim: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const ProductoModel = model("productos", ProductoSchema)