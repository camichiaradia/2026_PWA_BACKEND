import ENVIRONMENT from "../config/environment.config.js"
import workspaceRepository from "../repository/workspace.repository.js"
import ServerError from "../helpers/error.helpers.js"
import userRepository from "../repository/user.repository.js"
import jwt from "jsonwebtoken"
import mail_transporter from "../config/mail.config.js"
import workspaces from "../models/workspaces.model.js"

class WorkspaceController {
    async getWorkspaces (request, response){
        try{
            //Quiero obtener los espacios de trabajo asociados al cliente que hace la consulta
            console.log("El usuario logueado es: ", request.user) //request.user
            const user_id = request.user.id
            const workspaces = await workspaceRepository.getWorkspacesByUserId(user_id)
            return response.json({
                ok: true,
                data: {
                    workspaces
                }
            })
            }
            catch (error) {
                console.error("Error en getWorkspaces:", error);
                return response.status(500).json({
                    ok: false,
                    message: "Error al obtener los espacios de trabajo",
                    error: error.message
                });
            }
    }

    async create (request, response) {
        try{
            const { titulo, imagen, description } = request.body
            const user_id = request.user.id
            
            console.log("1. Creando workspace para el usuario:", user_id)
            const workspace = await workspaceRepository.create(user_id, titulo, imagen, description)

            console.log("2. Workspace creado con ID:", workspace._id);

            const nuevaMembresia = await workspaceRepository.addMember(workspace._id, user_id, 'owner')
            console.log("3. Membresía de owner creada:", nuevaMembresia);

            response.json({
                ok: true,
                data: {
                    workspace
                }
            })
    }
    catch (error) {
        console.error("ERROR AL CREAR:", error);
        response.status(500).json({ ok: false, message: error.message })
    }
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
            if (member_info.role.toLowerCase() !== 'owner') {
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

    async addMemberRequest(request, response) {
            try {

//2.El email del usuario a invitar existe
                const {email, role} = request.body
                const workspaces = request.workspace
                console.log({workspaces})

                if (!workspace_data) {
                    throw new ServerError('El middleware no encontró el workspace', 404);
                }
                const already_member = await workspaceRepository.getMemberByWorkspaceIdAndUserId(
                workspace_data._id, 
                user_to_invite._id
                );
                console.log({already_member})
                if(already_member){
                    throw new ServerError('El usuario ya es miembro de este espacio de trabajo', 400)
                }

                console.log({workspaces})
                const user_to_invite = await userRepository.buscarUnoPorEmail(email)
                if(!user_to_invite){
                    throw new ServerError('El email del invitado no existe.', 404)
                }
//hacer variable de que el rol sea un rol valido
                if(role !== 'owner' && role !== 'admin' && role !== 'member'){
                    throw new ServerError('El rol no es valido', 400)
                }

//4.Enviar un mail al usuario con un link de 'aceptar invitacion' y un token en ese link
                //Acá hacemos el token
                const token = jwt.sign(
                    {
                        id: user_to_invite._id,
                        email,
                        workspace: workspaces._id,
                        role
                    },
                    ENVIRONMENT.JWT_SECRET_KEY
                )
                //Acá hacemos el email
                await mail_transporter.sendMail(
                    {
                        to: email,
                        from: ENVIRONMENT.GMAIL_USERNAME,
                        subject: `Has sido invitado a ${workspaces.titulo} `,
                        html: `
                            <h1>Has sido invitado a participar en el espacio de trabajo: ${workspaces.titulo}</h1>
                            <p>Si no reconoces esta invitacion por favor desestima este mail</p>
                            <p>Da click a 'aceptar invitacion' para aceptar la invitacion</p>
                            <a
                            href='${ENVIRONMENT.URL_BACKEND}/api/workspace/${workspaces._id}/members/accept-invitation?invitation_token=${token}'
                            >Aceptar invitacion</a>
                        `
                    }
                )

                return response.json(
                    {
                        status: 201,
                        ok: true, 
                        message: "invitacion enviada",
                        data: null
                    }
                ) 
            }
            catch (error) {
                console.log("Error en addMember", error)
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

     async acceptInvitation (request, response){
        try{
            const {invitation_token} = request.query

            const payload = jwt.verify(invitation_token, ENVIRONMENT.JWT_SECRET_KEY)
            const {id, workspace: workspace_id, role} = payload 
            await workspaceRepository.addMember(workspace_id, id, role)

            response.redirect(`${ENVIRONMENT.URL_FRONTEND}/`)
        }
        catch(error){
            console.log({error})
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