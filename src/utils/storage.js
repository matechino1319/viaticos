import { DEFAULT_USERS, DEFAULT_SETTINGS, INITIAL_TRIPS } from './constants';

const STORAGE_KEYS = {
  USERS: 'viaticos_app_users_v1',
  SETTINGS: 'viaticos_app_settings_v1',
  TRIPS: 'viaticos_app_trips_v1',
  ACTIVE_USER: 'viaticos_app_active_user_v1',
  SELECTED_MONTH: 'viaticos_app_selected_month_v1'
};

export const loadData = () => {
  try {
    const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedTrips = localStorage.getItem(STORAGE_KEYS.TRIPS);
    const savedActiveUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    const savedSelectedMonth = localStorage.getItem(STORAGE_KEYS.SELECTED_MONTH);

    let parsedUsers = savedUsers ? JSON.parse(savedUsers) : DEFAULT_USERS;
    // Migración automática si los usuarios tenían nombres genéricos
    if (parsedUsers && parsedUsers.length === 4) {
      parsedUsers = parsedUsers.map((u, i) => {
        if (u.name.startsWith('Persona ')) {
          return DEFAULT_USERS[i];
        }
        return u;
      });
    }

    return {
      users: parsedUsers,
      settings: savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS,
      trips: savedTrips ? JSON.parse(savedTrips) : INITIAL_TRIPS,
      activeUserId: savedActiveUser || DEFAULT_USERS[0].id,
      selectedMonth: savedSelectedMonth || '2026-08' // Mes inicial de la planilla
    };
  } catch (error) {
    console.error('Error al leer localStorage:', error);
    return {
      users: DEFAULT_USERS,
      settings: DEFAULT_SETTINGS,
      trips: INITIAL_TRIPS,
      activeUserId: DEFAULT_USERS[0].id,
      selectedMonth: '2026-08'
    };
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const saveSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const saveTrips = (trips) => {
  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
};

export const saveActiveUserId = (id) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, id);
};

export const saveSelectedMonth = (monthStr) => {
  localStorage.setItem(STORAGE_KEYS.SELECTED_MONTH, monthStr);
};

// Formateador de moneda en pesos argentinos
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

// Formateador de números (km, litros)
export const formatNumber = (num, decimals = 2) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Number(num).toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
};

// Exportar backup en JSON
export const exportDataBackup = (state) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `viaticos_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
