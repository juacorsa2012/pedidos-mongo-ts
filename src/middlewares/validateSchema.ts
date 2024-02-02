
import { NextFunction, Request, Response } from "express"
import { AnyZodObject, ZodError } from "zod"
import { HttpResponseBadRequest, HttpResponseError } from "../utils/response"
import { Constant } from "../config/constants"

export const validateSchema = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      })
      next()
    } catch (error) {      
      if (error instanceof ZodError) {
        HttpResponseBadRequest(res, error.issues[0].message)
        return
        /*
        return res.status(400).json(
          error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          }))
        )*/
      }      
      
      HttpResponseError(res, Constant.ERROR_INTERNO_SERVIDOR)
    }
  }