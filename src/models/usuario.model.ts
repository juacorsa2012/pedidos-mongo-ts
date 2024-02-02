import { Schema, model } from "mongoose"
import { Usuario } from "../interfaces"

const UsuarioSchema = new Schema<Usuario>(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    rol: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const UsuarioModel = model("usuarios", UsuarioSchema)