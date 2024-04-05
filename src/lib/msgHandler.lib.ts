export default class MsgHandler {

  public static incoming(msg: string) {
    const msgObj = JSON.parse(msg);
    switch (msgObj.type) {
      case 'acceptedConnection':
        localStorage.setItem('uavpass', msgObj.pass);
        return;
      case 'rejectedConnection':
        // muestro error
        return
      case 'status':
        // actualizo el estado del uav
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
          username: data.username,
          userSocket: data.userSocket
        })
      case 'sendCommand':
        return JSON.stringify(data.commnad)
      default:
        break;
    }
  }

}