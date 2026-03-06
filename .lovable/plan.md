## Sistema Hotelero - Módulo Clientes

### Diseño Visual

- Paleta principal: **amarillo** (#F59E0B / amber) como color primario, **negro** para detalles y textos importantes
- Estilo limpio y profesional con sidebar de navegación

### Estructura de Navegación

- **Sidebar** con navegación entre modulos y submodulos hijos de los módulos
- Un modulo clientes con dos submodulos : **Booking** y **Checking**

### Submódulo Booking (Calendario de Reservas)

- Vista tipo grilla/tabla:
  - **Columnas**: 15 días (por defecto), con navegación para avanzar/retroceder días
  - **Filas**: Habitaciones del hotel (datos mock, ej: Hab 101, 102, etc.)
  - **Celdas**: Muestran reservas con nombre del huésped. Si es reserva por horas, muestra el rango horario (ej: "14:00-18:00"). Las reservas que abarcan varios días se visualizan como bloques extendidos
- Datos de ejemplo hardcodeados para demostrar la funcionalidad

### Submódulo Checking (Estado de Habitaciones)

- Vista de tarjetas o grilla mostrando todas las habitaciones
- Cada habitación muestra su **número** y **estado actual** con código de color:
  - **VL** (Vacía Limpia) - verde
  - **VC** (Vacía Sucia) - naranja
  - **O** (Ocupada) - rojo
  - **FO** (Fuera de Orden) - gris
- Click o dropdown en cada habitación para **cambiar el estado**
- Estado se mantiene en memoria (React state)

### Datos Mock

- ~4 habitaciones de ejemplo
- ~5-6 reservas de ejemplo en el calendario (algunas por día, algunas por hora)