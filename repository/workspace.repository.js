import workspaceMember from "../models/workspaceMember.model.js";
import workspaces from "../models/workspaces.model.js";

class WorkspaceRepository {

    async getById(workspace_id){
        return await workspaces.findById(workspace_id)
    }

    async getWorkspacesByUserId(user_id){
        //Busco a todos los miembros que pertenezcan al usuario
        //Esto seria buscar todas mis membresias
        const workspaces = await workspaceMember.find({fk_id_user: user_id})
        .populate({
            path: 'fk_id_workspace',
            match: { active: true } //Solo quiero los espacios de trabajo activos
        }) //Esto permite expandir sobre la referencia a la tabla de espacios de trabajo

        return workspaces.filter((member)=> member.fk_id_workspace !== null) //Eliminamos los nulls.
    }
    async create (fk_id_owner, titulo, imagen, description){
        const workspace = await workspaces.create({
            fk_id_owner,
            titulo,
            imagen,
            description
        })
        return workspace
    }

    async addMember (workspace_id, user_id, role){
        const member = await workspaceMember.create({
            fk_id_workspace: workspace_id,
            fk_id_user: user_id,
            role
        })
        return member
    }

    //Obtener miembro de un espacio de trabajo por id de espacio de trabajo y id de usuario
    async getMemberByWorkspaceIdAndUserId(workspace_id, user_id){
        const member = await workspaceMember.findOne({fk_id_workspace: workspace_id, fk_id_user: user_id})
        return member
    }
    
    async delete(workspace_id){
        await workspaces.findByIdAndUpdate(workspace_id, {active: false})
    }

}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository