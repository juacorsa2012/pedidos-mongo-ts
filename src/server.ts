import "dotenv/config"
import { conectarDB } from "./config/mongo"
import { logger } from "./config/logger"
import { Constant } from "./config/constants"

import { app } from "./app"

const PORT = process.env.PORT || 3000
const DB_URI = <string>process.env.DB_URI

export const server = app.listen(PORT, () => {
  conectarDB(DB_URI)
  logger.info(`${Constant.SERVIDOR_INICIADO} ${PORT}`)
})