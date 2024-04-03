import { Model } from 'mongoose';
import MongoDB from '../config/mongodb';
import { IUav, UavSchema } from '../schemas/uav.schema';

class UavModel {
  private model: Model<IUav>;

  public constructor() {
    this.model = MongoDB.getInstance().getConnection().model('Uav', UavSchema);
  }

  public async login(uavname: string): Promise<IUav | null> {
    try {
      const uav = await this.model.findOne({ uavname });
      return uav;
    } catch (error) {
      console.error(error);
      return null;
    }

  }

}

export default new UavModel();