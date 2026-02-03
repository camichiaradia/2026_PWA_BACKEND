import workspaceChannels from "../models/workspaceChannels.model.js"

class ChannelRepository {

    // Método nuevo para buscar por nombre dentro de un workspace
    async findByNameAndWorkspace(nombre, workspace_id) {
        // Buscamos un documento que coincida con AMBOS criterios
        return await workspaceChannels.findOne({
            nombre: nombre,
            fk_id_workspace: workspace_id
        })
    }

    async create(workspace_id, nombre){
        return await workspaceChannels.create({
            nombre: nombre, 
            fk_id_workspace: workspace_id
        })
    }

    async getAllByWorkspaceId(workspace_id){
        return await workspaceChannels.find({
            fk_id_workspace: workspace_id
        })
    }

    async getByIdAndWorkspaceId(channel_id, workspace_id){
        return await workspaceChannels.findOne({_id: channel_id, fk_id_workspace: workspace_id})
    }
}

const channelRepository = new ChannelRepository()
export {channelRepository}