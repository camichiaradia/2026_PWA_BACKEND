import workspaceMember from "../models/workspaceMember.model.js";
import workspaces from "../models/workspaces.model.js";

class WorkspaceRepository {

    async getById(workspace_id) {
        return await workspaces.findById(workspace_id)
    }

    async getWorkspacesByUserId(user_id) {
        //Busco a todos los miembros que pertenezcan al usuario
        //Esto seria buscar todas mis membresias
        const workspace = await workspaceMember.find({ fk_id_user: user_id })
            .populate({
                path: 'fk_id_workspace',
                match: { active: true } //Solo quiero los espacios de trabajo activos
            }) //Esto permite expandir sobre la referencia a la tabla de espacios de trabajo
            .populate({
                path: 'fk_id_user',
                select: 'nombre email' // Esto traerá los datos de la colección 'users'
            });

        const members_workspace = workspace.filter((member) => member.fk_id_workspace !== null)
        return members_workspace.map(
            (member_workspace) => {
                return {
                    member_id: member_workspace._id,
                    member_role: member_workspace.role,
                    member_id_user: member_workspace.fk_id_user,
                    workspace_imagen: member_workspace.fk_id_workspace.imagen,
                    workspace_titulo: member_workspace.fk_id_workspace.titulo,
                    workspace_id: member_workspace.fk_id_workspace._id
                }
            }
        )
    }


    //creamos un espacio de trabajo: workspaces
    async create(fk_id_owner, titulo, imagen, description) {
        const workspace = await workspaces.create({
            fk_id_owner,
            titulo,
            imagen,
            description
        })
        return workspace
    }

    async addMember(workspace_id, user_id, role) {
        const member = await workspaceMember.create({
            fk_id_workspace: workspace_id,
            fk_id_user: user_id,
            role
        })
        return member
    }

    //Obtener miembro de un espacio de trabajo por id de espacio de trabajo y id de usuario
    async getMemberByWorkspaceIdAndUserId(workspace_id, user_id) {
        const member = await workspaceMember.findOne({
            fk_id_workspace: workspace_id,
            fk_id_user: user_id
        })
        return member
    }

    async update(workspace_id, data) {
        return await workspaces.findByIdAndUpdate(workspace_id, data, { new: true });
    }

    async delete(workspace_id) {
        await workspaces.findByIdAndUpdate(workspace_id, { active: false })
    }

    async inviteMember(workspace_id, user_id, role) {
        const member = await workspaceMember.create({
            fk_id_workspace: workspace_id,
            fk_id_user: user_id,
            role
        })
        return member
    }
}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository