import mongoose from "mongoose";

const workspaceChannelsSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now   
        },
        fk_id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'workspaces',
            required: true
        },
        description: {
            type: String,
            required: false
        }
    }
)

const workspaceChannels= mongoose.model ("workspaceChannels", workspaceChannelsSchema)
export default workspaceChannels