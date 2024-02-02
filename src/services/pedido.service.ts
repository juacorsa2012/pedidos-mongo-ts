import { Pedido } from "../interfaces"
import { PedidoModel } from "../models"

export class PedidoService {
  static async obtenerPedido (id: string) {
    return await PedidoModel.findOne({ _id: id }).populate("cliente producto proveedor")
  }

  static async registrarPedido (pedido: Pedido) {
    const { id } = await PedidoModel.create(pedido)
    return await PedidoModel.findOne({ _id: id }).populate("cliente producto proveedor")
  }

  static async borrarPedido (id: string) {
    return await PedidoModel.findByIdAndDelete(id)
  }

  static async actualizarPedido (id: string, pedido: Pedido) {
    await PedidoModel.findByIdAndUpdate(id, pedido)    
    return await PedidoModel.findOne({ _id: id }).populate("cliente producto proveedor")
  }

  static async obtenerTotalPedidos (estado: string) {
    return await PedidoModel.countDocuments().where({ estado })
  }
}