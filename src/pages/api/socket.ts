import type { NextApiRequest } from "next";
//import { checkJWT } from "../../server/helpers/user.helper";
import uavController from "@/server/controllers/uav.controller";
import onlineuavModel from "@/server/models/onlineuav.model";
import { NextApiResponseServerIO } from "@/types/next";
import { Server as ServerIO, Socket } from "socket.io";
import { Server as NetServer } from "http";
interface UsersDict {
  [key: string]: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {

  if (!res.socket.server.io) {

    const httpServer: NetServer = res.socket.server as any
    const io: ServerIO = new ServerIO(httpServer)

    io.on('connection', (socket) => {
      let authenticated = false;
      //let socketClientId = '';

      socket.on('authenticateuav', async (uavname, password) => {
        const uavId = await uavController.socketLogin(uavname, password);
        if (uavId) {
          await onlineuavModel.online({ uavname, uavId, connected: true, socketId: socket.id });
          authenticated = true;
          socket.emit('authenticateduav', socket.id);
        }
      })

      socket.on('authenticate', async (id) => {
        // debo checkear en la base de datos
        authenticated = true;
        socket.emit('authenticated', socket.id);
      });

      socket.on('message', async (msg, socketRecipientId) => {
        if (!authenticated) return;
        io.to(socketRecipientId).emit('message', msg, socket.id);
      })

      socket.on('disconnect', () => {
        authenticated = false;
      });
    });

    res.socket.server.io = io

  }

  res.end()
}