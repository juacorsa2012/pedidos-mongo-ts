import mongoose from  "mongoose"
import { logger } from "../config/logger"
import { Constant } from "./constants"

export const conectarDB = (url: string) => {
  mongoose.connect(url)
    .then(() => logger.info(`${Constant.BASE_DATOS_INICIALIZADA}: ${url}`))
    .catch((err) => {      
      logger.error(err)
      process.exit(1)
    })  
}