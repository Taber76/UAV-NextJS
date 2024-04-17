# FUNCIONAMIENTO
## SERVIDOR
- API REST para: login de UAVs, obtener todos los UAVs conectados al servidor y login de usuarios.
- Websocket para comunicacion entre usuarios y UAVs
## FRONTEND
- Login de usuarios.
- Pagina principal.
    - Barra de estado.
      - Botones de ARM, TAKEOFF y LAND.
      - Menu desplegable para conectarse a UAV disponible: al selecionar un UAV obtiene el socketId y uavname del UAV, le envia un mensaje para establecer conexion con el, y crea el UAV en el store.
      - Badge de estado del UAV.
      - Nivel de bateria del UAV.
    - Waypoints: Lista desplegable de waypoints que permite borrarlos tambien.
    - Instrumentos de vuelo del UAV.
    - Mapa.
      - Muestra posicion y orientacion del UAV.
      - Muestra waypoints.
    - Esta pagina inicia comunicacion con el websocket y maneja los mensajes a traves de la libreria msgHandler (que hace los dispatch correspondiente o envia mensajes al UAV). Tambien envia un "latido" para provocar que el UAV envie los datos de su estatus y se encarga de mantener sicronizados los arrays de waypoints del store y del UAV.
- Componentes.
  - Map: ademas de mostrar el mapa, dibuja la posicion y orientacion del UAV y los waypoints. Este componete despacha los nuevos waypoints al store.
  - StatusBar: envia comandos al UAV a traves de los botones ARM/DISARM, TAKEOFF y LAND
## LOGICA DE COMUNICACION
- 1: Al encender el UAV, este se comunica con el servidor que lo autentifica y lo guarda en la lista (base de datos) de UAV conectados, y le provee conexion websocket.
- 2: El cliente frontend tiene acceso a la lista de UAV conectados, entonces cuando selecciona uno obitene el socketId del mismo y su nombre.
- 3: Al seleccionar un UAV el cliente le envia un mensaje de conexion y el UAV envia la respuesta **'acceptedConnection'** con un passkey que se almacena en el localSorage. Este passkey es necesario enviarlo para que el UAV acepte los comandos del cliente. Si el campo **"health"** es true (el GPS esta enviando una ubicacion valida), se carga como primer waypoint (home) la posicion actual del UAV.
- 4: Una vez establecida la conexion con el UAV, el cliente comenienza a enviar un **heartbeat** para que el UAV responda con su estado.
- 5: El cliente puede marcar waypoints en el mapa, cada vez que agregue uno ademas de almacenarse en el store, se envia al UAV.
- 6: El cliente puede enviar commandos de ARM/DISARM, TAKEOFF y LAND al UAV. El UAV respondera si acepto estos comandos.
- 7: Cuando el UAV alcance un waypoint pasara a dirigirse al siguiente y le enviara el mensaje **'reached_waypoint'** al cliente. El cliente se encargara de quitar ese waypoint de la lista **waypoints** y agregarlo a la lista de **reachedWaypoints**, tambien de enviar la lista actualizada al UAV. Tanto el cliente como el UAV mantienen una lista de waypoints por si alguno de ellos pierde la conexion momentaneamente con el socket.
