# POST /api/workspace/:workspace_id/members
- Body: {email, role}
    
1. El cliente pertenece al workspace y tiene un rol de owner o admin - (lo resuelve el workspace.middleware)
2. El email del usuario a invitar existe - (lo resuelve workspace.controller)
3. El usuario aun no es miembro del workspace (No queremos doble membresia) - (lo resuelve workspace.controller)
4. Enviar un mail al usuario con un link de 'aceptar invitacion' y un token en ese link
    - el link debe llevar a /api/workspace/:workspace_id/members/accept-invitation?invitation_token={token} 
    4.1 El token debe tener {user_id, workspace_id, role}
# GET /api/workspace/:workspace_id/members/accept-invitation?invitation_token={token}
1. Verificar el token
2. Crear el miembro con el rol correspondiente
3. Redireccionar al frontend



buscar en la lista de miebros por user_id