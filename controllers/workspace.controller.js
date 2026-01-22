import workspaceRepository from "../repository/workspace.repository.js"

class WorkspaceController {
    async getWorkspaces (request, response){
        //Quiero obtener los espacios de trabajo asociados al cliente que hace la consulta
        console.log("El usuario logueado es: ", request.user) //request.user
        const user_id = request.user.id
        const workspaces = await workspaceRepository.getWorkspacesByUserId(user_id)
        response.json({
            ok: true,
            data: {
                workspaces
            }
        })
    }

    async create (request, response) {
        const { titulo, imagen, description } = request.body
        const user_id = request.user.id
        const workspace = await workspaceRepository.create(user_id, titulo, imagen, description)
        await workspaceRepository.addMember(workspace._id, user_id, 'owner')
        response.json({
            ok: true,
            data: {
                workspace
            }
        })
    }

    async delete(request, response) {
        try {
            const user_id = request.user.id
            const { workspace_id } = request.params

            const workspace_selected = await workspaceRepository.getById(workspace_id)
            if(!workspace_selected){
                throw new ServerError('No existe ese espacio de trabajo', 404)
            }
            const member_info = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace_id, user_id)
            if (member_info.role !== 'owner') {
                throw new ServerError('No tienes permiso para eliminar este espacio de trabajo', 403)
            }
            await workspaceRepository.delete(workspace_id)
            response.json({
                ok: true,
                message: 'Espacio de trabajo eliminado correctamente',
                data: null,
                status: 200
            })
        }
        catch (error) {
            console.error("--- ERROR EN DELETE ---");
            console.error(error); // Imprime el stack trace completo
            
            /* Si tiene status decimos que es un error controlado (osea es esperable) */
            if (error.status) {
                return response.json({
                    status: error.status,
                    ok: false,
                    message: error.message,
                    data: null
                })
            }

            return response.json({
                ok: false,
                status: 500,
                message: "Error interno del servidor",
                data: null
            })
            

        }
    }
}

const workspaceController = new WorkspaceController()
export default workspaceController