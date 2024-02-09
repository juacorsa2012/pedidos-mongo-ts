import request from "supertest"
import mongoose from  "mongoose"
import { StatusCodes } from 'http-status-codes'
import { ProductoModel } from "../src/models"
import { server } from "../src/server"
import { Constant } from "../src/config/constants"
import { Message } from '../src/config/messages'
import { ProductoController } from "../src/controllers"

let producto1: any
const url = '/api/v1/productos/'
const nombreProducto1 = "Producto 1"
const nombreProducto2 = "Producto 2"
const longitudMinimaNombreProducto = Constant.LONGITUD_MINIMA_NOMBRE_PRODUCTO
const longitudMaximaNombreProducto = Constant.LONGITUD_MAXIMA_NOMBRE_PRODUCTO

describe(`TEST: ${url}`, () => {
  beforeEach(async () => {       
    await ProductoModel.deleteMany({})
    producto1 = await ProductoModel.create({ nombre: nombreProducto1})  
    await ProductoModel.create({ nombre: nombreProducto2})  
  })

  afterAll(async () => {
    mongoose.connection.close()
    server.close()
  })

  it("debe existir un función llamada obtenerProductos", () => {
    expect(typeof ProductoController.obtenerProductos).toBe("function")
  })

  it("debe existir un función llamada obtenerProducto", () => {
    expect(typeof ProductoController.obtenerProducto).toBe("function")
  })

  it("debe existir un función llamada registrarProducto", () => {
    expect(typeof ProductoController.registrarProducto).toBe("function")
  })

  it("debe existir un función llamada actualizarProducto", () => {
    expect(typeof ProductoController.actualizarProducto).toBe("function")
  })  

  it("GET - debe devolver todos los productos", async () => {
    const res = await request(server).get(url)        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe("")
    expect(res.body.data).toBeDefined()  
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data.length).toBe(2)
  })

  it("GET - debe devolver un producto", async () => {
    const res = await request(server).get(url + producto1._id)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)           
    expect(res.body.message).toBe("")
    expect(res.body.data.nombre).toBe(producto1.nombre)
    expect(res.body.data.activo).toBe(producto1.activo)
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data._id).toBeDefined()
  })

  it("GET - debe devolver un error 404 si el producto no existe", async () => {         
    const id = new mongoose.Types.ObjectId()
    const res = await request(server).get(url + id)
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)   
    expect(res.body.status).toBe(Constant.ERROR)
    expect(res.body.message).toBe(Message.PRODUCTO_NO_ENCONTRADO)   
  })  

  it("POST - debe registrar un producto correctamente", async () => {
    const producto = { nombre: 'Producto 3', activo: false }
    const res = await request(server).post(url).send(producto)
    expect(res.statusCode).toBe(StatusCodes.CREATED)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe(Message.PRODUCTO_REGISTRADO)
    expect(res.body.data.nombre).toBe(producto.nombre)   
    expect(res.body.data.activo).toBeFalsy()
    expect(res.body.data._id).toBeDefined()            
  })

  it("POST - debe devolver un error 400 cuando no se facilita el nombre del producto", async () => {
    const producto = {  }
    const res = await request(server).post(url).send(producto)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PRODUCTO_NOMBRE_REQUERIDO)
  })

  it(`POST - debe devolver un error 400 cuando el nombre del producto es inferior a ${longitudMinimaNombreProducto} caracteres`, async () => {
    const producto = { nombre: "xx" }
    const res = await request(server).post(url).send(producto)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)          
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PRODUCTO_NOMBRE_CORTO)
  })

  it(`POST - debe devolver un error 400 cuando el nombre del producto es superior a ${longitudMaximaNombreProducto} caractares`, async () => {
    let producto = { nombre: new Array(longitudMaximaNombreProducto+2).join('a') }
    const res = await request(server).post(url).send(producto)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)          
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.PRODUCTO_NOMBRE_LARGO)
  })

  it("POST - debe devolver un error 400 si el producto ya existe en la base de datos", async () => {        
    const producto = { nombre: nombreProducto1 }
    const res = await request(server).post(url).send(producto)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)             
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST) 
    expect(res.body.message).toBe(Message.PRODUCTO_YA_EXISTE)
  })

  it("PUT - debe actualizar un producto con éxito", async() => {
    const producto = { nombre: "Producto 999" }
    const res = await request(server).put(url + producto1._id).send(producto)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)   
    expect(res.body.message).toBe(Message.PRODUCTO_ACTUALIZADO)
    expect(res.body.statusCode).toBe(StatusCodes.OK)
    expect(res.body.data._id).toBeDefined()
    expect(res.body.data.nombre).toBe(producto.nombre)    
  })  

  it("PUT - debe dar un error 400 si actualizamos un producto sin nombre", async() => {
    const producto = { }
    const res = await request(server).put(url + producto1._id).send(producto)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PRODUCTO_NOMBRE_REQUERIDO)
  })    

  it(`PUT - debe dar un error 400 si actualizamos un producto con un nombre inferior a ${longitudMinimaNombreProducto} caracteres`, async() => {
    const producto = { nombre: "aa" }
    const res = await request(server).put(url + producto1._id).send(producto)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)   
    expect(res.body.status).toBe(Constant.ERROR)      
    expect(res.body.message).toBe(Message.PRODUCTO_NOMBRE_CORTO)
  })    

  it(`PUT - debe dar un error 400 si actualizamos un producto con un nombre superior a ${longitudMaximaNombreProducto} caracteres`, async() => {
    let producto = { nombre: new Array(longitudMaximaNombreProducto + 2).join('a') }
    const res = await request(server).put(url + producto1._id).send(producto)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.status).toBe(Constant.ERROR)      
    expect(res.body.message).toBe(Message.PRODUCTO_NOMBRE_LARGO)
  })    
})