import request from "supertest"
import mongoose from  "mongoose"
import { StatusCodes } from 'http-status-codes'
import { ClienteModel, PedidoModel, ProductoModel, ProveedorModel } from "../src/models"
import { server } from "../src/server"
import { Constant } from "../src/config/constants"
import { Message } from '../src/config/messages'
import { PedidoController } from "../src/controllers"

let pedido1: any
let pedido2: any
let cliente: any;
let producto: any;
let proveedor: any;
const url = "/api/v1/pedidos/"

describe(`TEST: ${url}`, () => {
  beforeEach(async () => {       
    await PedidoModel.deleteMany({})
    await ProductoModel.deleteMany({})
    await ProveedorModel.deleteMany({})
    await ClienteModel.deleteMany({})
    cliente = await ClienteModel.create({ nombre: "Cliente 1"})  
    producto = await ProductoModel.create({ nombre: "Producto 1"})  
    proveedor = await ProveedorModel.create({ nombre: "Proveedor 1"})  
    pedido1 = await PedidoModel.create({ cliente: cliente._id, producto: producto._id, proveedor: proveedor._id, unidades: 1 })
    pedido2 = await PedidoModel.create({ cliente: cliente._id, producto: producto._id, proveedor: proveedor._id, unidades: 2 })    
  })

  afterAll(async () => {
    mongoose.connection.close()
    server.close()
  })

  it("debe existir un función llamada obtenerPedidos", () => {
    expect(typeof PedidoController.obtenerPedidos).toBe("function")
  })

  it("debe existir un función llamada obtenerPedido", () => {
    expect(typeof PedidoController.obtenerPedido).toBe("function")
  })

  it("debe existir un función llamada registrarPedido", () => {
    expect(typeof PedidoController.registrarPedido).toBe("function")
  })


  it("debe existir un función llamada actualizarPedido", () => {
    expect(typeof PedidoController.actualizarPedido).toBe("function")
  })

  it("debe existir un función llamada borrarPedido", () => {
    expect(typeof PedidoController.borrarPedido).toBe("function")
  })

  it("GET - debe devolver todos los pedidos", async () => {
    const res = await request(server).get(url)        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe("")
    expect(res.body.data).toBeDefined()  
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data.length).toBe(2)
  })

  it("GET - debe devolver un pedido", async () => {
    const res = await request(server).get(url + pedido1._id)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)           
    expect(res.body.message).toBe("")
    expect(res.body.data.cliente).toBeDefined()
    expect(res.body.data.proveedor).toBeDefined()
    expect(res.body.data.producto).toBeDefined()
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data._id).toBeDefined()
  })

  it("GET - debe devolver un error 404 si el pedido no existe", async () => {         
    const id = new mongoose.Types.ObjectId()
    const res = await request(server).get(url + id)
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)   
    expect(res.body.status).toBe(Constant.ERROR)
    expect(res.body.message).toBe(Message.PEDIDO_NO_ENCONTRADO)   
  })  

  it("POST - debe registrar un pedido correctamente", async () => {
    const pedido = { cliente: cliente._id, producto: producto._id, proveedor: proveedor._id, unidades: 1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)    
    expect(res.statusCode).toBe(StatusCodes.CREATED)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe(Message.PEDIDO_REGISTRADO)
    expect(res.body.data.cliente.nombre).toBe(cliente.nombre)
    expect(res.body.data.producto.nombre).toBe(producto.nombre)
    expect(res.body.data.proveedor.nombre).toBe(proveedor.nombre)
    expect(res.body.data.unidades).toBe(pedido.unidades)
    expect(res.body.data.estado).toBe(pedido.estado)
    expect(res.body.data._id).toBeDefined()         
    expect(res.body.data.createdAt).toBeDefined()         
    expect(res.body.data.updatedAt).toBeDefined()
    expect(res.body.data._id).toBeDefined()         
  })

  it("POST - debe devolver un error 400 cuando no se facilita el cliente asociado al pedido", async () => {
    const pedido = { producto: producto._id, proveedor: proveedor._id, unidades: 1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_CLIENTE_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilita el producto asociado al pedido", async () => {
    const pedido = { cliente: cliente._id, proveedor: proveedor._id, unidades: 1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_PRODUCTO_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilita el proveedor asociado al pedido", async () => {
    const pedido = { cliente: cliente._id, producto: producto._id, unidades: 1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_PROVEEDOR_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilitan las unidades del pedido", async () => {
    const pedido = { cliente: cliente._id, producto: producto._id, proveedor: proveedor._id, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_UNIDADES_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilita el estado del pedido", async () => {
    const pedido = { cliente: cliente._id, producto: producto._id, proveedor: proveedor._id, unidades: 1 }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
  })

  it("POST - debe devolver un error 400 cuando las unidades del pedido es inferior a cero", async () => {
    const pedido = { cliente: cliente._id, producto: producto._id, proveedor: proveedor._id, unidades: -1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_UNIDADES_POSITIVO)
  })

  it("POST - debe devolver un error 400 cuando las unidades del pedido es cero", async () => {
    const pedido = { cliente: cliente._id, producto: producto._id, proveedor: proveedor._id, unidades: 0, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_UNIDADES_POSITIVO)
  })

  it("PUT - debe actualizar un pedido con éxito", async() => {
    const pedido = { cliente: cliente._id, producto: producto._id, proveedor: proveedor._id, unidades: 1, estado: Constant.ESTADO_PREPARADO }
    const res = await request(server).put(url + pedido1._id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)   
    expect(res.body.message).toBe(Message.PEDIDO_ACTUALIZADO)
    expect(res.body.statusCode).toBe(StatusCodes.OK)
  })  

  it("PUT - debe dar un error 400 si actualizamos un pedido con unidades a cero", async() => {
    const pedido = { cliente: cliente._id, producto: producto._id, proveedor: proveedor._id, unidades: 0, estado: Constant.ESTADO_PREPARADO }
    const res = await request(server).put(url + pedido1._id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_UNIDADES_POSITIVO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido con unidades inferior a cero", async() => {
    const pedido = { cliente: cliente._id, producto: producto._id, proveedor: proveedor._id, unidades: -1, estado: Constant.ESTADO_PREPARADO }
    const res = await request(server).put(url + pedido1._id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_UNIDADES_POSITIVO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido sin cliente", async() => {
    const pedido = { producto: producto._id, proveedor: proveedor._id, unidades: 1, estado: Constant.ESTADO_PREPARADO }
    const res = await request(server).put(url + pedido1._id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_CLIENTE_REQUERIDO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido sin producto", async() => {
    const pedido = { cliente: cliente._id, proveedor: proveedor._id, unidades: 1, estado: Constant.ESTADO_PREPARADO }
    const res = await request(server).put(url + pedido1._id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_PRODUCTO_REQUERIDO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido sin proveedor", async() => {
    const pedido = { producto: producto._id, cliente: cliente._id, unidades: 1, estado: Constant.ESTADO_PREPARADO }
    const res = await request(server).put(url + pedido1._id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_PROVEEDOR_REQUERIDO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido sin estado", async() => {
    const pedido = { producto: producto._id, cliente: cliente._id, unidades: 1, proveedor: proveedor._id }
    const res = await request(server).put(url + pedido1._id).send(pedido)       
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
  })    

  it("DELETE - debe borrar un pedido con éxito", async() => {    
    const res = await request(server).delete(url + pedido1._id)
    expect(res.statusCode).toBe(StatusCodes.OK)       
    expect(res.body.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)  
    expect(res.body.message).toBe(Message.PEDIDO_BORRADO)
  })    

  it("DELETE - debe dar un error 400 si borramos un pedido que no existe", async() => {    
    const id = new mongoose.Types.ObjectId()
    const res = await request(server).delete(url + id)
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)       
    expect(res.body.statusCode).toBe(StatusCodes.NOT_FOUND)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_NO_ENCONTRADO)
  })    

})