import express from "express";
import workspaceController from "../controllers/workspace.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import workspaceMiddleware from "../middlewares/workspace.middleware.js";
import { channelController } from "../controllers/channel.controller.js";
import channelMiddleware from "../middlewares/channel.middleware.js";
import messagesController from "../controllers/messages.controller.js";
import { channelRepository } from "../repository/channel.repository.js";



const workspaceRouter = express.Router()

// Crear Workspaces
workspaceRouter.post('/', authMiddleware, workspaceController.create)
// Obtener Workspaces
workspaceRouter.get('/', authMiddleware, workspaceController.getWorkspaces)

// Obtener un workspace específico (Solo si eres miembro)
workspaceRouter.get('/:workspace_id', authMiddleware, workspaceMiddleware(), workspaceController.getById)

//Eliminar a un id, del espacio de trabajo
workspaceRouter.delete('/:workspace_id', authMiddleware, workspaceController.delete)

//Acepta a un nuevo miembro al espacio de trabajo solo si es owner/admin
workspaceRouter.post(
    '/:workspace_id/members', 
    authMiddleware, 
    workspaceMiddleware(['owner', 'admin']), 
    workspaceController.addMember)
//Enviar invitación a un usuario para que ingrese al espacio de trabajo
workspaceRouter.get('/:workspace_id/members/accept-invitation', workspaceController.acceptInvitation)

// Chanells: Crear canales
workspaceRouter.post(
    '/:workspace_id/channels', 
    authMiddleware, 
    workspaceMiddleware(['owner', 'admin']),
    channelController.create)
// Chanells: Obtener los canales de un workspace específico (Solo si eres miembro)
workspaceRouter.get('/:workspace_id/channels', 
    authMiddleware, 
    workspaceMiddleware(), 
    channelController.getAllByWorkspaceId)


//Rutas del Channel.middleware.js
workspaceRouter.get(
    '/:workspace_id/channels/:channel_id', 
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    channelController.getAllByWorkspaceId
);

//Crear Mensaje
workspaceRouter.post(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    messagesController.create)
//Obtener mensajes relacionados al canal
workspaceRouter.get(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    messagesController.getByChannelId)




export default workspaceRouter