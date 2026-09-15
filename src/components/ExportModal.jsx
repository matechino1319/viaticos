import React, { useState } from 'react';
import { X, FileSpreadsheet, Printer, Calendar, CheckCircle } from 'lucide-react';
import { MONTH_NAMES } from '../utils/constants';
import { exportMonthToExcel } from '../utils/excelExport';
import { formatCurrency, formatNumber } from '../utils/storage';

export const ExportModal = ({
  isOpen,
  onClose,
  users,
  activeUserId,
  trips,
  settings,
  selectedMonth,
  onOpenPrintModal
}) => {
  if (!isOpen) return null;

  const [exportMonth, setExportMonth] = useState(selectedMonth);
  const activeUser = users.find(u => u.id === activeUserId) || users[0];

  const [yearStr, monthStr] = exportMonth.split('-');
  const year = parseInt(yearStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;
  const monthName = MONTH_NAMES[monthIdx];

  // Filtrar viajes del mes a exportar para este usuario
  const monthTrips = trips.filter(t => {
    return t.usuarioId === activeUserId && t.fecha && t.fecha.startsWith(exportMonth);
  });

  const motoTrips = monthTrips.filter(t => t.tipoVehiculo === 'moto');
  const autoTrips = monthTrips.filter(t => t.tipoVehiculo === 'auto');

  const motoKm = motoTrips.reduce((acc, t) => acc + (t.km || 0), 0);
  const autoKm = autoTrips.reduce((acc, t) => acc + (t.km || 0), 0);

  const motoLitros = motoKm / (settings.moto.kmPorLitro || 20);
  const autoLitros = autoKm / (settings.auto.kmPorLitro || 10);

  const motoTotal = motoLitros * settings.moto.precioPorLitro;
  const autoTotal = autoLitros * settings.auto.precioPorLitro;
  const grandTotal = motoTotal + autoTotal;

  const handleExportExcel = () => {
    exportMonthToExcel({
      trips: monthTrips,
      settings,
      activeUser,
      selectedMonth: exportMonth
    });
    onClose();
  };

  const handleOpenPrint = () => {
    onClose();
    onOpenPrintModal(exportMonth);
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-container export-modal-box">
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <div className="export-icon-badge">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h2 className="modal-title">Exportar Reporte de Viáticos</h2>
              <p className="modal-subtitle">Generá planilla de cálculo en Excel o reporte formal en PDF</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="export-modal-body">
          {/* Selector de Mes para Exportar */}
          <div className="export-month-selector-group">
            <label className="input-label">
              <Calendar size={16} />
              <span>Seleccioná el mes a exportar:</span>
            </label>
            <div className="export-month-select-wrapper">
              <select
                value={exportMonth}
                onChange={(e) => setExportMonth(e.target.value)}
                className="custom-select export-select"
              >
                {MONTH_NAMES.map((mName, idx) => {
                  const mVal = `${yearStr}-${String(idx + 1).padStart(2, '0')}`;
                  const count = trips.filter(t => t.usuarioId === activeUserId && t.fecha?.startsWith(mVal)).length;
                  return (
                    <option key={mVal} value={mVal}>
                      {mName} {yearStr} {count > 0 ? `(${count} viajes)` : '(Sin viajes)'}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Resumen del Mes Seleccionado */}
          <div className="export-preview-card">
            <div className="preview-header">
              <div>
                <span className="preview-user-tag">{activeUser.name}</span>
                <h3 className="preview-period">{monthName} {yearStr}</h3>
              </div>
              <div className="preview-total-badge">
                <span className="total-label">Total Liquidación</span>
                <span className="total-value">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div className="preview-stats-grid">
              <div className="preview-stat-item">
                <span className="stat-label">Viajes</span>
                <span className="stat-value">{monthTrips.length}</span>
              </div>
              <div className="preview-stat-item">
                <span className="stat-label">Total KM</span>
                <span className="stat-value">{formatNumber(motoKm + autoKm, 1)} km</span>
              </div>
              <div className="preview-stat-item">
                <span className="stat-label">Subtotal Moto</span>
                <span className="stat-value text-amber">{formatCurrency(motoTotal)}</span>
              </div>
              <div className="preview-stat-item">
                <span className="stat-label">Subtotal Auto</span>
                <span className="stat-value text-blue">{formatCurrency(autoTotal)}</span>
              </div>
            </div>
          </div>

          {/* Opciones de Exportación */}
          <div className="export-actions-grid">
            <button
              onClick={handleExportExcel}
              className="export-action-card excel-btn"
            >
              <div className="export-action-icon excel-icon">
                <FileSpreadsheet size={28} />
              </div>
              <div className="export-action-text">
                <strong>Exportar a Excel (.xls / .xlsx)</strong>
                <p>Descarga la planilla con formato contable oficial, fórmulas y tablas de resumen.</p>
              </div>
            </button>

            <button
              onClick={handleOpenPrint}
              className="export-action-card pdf-btn"
            >
              <div className="export-action-icon pdf-icon">
                <Printer size={28} />
              </div>
              <div className="export-action-text">
                <strong>Planilla Formal / PDF</strong>
                <p>Abre la vista imprimible idéntica a la planilla física para imprimir o guardar como PDF.</p>
              </div>
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn-cancel">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
