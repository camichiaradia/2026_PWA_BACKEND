import ENVIRONMENT from "../config/environment.config.js"
import workspaceRepository from "../repository/workspace.repository.js"
import ServerError from "../helpers/error.helpers.js"
import userRepository from "../repository/user.repository.js"
import jwt from "jsonwebtoken"
import mail_transporter from "../config/mail.config.js"
import workspaces from "../models/workspaces.model.js"
import workspaceChannels from "../models/workspaceChannels.model.js"
import { tryCatch } from "../helpers/tryCatch.helper.js"

class WorkspaceController {
    async getWorkspaces(request, response) {
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

    async create(request, response) {
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

    async delete(request, response) {
        const user_id = request.user.id
        const { workspace_id } = request.params

        const workspace_selected = await workspaceRepository.getById(workspace_id)
        if (!workspace_selected) {
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

    async addMember(request, response) {
        //2.El email del usuario a invitar existe // Obtenemos el workspace inyectado por el middleware
        const { email, role } = request.body
        const workspace_data = request.workspace
        console.log({ workspace_data })

        if (!workspace_data) {
            throw new ServerError('El middleware no encontró el workspace', 404);
        }

        console.log({ workspaces })

        //hacer variable de que el rol sea un rol valido
        // 1. Validar el rol
        const validRoles = ['owner', 'admin', 'user'];
        if (!validRoles.includes(role)) {
            throw new ServerError('El rol no es válido', 400);
        }

        //2. Buscar usuario invitado por email
        const user_to_invite = await userRepository.buscarUnoPorEmail(email)
        if (!user_to_invite) {
            throw new ServerError('El email del invitado no existe.', 404)
        }

        // 3. Verificar si ya es miembro
        const already_member = await workspaceRepository.getMemberByWorkspaceIdAndUserId(
            workspace_data._id,
            user_to_invite._id
        );
        console.log({ already_member })

        if (already_member) {
            throw new ServerError('El usuario ya es miembro de este espacio de trabajo', 400)
        }

        //4. Generar Token de invitacion y enviar email
        const token = jwt.sign(
            {
                id: user_to_invite._id,
                email,
                workspace: workspace_data._id,
                role
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )

        //5. Enviar Email
        await mail_transporter.sendMail(
            {
                to: email,
                from: ENVIRONMENT.GMAIL_USERNAME,
                subject: `Has sido invitado a ${workspace_data.titulo} `,
                html: `
                    <h1>Has sido invitado a participar en el espacio de trabajo: ${workspace_data.titulo}</h1>
                    <p>Si no reconoces esta invitacion por favor desestima este mail</p>
                    <p>Da click a 'aceptar invitacion' para aceptar la invitacion</p>
                    <a
                    href='${ENVIRONMENT.URL_BACKEND}/api/workspace/${workspace_data._id}/members/accept-invitation?invitation_token=${token}'
                    >Aceptar invitacion</a>
                `
            })

        return response.json(
            {
                status: 201,
                ok: true,
                message: "invitacion enviada",
                data: null
            }
        )
    }

    async acceptInvitation(request, response) {
        const { invitation_token } = request.query

        const payload = jwt.verify(invitation_token, ENVIRONMENT.JWT_SECRET_KEY)
        const { id, workspace: workspace_id, role } = payload
        await workspaceRepository.addMember(workspace_id, id, role)

        response.redirect(`${ENVIRONMENT.URL_FRONTEND}/`)
    }

    async getById(request, response) {
        const { workspace, member } = request;

        return response.json({
            ok: true,
            message: 'Espacio de trabajo seleccionado',
            data: {
                workspace,
                member
            },
        })
    }

    async getChannels(request, response) {
        // El ID del workspace viene de los parámetros de la URL
        const user_id = request.user.id
        const { workspace_id } = request.params;

        const channels = await workspaceChannels.find({
            fk_id_workspace: workspace_id,
            active: true
        });

        return response.json({
            ok: true,
            message: "Canales obtenidos correctamente",
            data: channels
        });
    }
}

const workspaceController = new WorkspaceController()

workspaceController.getWorkspaces = tryCatch(workspaceController.getWorkspaces)
workspaceController.create = tryCatch(workspaceController.create)
workspaceController.delete = tryCatch(workspaceController.delete)
workspaceController.addMember = tryCatch(workspaceController.addMember)
workspaceController.acceptInvitation = tryCatch(workspaceController.acceptInvitation)
workspaceController.getById = tryCatch(workspaceController.getById)
workspaceController.getChannels = tryCatch(workspaceController.getChannels)

export default workspaceController