import { Router } from "express"
import { CreateProductoSchema, UpdateProductoSchema } from "../schemas"
import { validateSchema } from "../middlewares/validateSchema"
import { ProductoController } from "../controllers"

export const productoRouter: Router = Router()

productoRouter.get('/', ProductoController.obtenerProductos)
productoRouter.get('/:id', ProductoController.obtenerProducto)
productoRouter.post('/', validateSchema(CreateProductoSchema), ProductoController.registrarProducto)
productoRouter.put('/:id', validateSchema(UpdateProductoSchema), ProductoController.actualizarProducto)