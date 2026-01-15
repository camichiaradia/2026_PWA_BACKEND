import express from 'express'
import authController from '../controllers/auth.controller.js'

const authRouter= express.Router()

/* 
Implementar la capa de controller en el authRoute
*/
authRouter.post(
    "/register",
    authController.register
)   

authRouter.post(
    "/login",
    authController.login
)

authRouter.get(
    "/verify-email",    
    authController.verifyEmail  
)

export default authRouter