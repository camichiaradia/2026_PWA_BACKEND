import messagesRepository from "../repository/messages.repository.js"


class MessagesController {
    async create(request, response, next) {
        try {
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
        } catch (error) {
            next(error)
        }
    }

    async getByChannelId(request, response, next) {
        try {
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
        } catch (error) {
            next(error)
        }
    }
}

const messagesController = new MessagesController()



export default messagesController