import type { NextApiRequest, NextApiResponse } from 'next'
import UserModel from '../models/user.model';
import { checkPassword } from '../helpers/user.helper';

class UserController {

  public async login(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body;
    console.log(username, password)
    const user = await UserModel.login(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!checkPassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json(user);
  }

}

export default new UserController()