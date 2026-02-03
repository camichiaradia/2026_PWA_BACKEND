import { channelRepository } from "../repository/channel.repository.js"

class ChannelController {
    async getAllByWorkspaceId(request, response){
        try{
            const {workspace_id} = request.params
            const channels = await channelRepository.getAllByWorkspaceId(workspace_id)
            response.json(
                {
                    status: 200,
                    ok: true, 
                    message: 'Canales obtenidos con exito',
                    data: {
                        channels
                    }
                }
            )
        }
        catch (error) {
            console.log("Error en addMember", error)
            /* Si tiene status decimos que es un error controlado (osea es esperable) */
            if (error.status) {
                return response.json({
                    status: error.status,
                    ok: false,
                    message: error.message,
                    data: null
                })
            }

            return response.json({
                ok: false,
                status: 500,
                message: "Error interno del servidor",
                data: null
            })
        }
    }

    async create (request, response){
        try{
        //1. Validamos el nombre del canal
            const {nombre} = request.body
            const {workspace_id} = request.params

            if (!nombre) {
                return response.status(400).json({ 
                message: "El nombre es obligatorio" 
                });
            }
        //2. Cheaqueo si exite:
            const existe = await channelRepository.findByNameAndWorkspace(nombre, workspace_id);
            
            if (existe) {
                return response.status(400).json({ 
                    message: "Ya existe un canal con ese nombre en este workspace" 
                });
            }

        // 3. Crear si todo está OK
            const channel_created = await channelRepository.create(workspace_id, nombre)
            response.json(
                {
                    status: 201,
                    ok: true, 
                    message: 'Canal creado con exito',
                    data: {
                        channel_created
                    }
                }
            )
        }
        catch (error) {
            console.log("Error en ChannelCreate", error)
            /* Si tiene status decimos que es un error controlado (osea es esperable) */
            if (error.status) {
                return response.json({
                    status: error.status,
                    ok: false,
                    message: error.message,
                    data: null
                })
            }

            return response.json({
                ok: false,
                status: 500,
                message: "Error interno del servidor",
                data: null
            })
        }
    }
}

const channelController = new ChannelController()
export {channelController}