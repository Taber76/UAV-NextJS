import { setPosition, setPitchAndRoll, setSpeed, setBattery } from '@/store/uavSlice';

export default class MsgHandler {

  public static incoming(msg: string, dispatch: any) {
    const msgObj = JSON.parse(msg);

    switch (msgObj.type) {
      case 'acceptedConnection':
        localStorage.setItem('uavpass', msgObj.uavpass);
        return;
      case 'rejectedConnection':
        // muestro error
        return
      case 'batteryCheck':
        // actualizo el estado del uav
        return
      case 'status':
        dispatch(setPosition({ uavIndex: 0, position: { lat: msgObj.lat, lon: msgObj.lon, alt: msgObj.alt, relative_alt: 0, hdg: msgObj.yaw } }))
        dispatch(setPitchAndRoll({ uavIndex: 0, pitch: msgObj.pitch, roll: msgObj.roll }))
        dispatch(setSpeed({ uavIndex: 0, speed: msgObj.ground_speed }))
        dispatch(setBattery({ uavIndex: 0, battery: msgObj.battery_percent }))
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