import { Response } from "express"
import { Constant } from "../config/constants"
import { StatusCodes } from "http-status-codes"

export const HttpResponseOk = (res: Response, data: any, meta: any, message: string = "") => {
  return res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    status: Constant.SUCCESS,    
    message,
    data,
    meta
  })
}

export const HttpResponseCreated = (res: Response, data: any, message: string = "") => {
  return res.status(StatusCodes.CREATED).json({
    statusCode: StatusCodes.CREATED,
    status: Constant.SUCCESS,    
    message,
    data
  })
}

export const HttpResponseError = (res: Response, message: string) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    status: Constant.ERROR, 
    message
  })
}

export const HttpResponseNotFound = (res: Response, message: string) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    statusCode: StatusCodes.NOT_FOUND,
    status: Constant.ERROR,
    message
  })
}

export const HttpResponseBadRequest = (res: Response, message: string) => {
  return res.status(StatusCodes.BAD_REQUEST).json({
    statusCode: StatusCodes.BAD_REQUEST,
    status: Constant.ERROR,
    message
  })  
}

export const HttpResponseUnthorize = (res: Response, message: string) => {
  return res.status(StatusCodes.UNAUTHORIZED).json({
    statusCode: StatusCodes.UNAUTHORIZED,
    status: Constant.ERROR,
    message
  })  
}
