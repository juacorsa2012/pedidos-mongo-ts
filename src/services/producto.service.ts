import { Producto } from "../interfaces"
import { ProductoModel } from "../models"

export class ProductoService {
  static async registrarProducto (producto: Producto) {
    return await ProductoModel.create(producto)
  }

  static async obtenerProducto (id: string) {
    return await ProductoModel.findOne({ _id: id })  
  }

  static async existeProducto (nombre: string) {
    const producto = await ProductoModel.findOne({"nombre": new RegExp(`^${nombre}$`, 'i')})
    return producto !== null ? true : false    
  }

  static async obtenerTotalProductos () {
    return await ProductoModel.countDocuments()
  }

  static async actualizarProducto (id: string, nombre: string) {
    return await ProductoModel.findByIdAndUpdate({ _id: id }, { nombre: nombre.trim() }, {new: true, runValidators: true})   
  }
}