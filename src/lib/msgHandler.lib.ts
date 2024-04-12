import { setPosition, setPitchAndRoll } from '@/store/uavSlice';

export default class MsgHandler {

  public static incoming(msg: string, dispatch: any) {
    const msgObj = JSON.parse(msg);
    /////////// REVISAR guardado en local storage!!!!!

    switch (msgObj.type) {
      case 'acceptedConnection':
        console.log('Accepted connection');
        localStorage.setItem('uavpass', msgObj.pass);
        return;
      case 'rejectedConnection':
        // muestro error
        return
      case 'batteryCheck':
        // actualizo el estado del uav
        return
      case 'stauts':
        dispatch(setPosition({ uavIndex: 0, position: { lat: msgObj.lat, lon: msgObj.lon, alt: msgObj.alt, relative_alt: 0, hdg: msgObj.yaw } }))
        dispatch(setPitchAndRoll({ uavIndex: 0, pitch: msgObj.pitch, roll: msgObj.roll }))
        return
      default:
        break;
    }
  }

  public static outgoing(data: any) {
    switch (data.type) {
      case 'connectUav':
        return JSON.stringify({
          username: data.username,
          userSocket: data.userSocket,
        })
      case 'disconnectUav':
        return JSON.stringify({
          uavpass: localStorage.getItem('uavpass'),
          username: data.username,
          userSocket: data.userSocket
        })
      case 'sendCommand':
        return JSON.stringify({ ...data.command, uavpass: localStorage.getItem('uavpass') })
      default:
        break;
    }
  }

}