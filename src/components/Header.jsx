import React from 'react';
import { Fuel, Settings, Printer, Download, Users, PlusCircle } from 'lucide-react';
import { formatCurrency } from '../utils/storage';

export const Header = ({
  users,
  activeUserId,
  onSelectUser,
  onOpenSettings,
  onOpenPrint,
  onExportBackup,
  totalMonthAmount
}) => {
  const activeUser = users.find(u => u.id === activeUserId) || users[0];

  return (
    <header className="header-container no-print">
      <div className="header-top">
        <div className="brand-group">
          <div className="brand-icon">
            <Fuel size={24} className="icon-pulse" />
          </div>
          <div>
            <h1 className="brand-title">Control de Viáticos</h1>
            <p className="brand-subtitle">Gestión de traslados, kilometraje y combustible</p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="action-btn secondary"
            onClick={onExportBackup}
            title="Descargar copia de seguridad en JSON"
          >
            <Download size={17} />
            <span className="btn-label">Copia de Seguridad</span>
          </button>

          <button 
            className="action-btn secondary"
            onClick={onOpenPrint}
            title="Vista de impresión y liquidación formal"
          >
            <Printer size={17} />
            <span className="btn-label">Planilla Formal</span>
          </button>

          <button 
            className="action-btn primary"
            onClick={onOpenSettings}
            title="Configurar precios de nafta, rendimientos y usuarios"
          >
            <Settings size={17} />
            <span>Configuración</span>
          </button>
        </div>
      </div>

      {/* Selector de los 4 Usuarios */}
      <div className="user-selector-bar">
        <div className="selector-label">
          <Users size={16} />
          <span>Persona:</span>
        </div>
        <div className="user-pills">
          {users.map((user) => {
            const isActive = user.id === activeUserId;
            return (
              <button
                key={user.id}
                onClick={() => onSelectUser(user.id)}
                className={`user-pill ${isActive ? 'active' : ''}`}
                style={{
                  '--user-color': user.avatarColor || '#3b82f6'
                }}
              >
                <div 
                  className="user-avatar"
                  style={{ backgroundColor: user.avatarColor || '#3b82f6' }}
                >
                  {user.initials || user.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="user-name">{user.name}</span>
                {isActive && <div className="active-dot" />}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
