import { rejectedConnection, setStatus, setPitchAndRoll, setPosition, setSpeed, setBattery } from '@/store/uavSlice';

export default class MsgHandler {

  public static incoming(msg: string, dispatch: any) {
    const msgObj = JSON.parse(msg);

    switch (msgObj.type) {
      case 'acceptedConnection':
        localStorage.setItem('uavpass', msgObj.uavpass);
        break;
      case 'rejectedConnection':
        dispatch(rejectedConnection(0))
        // muestro error
        break
      case 'status':
        dispatch(setPosition({ uavIndex: 0, position: { lat: msgObj.lat, lon: msgObj.lon, alt: msgObj.alt, relative_alt: 0, hdg: msgObj.yaw } }))
        dispatch(setPitchAndRoll({ uavIndex: 0, pitch: msgObj.pitch, roll: msgObj.roll }))
        dispatch(setSpeed({ uavIndex: 0, speed: msgObj.ground_speed }))
        dispatch(setBattery({ uavIndex: 0, battery: msgObj.battery_percent }))
        break
      case 'armed':
        dispatch(setStatus({ uavIndex: 0, status: 'Armed' }))
        break
      case 'disarmed':
        dispatch(setStatus({ uavIndex: 0, status: 'Connected' }))
        break
      case 'accepted_takeoff':
        dispatch(setStatus({ uavIndex: 0, status: 'Takeoff' }))
        break
      case 'flying':
        dispatch(setStatus({ uavIndex: 0, status: 'Flying' }))
        break
      case 'accepted_land':
        dispatch(setStatus({ uavIndex: 0, status: 'Landing' }))
        break
      case 'landed':
        dispatch(setStatus({ uavIndex: 0, status: 'Connected' }))
        break
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