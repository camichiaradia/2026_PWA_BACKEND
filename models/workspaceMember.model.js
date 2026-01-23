import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema(
    {
        fk_id_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        fk_id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "workspaces",
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now   
        },
        role: {
            type: String,
            enum: ['owner', 'admin', 'user'],
            default: 'user',
            required: true
        }
    }
)

const workspaceMember= mongoose.model ("workspaceMember", workspaceMemberSchema)
export default workspaceMember