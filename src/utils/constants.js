// Configuración inicial y datos por defecto

export const DEFAULT_USERS = [
  { id: 'user-1', name: 'Mateo Martinez', initials: 'MM', avatarColor: '#3b82f6' },
  { id: 'user-2', name: 'Persona 2', initials: 'P2', avatarColor: '#10b981' },
  { id: 'user-3', name: 'Persona 3', initials: 'P3', avatarColor: '#f59e0b' },
  { id: 'user-4', name: 'Persona 4', initials: 'P4', avatarColor: '#8b5cf6' }
];

export const DEFAULT_SETTINGS = {
  auto: {
    nombre: 'Auto General (ej. Peugeot / Fiat)',
    kmPorLitro: 10,
    precioPorLitro: 2450.00
  },
  moto: {
    nombre: 'Motomel Tuning 110 blitz',
    kmPorLitro: 20,
    precioPorLitro: 2450.00
  }
};

// Viajes precargados iniciales (tomados directamente de la planilla provista)
export const INITIAL_TRIPS = [
  {
    id: 'trip-1',
    usuarioId: 'user-1',
    fecha: '2026-08-20',
    detalle: 'Se llevó toner a Libertador',
    km: 6.9,
    tipoVehiculo: 'moto'
  },
  {
    id: 'trip-2',
    usuarioId: 'user-1',
    fecha: '2026-08-20',
    detalle: 'Se llevo toner a recargar toner',
    km: 5.8,
    tipoVehiculo: 'moto'
  },
  {
    id: 'trip-3',
    usuarioId: 'user-1',
    fecha: '2026-08-31',
    detalle: 'Se llevo toner a recargar toner',
    km: 5.8,
    tipoVehiculo: 'moto'
  },
  {
    id: 'trip-4',
    usuarioId: 'user-1',
    fecha: '2026-09-01',
    detalle: 'Se llevo toner centro',
    km: 10.0,
    tipoVehiculo: 'moto'
  },
  {
    id: 'trip-5',
    usuarioId: 'user-1',
    fecha: '2026-09-02',
    detalle: 'Se llevo a recargar toner',
    km: 5.0,
    tipoVehiculo: 'moto'
  }
];

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
