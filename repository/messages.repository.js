import channelMessages from "../models/channelMessages.model.js";
import { populate } from "dotenv";

class MessagesRepository{
    async create(member_id, mensaje, channel_id){
        return await channelMessages.create({
            fk_ws_member_id: member_id,
            mensaje: mensaje,
            fk_ws_channel_id: channel_id
        })
    }

    async getAllByChannelId (channel_id){
        const messages = await channelMessages.find ({fk_ws_channel_id: channel_id})
        .populate(
            {
                path: "fk_ws_member_id",
                select: "role fk_id_user",
                populate: {
                    path: "fk_id_user",
                    select: "username email"
                }      
            }
        )

        return messages
    }
}

const messagesRepository = new MessagesRepository()
export default messagesRepository

