import { Proveedor } from "../interfaces/proveedor.interface"
import { ProveedorModel } from "../models/proveedor.model"

export class ProveedorService {
  static async registrarProveedor (proveedor: Proveedor) {
    return await ProveedorModel.create(proveedor)
  }

  static async obtenerProvedor (id: string) {
    return await ProveedorModel.findOne({ _id: id })  
  }

  static async existeProveedor (nombre: string) {
    const proveedor = await ProveedorModel.findOne({"nombre": new RegExp(`^${nombre}$`, 'i')})
    return proveedor !== null ? true : false    
  }

  static async obtenerTotalProveedores () {
    return await ProveedorModel.countDocuments()
  }

  static async actualizarProveedor (id: string, nombre: string) {
    return await ProveedorModel.findByIdAndUpdate({ _id: id }, { nombre: nombre.trim() }, {new: true, runValidators: true})   
  }
}