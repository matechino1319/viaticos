import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ArrowLeftRight, Settings, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { MONTH_NAMES } from '../utils/constants';
import { formatCurrency, formatNumber } from '../utils/storage';

export const YearMonthGrid = ({
  selectedMonth,
  onSelectMonth,
  trips = [],
  activeUser,
  settings,
  onChangeUser,
  onOpenSettings,
  onOpenExport
}) => {
  const [selectedYear, setSelectedYear] = useState(() => {
    return parseInt(selectedMonth.split('-')[0], 10) || 2026;
  });

  const handlePrevYear = () => {
    setSelectedYear(y => y - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(y => y + 1);
  };

  return (
    <div className="year-months-section no-print animate-fade-in">
      {/* Barra superior de la vista de meses */}
      <div className="months-view-topbar">
        <div className="user-profile-badge">
          <div 
            className="user-avatar-medium"
            style={{ backgroundColor: activeUser?.avatarColor || '#3b82f6' }}
          >
            {activeUser?.initials || activeUser?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="profile-label">Persona activa:</span>
            <h2 className="profile-name">{activeUser?.name}</h2>
          </div>
          <button 
            onClick={onChangeUser} 
            className="switch-user-pill-btn"
            title="Cambiar de integrante"
          >
            <ArrowLeftRight size={14} />
            <span>Cambiar</span>
          </button>
        </div>

        <div className="topbar-actions">
          <button 
            onClick={onOpenSettings} 
            className="action-btn primary"
            title="Configurar rendimiento km/l y precio $/l para Moto y Auto"
          >
            <Settings size={16} />
            <span>Configurar Tarifas / Rendimiento</span>
          </button>

          <button 
            onClick={onOpenExport} 
            className="action-btn secondary"
            title="Exportar planilla a Excel o PDF"
          >
            <FileSpreadsheet size={16} />
            <span>Exportar Reporte</span>
          </button>
        </div>
      </div>

      <div className="year-header-bar">
        <div className="year-title-group">
          <Calendar size={20} className="text-blue" />
          <h3 className="year-heading">Meses del Año {selectedYear}</h3>
          <span className="year-badge">Hacé clic en un mes para cargar viajes y liquidar</span>
        </div>

        <div className="year-nav-controls">
          <button 
            onClick={handlePrevYear} 
            className="year-nav-btn"
            title="Año anterior"
          >
            <ChevronLeft size={18} />
            <span>{selectedYear - 1}</span>
          </button>
          
          <div className="current-year-pill">
            <span>{selectedYear}</span>
          </div>

          <button 
            onClick={handleNextYear} 
            className="year-nav-btn"
            title="Año siguiente"
          >
            <span>{selectedYear + 1}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Grid de 12 Meses */}
      <div className="months-grid">
        {MONTH_NAMES.map((name, index) => {
          const monthNumber = String(index + 1).padStart(2, '0');
          const monthKey = `${selectedYear}-${monthNumber}`;
          const isSelected = selectedMonth === monthKey;

          // Calcular viajes y totales del usuario para este mes específico
          const monthTrips = trips.filter(
            (t) => t.usuarioId === activeUser?.id && t.fecha && t.fecha.startsWith(monthKey)
          );

          const motoTrips = monthTrips.filter((t) => t.tipoVehiculo === 'moto');
          const autoTrips = monthTrips.filter((t) => t.tipoVehiculo === 'auto');

          const motoKm = motoTrips.reduce((acc, t) => acc + (t.km || 0), 0);
          const autoKm = autoTrips.reduce((acc, t) => acc + (t.km || 0), 0);
          const totalKm = motoKm + autoKm;

          const motoLitros = motoKm / (settings.moto.kmPorLitro || 20);
          const autoLitros = autoKm / (settings.auto.kmPorLitro || 10);
          const totalSubtotal = (motoLitros * settings.moto.precioPorLitro) + (autoLitros * settings.auto.precioPorLitro);

          const hasActivity = monthTrips.length > 0;

          return (
            <button
              key={monthKey}
              type="button"
              onClick={() => onSelectMonth(monthKey)}
              className={`month-card-item ${isSelected ? 'selected' : ''} ${hasActivity ? 'has-activity' : 'empty-month'}`}
            >
              <div className="month-card-top">
                <span className="month-name-text">{name}</span>
                {hasActivity && (
                  <span className="activity-badge">{monthTrips.length} {monthTrips.length === 1 ? 'viaje' : 'viajes'}</span>
                )}
              </div>

              <div className="month-card-body">
                {hasActivity ? (
                  <>
                    <div className="month-stat-row">
                      <span className="stat-dim">Total:</span>
                      <span className="stat-km">{formatNumber(totalKm, 1)} km</span>
                    </div>
                    <div className="month-total-amount">
                      {formatCurrency(totalSubtotal)}
                    </div>
                  </>
                ) : (
                  <div className="month-empty-state">
                    <span>Sin registros</span>
                  </div>
                )}
              </div>

              <div className="month-card-footer-hover">
                <span>Abrir mes</span>
                <ArrowRight size={14} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
