import type { NextApiRequest, NextApiResponse } from 'next'
import UavModel from '../models/uav.model';
import OnlineUavModel from '../models/onlineuav.model';
import { checkPassword, createJWT } from '../helpers/user.helper';

class UavController {

  public async login(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { uavname, password } = req.body;
      const uav = await UavModel.login(uavname);
      if (!uav) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      if (!checkPassword(password, uav.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = createJWT(uav.id, uav.type);
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getOnlineList(req: NextApiRequest, res: NextApiResponse) {
    try {
      const onlineList = await OnlineUavModel.getOnlineList();
      res.status(200).json(onlineList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}

export default new UavController()