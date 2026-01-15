import mongoose from "mongoose";

/* Terminar de crear el modelo */
const workspacesSchema = new mongoose.Schema(
    {
        fk_id_owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //Aca marcamos la "relacion"
            required: true
        },
        titulo: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        imagen: {
            type: String,
            required: false
        },
        created_at: {
            type: Date,
            default: Date.now   
        },
        active: {
            type: Boolean,
            default: true
        }
    }
)

const workspaces= mongoose.model ("workspaces", workspacesSchema)
export default workspaces