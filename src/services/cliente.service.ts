import { Cliente } from "../interfaces/cliente.interface"
import { ClienteModel } from "../models/cliente.model"

export class ClienteService {
  static async registrarCliente (cliente: Cliente) {
    return await ClienteModel.create(cliente)  
  }

  static async obtenerCliente (id: string) {
    return await ClienteModel.findOne({ _id: id })  
  }

  static async existeCliente (nombre: string) {
    const cliente = await ClienteModel.findOne({"nombre": new RegExp(`^${nombre}$`, 'i')})
    return cliente !== null ? true : false    
  }

  static async obtenerTotalClientes () {
    return await ClienteModel.countDocuments()
  }

  static async actualizarCliente (id: string, nombre: string) {
    return await ClienteModel.findByIdAndUpdate({ _id: id }, { nombre: nombre.trim() }, {new: true, runValidators: true})   
  }
}