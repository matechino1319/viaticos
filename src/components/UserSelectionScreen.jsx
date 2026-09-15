import React from 'react';
import { Users, Fuel, ChevronRight, Settings, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/storage';

export const UserSelectionScreen = ({
  users,
  trips = [],
  settings,
  onSelectUser,
  onOpenSettings
}) => {
  return (
    <div className="user-selection-view animate-fade-in">
      <div className="welcome-banner">
        <div className="welcome-icon-box">
          <Fuel size={36} className="welcome-fuel-icon" />
        </div>
        <h1 className="welcome-title">Sistema de Viáticos y Kilometraje</h1>
        <p className="welcome-subtitle">
          Seleccioná tu nombre para ver tus meses, registrar viajes y liquidar traslados
        </p>
      </div>

      <div className="users-cards-grid">
        {users.map((user) => {
          const userTrips = trips.filter((t) => t.usuarioId === user.id);
          const totalKm = userTrips.reduce((acc, t) => acc + (t.km || 0), 0);

          return (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className="user-card-large"
              style={{ '--accent-user-color': user.avatarColor || '#3b82f6' }}
            >
              <div 
                className="user-avatar-large"
                style={{ backgroundColor: user.avatarColor || '#3b82f6' }}
              >
                {user.initials || user.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="user-card-info">
                <h3 className="user-card-name">{user.name}</h3>
                <span className="user-card-role">Integrante de Equipo</span>
              </div>

              <div className="user-card-stats">
                <div className="user-stat-badge">
                  <strong>{userTrips.length}</strong> {userTrips.length === 1 ? 'viaje' : 'viajes'}
                </div>
                <div className="user-stat-badge">
                  <strong>{totalKm.toFixed(1)}</strong> km total
                </div>
              </div>

              <div className="user-card-btn-fake">
                <span>Ingresar al panel</span>
                <ArrowRight size={18} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="selection-footer-bar">
        <button 
          onClick={onOpenSettings} 
          className="settings-shortcut-btn"
          title="Modificar tarifas $/L y rendimiento km/l"
        >
          <Settings size={18} />
          <span>Configurar Tarifas y Rendimiento (Auto / Moto)</span>
        </button>
      </div>
    </div>
  );
};
