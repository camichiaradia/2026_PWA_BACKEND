# Recomiendo que hagan por su cuenta:
- PUT /:workspace_id => Actualizar espacio de trabajo
- DELETE /:workspace_id/members/:member_id => Borrar miembro
- PUT /:workspace_id/members/:member_id => Actualizar miembro (por ejemplo el role)
- PUT /:workspace_id/channels/:channel_id => Actualizar canal (por ejemplo el name)
- DELETE /:workspace_id/channels/:channel_id/messages/:message_id => Eliminar un mensaje (siempre que seas admin o owner o el creador del mensaje)
- Flujo de olvide mi contraseña
- Flujo de cambiar mi contraseña

# Extras:
- two factor authentication (2Fa) (Que haya mas de un factor al inciar sesion o autentificar cierta accion)
Ejemplo:
- Te pido tu password y mail, y si estan bien te envio un codigo de 6 digitos al mail (lo guardo en DB) y luego vos me envias este codigo

# Estas son core y estaran en la clase:
- GET /:workspace_id => Obtener espacio de trabajo (Que traiga espacio de trabajo) (Desarrollar este ahora)
    - Tiene que ser miembro
    - Tiene que traer toda la info de cierto espacio de trabajo incluyendo nuestra membresia con ellos (osea si soy owner, admin o miembro) 
- GET /:workspace_id/channels => Obtener canales relacionados al espacio de trabajo
- POST /:workspace_id/channels => Crear canal
- Crear un middleware de canales, channelMiddleware (Desarrollar este ahora)
    -Verificar que x canal exista
    -Verificar que pertenezca a x espacio de trabajo
    
- GET /:workspace_id/channels/:channel_id/messages => Obtener mensajes relacionados al canal
- POST /:workspace_id/channels/:channel_id/messages => Crear mensaje