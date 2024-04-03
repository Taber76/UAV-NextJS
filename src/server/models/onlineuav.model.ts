import { Model } from 'mongoose';
import MongoDB from '../config/mongodb';
import { IOnlineUav, OnlineUavSchema } from '../schemas/onlineuav.schema';

class OnlineUavModel {
  private model: Model<IOnlineUav>;

  public constructor() {
    this.model = MongoDB.getInstance().getConnection().model('OnlineUav', OnlineUavSchema);
  }

  public async online(uav: IOnlineUav): Promise<boolean> {
    try {
      const ckeckUav = await this.model.findOne({ uavname: uav.uavname });
      if (!ckeckUav) {
        const newOnlineUav = new this.model(uav);
        await newOnlineUav.save();
        return true;
      }
      await this.model.updateOne({ uavname: uav.uavname }, uav);
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async getOnlineList(): Promise<IOnlineUav[] | null> {
    try {
      const onlineList = await this.model.find({ where: { connected: true } });
      return onlineList;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async putOffline(uavname: string): Promise<boolean> {
    try {
      await this.model.updateOne({ uavname }, { connected: false });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

}

export default new OnlineUavModel();