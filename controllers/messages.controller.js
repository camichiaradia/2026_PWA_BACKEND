import messagesRepository from "../repository/messages.repository.js"
import { tryCatch } from "../helpers/tryCatch.helper.js"

class MessagesController {
    async create(request, response) {
        const { mensaje } = request.body
        const member_id = request.member._id
        const { channel_id } = request.params
        await messagesRepository.create(member_id, mensaje, channel_id)

        return response.json(
            {
                ok: true,
                status: 201,
                message: 'Mensaje creado con exito'
            }
        )
    }

    async getByChannelId(request, response) {
        const { channel_id } = request.params;
        const messages = await messagesRepository.getAllByChannelId(channel_id)

        return response.json({
            ok: true,
            status: 200,
            message: 'Mensajes obtenidos con éxito',
            data: {
                messages
            }
        });
    }
}

const messagesController = new MessagesController()

messagesController.create = tryCatch(messagesController.create)
messagesController.getByChannelId = tryCatch(messagesController.getByChannelId)

export default messagesController