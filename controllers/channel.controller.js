import { channelRepository } from "../repository/channel.repository.js"
import { tryCatch } from "../helpers/tryCatch.helper.js"

class ChannelController {
    async getAllByWorkspaceId(request, response) {
        const { workspace_id } = request.params
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

    async create(request, response) {
        //1. Validamos el nombre del canal
        const { nombre } = request.body
        const { workspace_id } = request.params

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
}

const channelController = new ChannelController()

channelController.getAllByWorkspaceId = tryCatch(channelController.getAllByWorkspaceId)
channelController.create = tryCatch(channelController.create)

export { channelController }