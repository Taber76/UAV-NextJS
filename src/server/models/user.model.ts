import { Model } from 'mongoose';
import MongoDB from '../config/mongodb';
import { IUser, UserSchema } from '../schemas/user.schema';

class UserModel {
  private model: Model<IUser>;

  public constructor() {
    this.model = MongoDB.getInstance().getConnection().model('User', UserSchema);
  }

  public async login(username: string): Promise<IUser | null> {
    try {
      const user = await this.model.findOne({ username });
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }

  }

}

export default new UserModel();