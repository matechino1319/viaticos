import React from 'react';
import { X, Printer, Bike, Car, CheckCircle } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/storage';
import { MONTH_NAMES } from '../utils/constants';

export const PrintReportModal = ({
  isOpen,
  onClose,
  trips = [],
  settings,
  activeUser,
  selectedMonth
}) => {
  if (!isOpen) return null;

  const [yearStr, monthStr] = selectedMonth.split('-');
  const monthIdx = parseInt(monthStr, 10) - 1;
  const monthName = MONTH_NAMES[monthIdx];

  // Separar viajes por tipo de vehículo
  const motoTrips = trips.filter(t => t.tipoVehiculo === 'moto');
  const autoTrips = trips.filter(t => t.tipoVehiculo === 'auto');

  const motoKm = motoTrips.reduce((acc, t) => acc + (t.km || 0), 0);
  const autoKm = autoTrips.reduce((acc, t) => acc + (t.km || 0), 0);

  const motoLitros = motoKm / (settings.moto.kmPorLitro || 1);
  const autoLitros = autoKm / (settings.auto.kmPorLitro || 1);

  const motoTotal = motoLitros * settings.moto.precioPorLitro;
  const autoTotal = autoLitros * settings.auto.precioPorLitro;

  const grandTotalKm = motoKm + autoKm;
  const grandTotalAmount = motoTotal + autoTotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container print-modal-box">
        <div className="modal-header no-print">
          <h2 className="modal-title">Planilla de Liquidación Formal</h2>
          <div className="modal-header-actions">
            <button onClick={handlePrint} className="print-trigger-btn">
              <Printer size={16} />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button onClick={onClose} className="modal-close-btn">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenido Imprimible */}
        <div className="printable-sheet">
          {/* Membrete Superior */}
          <div className="sheet-header">
            <div className="sheet-title-col">
              <h1 className="sheet-main-title">PLANILLA DE CONTROL DE VIÁTICOS</h1>
              <p className="sheet-period">Período: <strong>{monthName} {yearStr}</strong></p>
            </div>
            <div className="sheet-user-box">
              <span className="user-field-label">Solicitante:</span>
              <span className="user-field-value">{activeUser?.name || 'Empleado'}</span>
            </div>
          </div>

          <div className="sheet-body-grid">
            {/* Tabla Principal de Viajes (Izquierda) */}
            <div className="sheet-table-section">
              <table className="sheet-table">
                <thead>
                  <tr className="sheet-th-row">
                    <th className="th-date">Fecha</th>
                    <th className="th-km">km</th>
                    <th className="th-veh">Tipo</th>
                    <th className="th-detail">Detalle / Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center empty-cell">
                        Sin viajes registrados en este período.
                      </td>
                    </tr>
                  ) : (
                    trips.map((trip) => {
                      const [y, m, d] = trip.fecha.split('-');
                      return (
                        <tr key={trip.id} className="sheet-tr">
                          <td className="sheet-td-date">{d}/{m}/{y}</td>
                          <td className="sheet-td-km">{formatNumber(trip.km, 1)}</td>
                          <td className="sheet-td-veh">{trip.tipoVehiculo.toUpperCase()}</td>
                          <td className="sheet-td-detail">{trip.detalle}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                <tfoot>
                  <tr className="sheet-total-row">
                    <td className="total-title">TOTAL</td>
                    <td className="total-km-val">{formatNumber(grandTotalKm, 1)}</td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Paneles de Liquidación (Derecha) */}
            <div className="sheet-calc-section">
              {/* Desglose Moto si hay km en moto o si se usa moto */}
              {motoKm > 0 && (
                <div className="liquidation-box">
                  <div className="box-caption">
                    <span>{settings.moto.kmPorLitro} km x litro (promedio)</span>
                    <strong>{settings.moto.nombre}</strong>
                  </div>
                  <table className="calc-table">
                    <tbody>
                      <tr>
                        <td className="calc-label">KM RECORRIDOS</td>
                        <td className="calc-val">{formatNumber(motoKm, 1)}</td>
                      </tr>
                      <tr>
                        <td className="calc-label">LITROS GASTADOS</td>
                        <td className="calc-val">{formatNumber(motoLitros, 2)}</td>
                      </tr>
                      <tr>
                        <td className="calc-label">PRECIO X LITRO</td>
                        <td className="calc-val">{formatCurrency(settings.moto.precioPorLitro)}</td>
                      </tr>
                      <tr className="calc-subtotal-tr">
                        <td className="calc-label font-bold">SUBTOTAL MOTO</td>
                        <td className="calc-val font-bold">{formatCurrency(motoTotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Desglose Auto si hay km en auto */}
              {autoKm > 0 && (
                <div className="liquidation-box">
                  <div className="box-caption">
                    <span>{settings.auto.kmPorLitro} km x litro (promedio)</span>
                    <strong>{settings.auto.nombre}</strong>
                  </div>
                  <table className="calc-table">
                    <tbody>
                      <tr>
                        <td className="calc-label">KM RECORRIDOS</td>
                        <td className="calc-val">{formatNumber(autoKm, 1)}</td>
                      </tr>
                      <tr>
                        <td className="calc-label">LITROS GASTADOS</td>
                        <td className="calc-val">{formatNumber(autoLitros, 2)}</td>
                      </tr>
                      <tr>
                        <td className="calc-label">PRECIO X LITRO</td>
                        <td className="calc-val">{formatCurrency(settings.auto.precioPorLitro)}</td>
                      </tr>
                      <tr className="calc-subtotal-tr">
                        <td className="calc-label font-bold">SUBTOTAL AUTO</td>
                        <td className="calc-val font-bold">{formatCurrency(autoTotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Total Final Liquidación */}
              <div className="grand-total-box">
                <div className="grand-total-header">
                  <span>TOTAL A LIQUIDAR</span>
                </div>
                <div className="grand-total-amount">
                  {formatCurrency(grandTotalAmount)}
                </div>
              </div>

              {/* Firmas de Conformidad */}
              <div className="signatures-section">
                <div className="sign-line">
                  <div className="line" />
                  <span>Firma Solicitante</span>
                </div>
                <div className="sign-line">
                  <div className="line" />
                  <span>Autorizado / Administración</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
