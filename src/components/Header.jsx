import React from 'react';
import { Fuel, Settings, FileSpreadsheet, Download, Users, ArrowLeftRight } from 'lucide-react';

export const Header = ({
  users,
  activeUserId,
  onSelectUser,
  onOpenSettings,
  onOpenExport,
  onExportBackup,
  onOpenUserSelection
}) => {
  const activeUser = users.find(u => u.id === activeUserId) || users[0];

  return (
    <header className="header-container no-print">
      <div className="header-top">
        <div className="brand-group" onClick={onOpenUserSelection} style={{ cursor: 'pointer' }} title="Volver a selección de integrante">
          <div className="brand-icon">
            <Fuel size={24} className="icon-pulse" />
          </div>
          <div>
            <h1 className="brand-title">Control de Viáticos</h1>
            <p className="brand-subtitle">Gestión de traslados, kilometraje y combustible</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Botón para cambiar de usuario */}
          <button 
            className="action-btn secondary switch-user-btn"
            onClick={onOpenUserSelection}
            title="Cambiar de persona"
          >
            <ArrowLeftRight size={17} />
            <span className="btn-label">Cambiar Persona</span>
          </button>

          {/* Botón Exportar Reporte (Excel / PDF) */}
          <button 
            className="action-btn export-btn-highlight"
            onClick={onOpenExport}
            title="Exportar reporte del mes a Excel o PDF"
          >
            <FileSpreadsheet size={17} />
            <span className="btn-label">Exportar Reporte</span>
          </button>

          {/* Botón Configuración de Tarifas y KM/L */}
          <button 
            className="action-btn primary"
            onClick={onOpenSettings}
            title="Configurar precios de nafta, rendimientos y vehículos"
          >
            <Settings size={17} />
            <span>Configuración</span>
          </button>

          {/* Botón Copia de Seguridad */}
          <button 
            className="action-btn icon-only-btn"
            onClick={onExportBackup}
            title="Descargar copia de seguridad en JSON"
          >
            <Download size={17} />
          </button>
        </div>
      </div>

      {/* Selector de los 4 Integrantes */}
      <div className="user-selector-bar">
        <div className="selector-label">
          <Users size={16} />
          <span>Persona activa:</span>
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
