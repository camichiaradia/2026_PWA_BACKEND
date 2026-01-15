import mongoose from "mongoose";

const channelMessagesSchema = new mongoose.Schema(
    {
        mensaje: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now   
        },
        fk_ws_channel_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'workspacesChannels',
            required: true
        },
        fk_ws_member_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'workspaceMember',
            required: true
        }
    }
)

const channelMessages= mongoose.model ("channelMessages", channelMessagesSchema)
export default channelMessages