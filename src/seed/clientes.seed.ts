import mongoose from "mongoose"
import randomstring from "randomstring"
import { ClienteModel } from "../models"
import { logger } from "../config/logger"

const seed = async (n: number) => {
  try {        
      await ClienteModel.deleteMany({})  
      for (let i = 0; i < n; i++) {                      
        const cliente = { nombre : randomstring.generate(10) }         
        await ClienteModel.create(cliente)
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
logger.info(`Cargando ${n} clientes...`)
seed(n).then(() => {
  logger.info('Proceso de carga de clientes finalizado correctamente')
  process.exit(1)
})