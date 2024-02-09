import request from "supertest"
import mongoose from  "mongoose"
import { StatusCodes } from 'http-status-codes'
import { ClienteModel } from "../src/models"
import { server } from "../src/server"
import { Constant } from "../src/config/constants"
import { Message } from '../src/config/messages'
import { ClienteController } from "../src/controllers"

let cliente1: any
const url = '/api/v1/clientes/'
const nombreCliente1 = "Cliente 1"
const nombreCliente2 = "Cliente 2"
const longitudMinimaNombreCliente = Constant.LONGITUD_MINIMA_NOMBRE_CLIENTE
const longitudMaximaNombreCliente = Constant.LONGITUD_MAXIMA_NOMBRE_CLIENTE

describe(`TEST: ${url}`, () => {
  beforeEach(async () => {       
    await ClienteModel.deleteMany({})
    cliente1 = await ClienteModel.create({ nombre: nombreCliente1})  
    await ClienteModel.create({ nombre: nombreCliente2})  
  })

  afterAll(async () => {
    mongoose.connection.close()
    server.close()
  })

  it("debe existir un función llamada obtenerClientes", () => {
    expect(typeof ClienteController.obtenerClientes).toBe("function")
  })

  it("debe existir un función llamada obtenerCliente", () => {
    expect(typeof ClienteController.obtenerCliente).toBe("function")
  })

  it("debe existir un función llamada registrarCliente", () => {
    expect(typeof ClienteController.registrarCliente).toBe("function")
  })

  it("debe existir un función llamada actualizarCliente", () => {
    expect(typeof ClienteController.actualizarCliente).toBe("function")
  })  

  it("GET - debe devolver todos los clientes", async () => {
    const res = await request(server).get(url)        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe("")
    expect(res.body.data).toBeDefined()  
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data.length).toBe(2)
  })

  it("GET - debe devolver todos los clientes ordenados por nombre de forma descendente", async () => {
    const res = await request(server).get("/api/v1/clientes?sort=-nombre")        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe("")
    expect(res.body.data).toBeDefined()  
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data.length).toBe(2)
  })

  it("GET - debe devolver todos los clientes ordenados por nombre de forma ascendente", async () => {
    const res = await request(server).get("/api/v1/clientes?sort=nombre")        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe("")
    expect(res.body.data).toBeDefined()  
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data.length).toBe(2)
  })

  it("GET - debe devolver un cliente", async () => {
    const res = await request(server).get(url + cliente1._id)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)           
    expect(res.body.message).toBe("")
    expect(res.body.data.nombre).toBe(cliente1.nombre)
    expect(res.body.data.activo).toBe(cliente1.activo)
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data._id).toBeDefined()
  })

  it("GET - debe devolver un error 404 si el cliente no existe", async () => {         
    const id = new mongoose.Types.ObjectId()
    const res = await request(server).get(url + id)
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)   
    expect(res.body.status).toBe(Constant.ERROR)
    expect(res.body.message).toBe(Message.CLIENTE_NO_ENCONTRADO)   
  })  

  it("POST - debe registrar un cliente correctamente", async () => {
    const cliente = { nombre: 'Cliente 3', activo: false }
    const res = await request(server).post(url).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.CREATED)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe(Message.CLIENTE_REGISTRADO)
    expect(res.body.data.nombre).toBe(cliente.nombre)   
    expect(res.body.data.activo).toBeFalsy()
    expect(res.body.data._id).toBeDefined()            
  })

  it("POST - debe devolver un error 400 cuando no se facilita el nombre del cliente", async () => {
    const cliente = {  }
    const res = await request(server).post(url).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.CLIENTE_NOMBRE_REQUERIDO)
  })

  it(`POST - debe devolver un error 400 cuando el nombre del cliente es inferior a ${longitudMinimaNombreCliente} caracteres`, async () => {
    const cliente = { nombre: "xx" }
    const res = await request(server).post(url).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)          
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.CLIENTE_NOMBRE_CORTO)
  })

  it(`POST - debe devolver un error 400 cuando el nombre del cliente es superior a ${longitudMaximaNombreCliente} caractares`, async () => {
    const longitudMaxima = Constant.LONGITUD_MAXIMA_NOMBRE_CLIENTE
    let cliente = { nombre: new Array(longitudMaxima+2).join('a') }
    const res = await request(server).post(url).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)          
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.CLIENTE_NOMBRE_LARGO)
  })

  it("POST - debe devolver un error 400 si el cliente ya existe en la base de datos", async () => {        
    const cliente = { nombre: nombreCliente1 }
    const res = await request(server).post(url).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)             
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST) 
    expect(res.body.message).toBe(Message.CLIENTE_YA_EXISTE)
  })

  it("PUT - debe actualizar un cliente con éxito", async() => {
    const cliente = { nombre: "Cliente 999" }
    const res = await request(server).put(url + cliente1._id).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)   
    expect(res.body.message).toBe(Message.CLIENTE_ACTUALIZADO)
    expect(res.body.statusCode).toBe(StatusCodes.OK)
    expect(res.body.data._id).toBeDefined()
    expect(res.body.data.nombre).toBe(cliente.nombre)    
  })  

  it("PUT - debe dar un error 400 si actualizamos un cliente sin nombre", async() => {
    const cliente = { }
    const res = await request(server).put(url + cliente1._id).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.CLIENTE_NOMBRE_REQUERIDO)
  })    

  it(`PUT - debe dar un error 400 si actualizamos un cliente con un nombre inferior a ${longitudMinimaNombreCliente} caracteres`, async() => {
    const cliente = { nombre: "aa" }
    const res = await request(server).put(url + cliente1._id).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)   
    expect(res.body.status).toBe(Constant.ERROR)      
    expect(res.body.message).toBe(Message.CLIENTE_NOMBRE_CORTO)
  })    

  it(`PUT - debe dar un error 400 si actualizamos un cliente con un nombre superior a ${longitudMaximaNombreCliente} caracteres`, async() => {
    const longitudMaxima = Constant.LONGITUD_MAXIMA_NOMBRE_CLIENTE
    let cliente = { nombre: new Array(longitudMaxima+2).join('a') }
    const res = await request(server).put(url + cliente1._id).send(cliente)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.status).toBe(Constant.ERROR)      
    expect(res.body.message).toBe(Message.CLIENTE_NOMBRE_LARGO)
  })    
})