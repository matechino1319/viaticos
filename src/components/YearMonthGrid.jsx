import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { MONTH_NAMES } from '../utils/constants';
import { formatCurrency, formatNumber } from '../utils/storage';

export const YearMonthGrid = ({
  selectedMonth,
  onChangeMonth,
  trips = [],
  activeUserId,
  settings,
  onSelectMonthAndScroll
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
      <div className="year-header-bar">
        <div className="year-title-group">
          <Calendar size={20} className="text-blue" />
          <h2 className="year-heading">Meses del Año {selectedYear}</h2>
          <span className="year-badge">Elegí el mes a consultar o cargar</span>
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
            (t) => t.usuarioId === activeUserId && t.fecha && t.fecha.startsWith(monthKey)
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
              onClick={() => {
                onChangeMonth(monthKey);
                if (onSelectMonthAndScroll) {
                  onSelectMonthAndScroll();
                }
              }}
              className={`month-card-item ${isSelected ? 'selected' : ''} ${hasActivity ? 'has-activity' : 'empty-month'}`}
            >
              <div className="month-card-top">
                <span className="month-name-text">{name}</span>
                {isSelected && (
                  <span className="active-tag">Activo</span>
                )}
              </div>

              <div className="month-card-body">
                {hasActivity ? (
                  <>
                    <div className="month-stat-row">
                      <span className="stat-dim">{monthTrips.length} {monthTrips.length === 1 ? 'viaje' : 'viajes'}</span>
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
            </button>
          );
        })}
      </div>
    </div>
  );
};
