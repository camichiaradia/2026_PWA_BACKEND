Proyecto de BACKEND: APP SLACK

# Descripción del Proyecto:

Creamos una App similar a Slack, que permite a los usuarios crear espacios de trabajo, agregar miembros y enviar mensajes.
En un principio, en nuestra base de datos de MongoDB creamos las colecciones que son como tablas para armar nuestro modelo de datos, ejemplo:
- user: para almacenar los usuarios.
- workspaces: para almacenar los espacios de trabajo.
- workspaceMembers: para almacenar los miembros de los espacios de trabajo.
- workspaceChannels: para almacenar los canales de los espacios de trabajo.
- channelMessages: para almacenar los mensajes.
Una vez esto, pasamos al visual para la reación del Frontend y Backend.
Para el mismo conectamos con express para crear rutas y con MongoDB para interactuar con la base de datos y con GMAIL para enviar Correos Electronicos. También implementamos los Middleware que es un intermediario que puede comunicarse con el controlador mediante request y response. Interviniendo en el flujo de la petición para validar datos, verificar permisos, verificar que el workspace exista, que el usuario sea miembro del workspace, que tenga el rol correcto, tambien valida la api-key, etc.
También conectamos con cors para permitir la comunicación entre el frontend y el backend.
Y luego pasamos a la parte del Frontend para la creación de la interfaz de usuario. Para el mismo usamos React y Vite.
En el backend usamos dotenv para manejar variables de entorno y nodemon para reiniciar el servidor automáticamente cuando hacemos cambios.

# Funcionalidades:

1. Registro de usuarios
2. Login de usuarios
3. Verificación de correo electrónico
4. Creación de espacios de trabajo
5. Agregar miembros a los espacios de trabajo
6. Envío de mensajes
7. Creación de canales

# Carpetas Creadas en el Backend
- config: Para la configuración de la base de datos.
- controllers: Para el manejo de la lógica de negocio.
- middlewares: Para el manejo de los middleware.
- repository: Para el manejo de la base de datos.
- routes: Para el manejo de las rutas.
- services: Para el manejo de los servicios.
- utils: Para el manejo de las utilidades.

