/* 
Los headers de una petición se guardan en:
request.headers
Y es un objeto con datos de la consulta como: ip, user-agent, etc.
Headers suele tener ciertos nombres de propiedades definidos (convention). ej: 
"Autorization": ej. clave o un token de auth de sesion
"content-type", : tipos de contenido de la petición (json, form, html, etc)
"x-api-key": clave de api privada.
- Nosotros en esta cursada veremos la estrategia de auth "Bearer" (Barrera de token). 
*/

/* Tomar el token que envie el cliente, veirifcar y determinar la sesión:
- que esxista
- que sea valido
- guardar datos de sesión en el request 
*/
import jwt from "jsonwebtoken"
import ENVIRONMENT from "../config/environment.config.js"
import ServerError from "../helpers/error.helpers.js"

function authMiddleware(request, response, next) {
try{

//Normalmente el tocken de auth se envia en el header "Autorization"
/* Se suele enviar en este formato: "autorization":"Bearer <token>" 
*/
    const authorization_headder= request.headers.authorization

    if(!authorization_headder){
        throw new ServerError('No autorizado', 401)
    }
    const auth_token = authorization_headder.split(" ")[1]
    
    if(!auth_token){
        throw new ServerError('No autorizado', 401)
    }

    //Verificar el token (aqui iria la logica de verificacion del token)

    const user=  jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY)
    
    //guardar los datos de sesion de usuario
    /* {username, email, id} */
    request.user= user
    next()
}
catch(error){
    if (error instanceof jwt.JsonWebTokenError){
        return response.json (
            {
                ok: false,
                status: 401,
                message: "No autorizado, token invalido",
                data: null
            }
        )
    }

    /* Si tiene status decimos que es un error controlado (es esperable) */

    if (error.status){
        return response.json (
            {
                ok: false,
                status: error.status,
                message: error.message,
                data: null
            }
        )
    }

    return response.json (
        {
            ok: false,
            status: 500,    
            message: "Error interno del servidor",
            data: null
        }
        )
    }
}

export default authMiddleware