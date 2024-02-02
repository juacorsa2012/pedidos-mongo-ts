import mongoose from "mongoose"

export interface Pedido {
  producto: mongoose.Schema.Types.ObjectId,
  cliente: mongoose.Schema.Types.ObjectId,
  proveedor: mongoose.Schema.Types.ObjectId,
  modelo: string,
  unidades: number,
  referencia: string,
  oferta: string,
  numero_serie: string,
  observaciones: string,
  parte: number,
  estado: string
}