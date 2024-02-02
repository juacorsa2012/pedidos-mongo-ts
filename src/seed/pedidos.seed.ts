import mongoose from "mongoose"
import randomstring from "randomstring"
import { PedidoModel, ClienteModel, ProveedorModel, ProductoModel } from "../models"
import { logger } from "../config/logger"

const estados = ["P", "E", "F", "PR"]

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const seed = async (n: number) => {
  try {        
      await PedidoModel.deleteMany({})  
      const total_clientes = await ClienteModel.countDocuments()
      const total_productos = await ProductoModel.countDocuments()
      const total_proveedores = await ProveedorModel.countDocuments()

      for (let i = 0; i < n; i++) {                      
        let r = Math.floor(Math.random() * total_clientes)
        const cliente = await ClienteModel.find().select('_id').limit(1).skip(r)
        r = Math.floor(Math.random() * total_productos)
        const producto = await ProductoModel.find().select('_id').limit(1).skip(r)
        r = Math.floor(Math.random() * total_proveedores)
        const proveedor = await ProveedorModel.find().select('_id').limit(1).skip(r)
        const pedido = { 
          modelo: randomstring.generate(10),
          referencia: randomstring.generate(10),
          unidades: getRandomInt(1, 100),
          oferta: randomstring.generate(5),
          numero_serie: randomstring.generate(25),
          observaciones: randomstring.generate(100),
          parte: getRandomInt(1, 9999),
          estado: estados[getRandomInt(0, 3)],
          cliente: cliente[0]._id,
          producto: producto[0]._id,
          proveedor: proveedor[0]._id
        }               
        
        await PedidoModel.create(pedido)
        let progreso = Math.ceil((i/n)*100) + '%'
        process.stdout.write('Progreso: ' + progreso + '\r')
      }      
  } catch(err:any) {      
      logger.error(err.message)
  }
}

const DB_URI = "mongodb://127.0.0.1:27017/recursos-ts"
const n = +process.argv[2]

mongoose.connect(DB_URI)
logger.info(`Cargando ${n} pedidos...`)
seed(n).then(() => {
  logger.info('Proceso de carga de pedidos finalizado correctamente')
  process.exit(1)
})