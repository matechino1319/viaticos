// Configuración inicial y datos por defecto con configuraciones individuales por persona

export const DEFAULT_SETTINGS = {
  auto: {
    nombre: 'Auto General',
    kmPorLitro: 10,
    precioPorLitro: 2450.00
  },
  moto: {
    nombre: 'Motomel Tuning 110 blitz',
    kmPorLitro: 20,
    precioPorLitro: 2450.00
  }
};

export const DEFAULT_USERS = [
  {
    id: 'user-1',
    name: 'Mateo Martinez',
    initials: 'MM',
    avatarColor: '#2563eb',
    settings: {
      auto: { nombre: 'Auto Particular', kmPorLitro: 10, precioPorLitro: 2450.00 },
      moto: { nombre: 'Motomel Tuning 110 blitz', kmPorLitro: 20, precioPorLitro: 2450.00 }
    }
  },
  {
    id: 'user-2',
    name: 'Gonza',
    initials: 'GO',
    avatarColor: '#059669',
    settings: {
      auto: { nombre: 'Auto Particular', kmPorLitro: 10, precioPorLitro: 2450.00 },
      moto: { nombre: 'Moto', kmPorLitro: 20, precioPorLitro: 2450.00 }
    }
  },
  {
    id: 'user-3',
    name: 'Fede',
    initials: 'FE',
    avatarColor: '#d97706',
    settings: {
      auto: { nombre: 'Auto Particular', kmPorLitro: 10, precioPorLitro: 2450.00 },
      moto: { nombre: 'Moto', kmPorLitro: 20, precioPorLitro: 2450.00 }
    }
  },
  {
    id: 'user-4',
    name: 'Diego',
    initials: 'DI',
    avatarColor: '#7c3aed',
    settings: {
      auto: { nombre: 'Auto Particular', kmPorLitro: 10, precioPorLitro: 2450.00 },
      moto: { nombre: 'Moto', kmPorLitro: 20, precioPorLitro: 2450.00 }
    }
  }
];

// Viajes precargados iniciales
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
