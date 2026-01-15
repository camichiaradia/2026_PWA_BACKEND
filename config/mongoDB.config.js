/* CONEXION CON MONGO DB */
/* const conecction_string= "mongodb+srv://admin:Camila1012@cluster0.ph1qyg1.mongodb.net/UTN_BK" */

import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";

const conecction_string= `${ENVIRONMENT.MONGO_DB_URI}/${ENVIRONMENT.MONGO_DB_NAME}`

export async function connectMongoDB(){
    try {
        await mongoose.connect(
            conecction_string
        )
        console.log ("Conectado a MongoDB exitosa")
    } catch (error) { 
        console.error("Error de conexion a MongoDB fallo")
        console.error (error)
    }

}
