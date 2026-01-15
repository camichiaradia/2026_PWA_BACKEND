function randomMiddleware(request, response, next) {
    //Determina la suerte del cliente
    const numero = Math.random()

    //un middlewere si quiere puede comunicarse con el controlador mediante request. 
    //Determina quien es el usuario con suerte o no (de quien va a ingresar a la sesion)
    if (numero >= 0.5) {
        request.suerte= true
    }
    else {
        request.suerte= false
    }
    next()
}
export default randomMiddleware