import { Usuario } from "../interfaces"
import { UsuarioModel } from "../models"

export class UsuarioService {  
  static async registrarUsuario (usuario: Usuario) {
    return await UsuarioModel.create(usuario)
  }

  static async buscarUsuarioPorEmail (email: string) {
    return await UsuarioModel.findOne({ email })
  }

  static async obtenerUsuario (id: string) {
    return await UsuarioModel.findOne({ _id: id })
  }

  static async borrarUsuario (id: string) {
    return await UsuarioModel.findByIdAndDelete(id)
  }

  static async obtenerTotalUsuarios () {
    return await UsuarioModel.countDocuments()
  }

  static async actualizarUsuario (id: string, usuario: Usuario) {
    await UsuarioModel.findByIdAndUpdate(id, usuario)
    //return await UsuarioModel.findOne({ _id: id })
  }
}