import type { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next";
import { Server as ServerIO, Socket } from "socket.io";
import { Server as NetServer } from "http";
interface UsersDict {
  [key: string]: string;
}

const users_dict: UsersDict = {}

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {

  if (!res.socket.server.io) {

    const httpServer: NetServer = res.socket.server as any
    const io: ServerIO = new ServerIO(httpServer)

    io.on('connection', (socket) => {
      let authenticated = false;
      let user_id = '';

      socket.on('authenticate', async (token) => {
        const id: string = token; // check token and return user_id
        console.log(token, ' authenticated.')
        if (id) {
          authenticated = true;
          user_id = id;
          users_dict[id] = socket.id;
          socket.emit('authenticated');
        }
        console.log(users_dict)
      });

      socket.on('message', async (msg, recipient_id) => {
        if (!authenticated) return;
        io.to(users_dict[recipient_id]).emit('message', msg, user_id);
      })

      socket.on('disconnect', () => {
        authenticated = false;
        delete users_dict[user_id];
      });
    });

    res.socket.server.io = io

  }

  res.end()
}


