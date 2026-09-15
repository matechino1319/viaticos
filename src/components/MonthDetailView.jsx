import React from 'react';
import { ArrowLeft, Plus, Calendar, FileSpreadsheet, Printer, Bike, Car } from 'lucide-react';
import { SummaryCards } from './SummaryCards';
import { TripTable } from './TripTable';
import { MONTH_NAMES } from '../utils/constants';
import { formatCurrency } from '../utils/storage';

export const MonthDetailView = ({
  selectedMonth,
  activeUser,
  trips = [],
  settings,
  onBackToMonths,
  onOpenTripModal,
  onEditTrip,
  onDeleteTrip,
  onOpenExport,
  motoStats,
  autoStats
}) => {
  const [yearStr, monthStr] = selectedMonth.split('-');
  const monthIdx = parseInt(monthStr, 10) - 1;
  const monthName = MONTH_NAMES[monthIdx];

  return (
    <div className="month-detail-view animate-fade-in">
      {/* Barra Superior del Mes */}
      <div className="month-detail-header-card no-print">
        <div className="month-header-left">
          <button 
            onClick={onBackToMonths}
            className="back-btn"
            title="Volver a la selección de meses"
          >
            <ArrowLeft size={18} />
            <span>Ver todos los Meses</span>
          </button>

          <div className="month-title-wrap">
            <div className="month-calendar-icon">
              <Calendar size={22} />
            </div>
            <div>
              <div className="month-subtitle-user">Viáticos de {activeUser.name}</div>
              <h1 className="month-main-title">{monthName} {yearStr}</h1>
            </div>
          </div>
        </div>

        <div className="month-header-actions">
          <button 
            onClick={onOpenExport}
            className="action-btn secondary"
            title="Exportar a Excel o PDF"
          >
            <FileSpreadsheet size={16} />
            <span>Exportar Mes</span>
          </button>

          <button 
            onClick={() => onOpenTripModal()}
            className="new-trip-highlight-btn"
            title="Registrar nuevo traslado o viaje"
          >
            <Plus size={18} />
            <span>Cargar Viaje / Día</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen Moto, Auto y Total */}
      <SummaryCards
        motoStats={motoStats}
        autoStats={autoStats}
        settings={settings}
        activeUserName={activeUser.name}
      />

      {/* Tabla con los viajes registrados en el mes */}
      <div className="month-table-wrapper">
        <TripTable
          trips={trips}
          settings={settings}
          onEditTrip={onEditTrip}
          onDeleteTrip={onDeleteTrip}
        />
      </div>
    </div>
  );
};
