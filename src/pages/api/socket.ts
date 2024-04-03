import type { NextApiRequest } from "next";
import { checkJWT } from "../../server/helpers/user.helper";
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
      let userId = '';

      socket.on('authenticate', async (id) => {
        //const id = 'ghgjkh'//, role } = checkJWT(token);
        //if (id) {
        authenticated = true;
        userId = id;
        users_dict[userId] = socket.id;
        socket.emit('authenticated');
        //}
        console.log(users_dict)
      });

      socket.on('message', async (msg, recipientId) => {
        if (!authenticated) return;
        io.to(users_dict[recipientId]).emit('message', msg, userId);
      })

      socket.on('disconnect', () => {
        authenticated = false;
        delete users_dict[userId];
      });
    });

    res.socket.server.io = io

  }

  res.end()
}


