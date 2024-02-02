import express from "express"
import { clienteRouter, proveedorRouter, productoRouter, pedidoRouter, usuarioRouter } from "./routes"
import { corsMiddleware } from "./middlewares/cors"
import { Constant } from "./config/constants"

export const app = express()

app.disable("x-powered-by")
app.use(express.json())
app.use(corsMiddleware())
app.use(express.urlencoded({extended: true}))

app.use(Constant.URL_V1_CLIENTES, clienteRouter)
app.use(Constant.URL_V1_PROVEEDORES, proveedorRouter)
app.use(Constant.URL_V1_PRODUCTOS, productoRouter)
app.use(Constant.URL_V1_PEDIDOS, pedidoRouter)
app.use(Constant.URL_V1_USUARIOS, usuarioRouter)

// TODO
// const mongoSanitize = require('express-mongo-sanitize');
// const helmet = require('helmet');
// const xss = require('xss-clean');
// const rateLimit = require('express-rate-limit');
// const hpp = require('hpp');
