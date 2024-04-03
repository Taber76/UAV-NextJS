import type { NextApiRequest, NextApiResponse } from 'next'
import UserModel from '../models/user.model';
import { checkPassword, createJWT } from '../helpers/user.helper';

class UserController {

  public async login(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body;
    const user = await UserModel.login(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!checkPassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = createJWT(user.id, user.role);
    res.status(200).json({ token });
  }

}

export default new UserController()