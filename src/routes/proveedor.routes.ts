import { Router } from "express"
import { CreateProveedorSchema, UpdateProveedorSchema } from "../schemas"
import { validateSchema } from "../middlewares/validateSchema"
import { ProveedorController } from "../controllers"

export const proveedorRouter: Router = Router()

proveedorRouter.get('/', ProveedorController.obtenerProveedores)
proveedorRouter.get('/:id', ProveedorController.obtenerProveedor)
proveedorRouter.post('/', validateSchema(CreateProveedorSchema), ProveedorController.registrarProveedor)
proveedorRouter.put('/:id', validateSchema(UpdateProveedorSchema), ProveedorController.actualizarProveedor)