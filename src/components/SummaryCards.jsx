import React from 'react';
import { Bike, Car, DollarSign, Fuel, Gauge, TrendingUp } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/storage';

export const SummaryCards = ({
  motoStats,
  autoStats,
  settings,
  activeUserName
}) => {
  const totalKm = motoStats.km + autoStats.km;
  const totalLitros = motoStats.litros + autoStats.litros;
  const totalAmount = motoStats.subtotal + autoStats.subtotal;

  return (
    <div className="summary-grid no-print">
      {/* Tarjeta Moto */}
      <div className="summary-card card-moto">
        <div className="card-header">
          <div className="card-badge badge-moto">
            <Bike size={18} />
            <span>MOTO</span>
          </div>
          <span className="card-vehicle-name">{settings.moto.nombre}</span>
        </div>

        <div className="card-metrics">
          <div className="metric-row">
            <span className="metric-label">KM Recorridos:</span>
            <span className="metric-value font-display">{formatNumber(motoStats.km, 1)} km</span>
          </div>

          <div className="metric-row">
            <span className="metric-label">Consumo ({settings.moto.kmPorLitro} km/l):</span>
            <span className="metric-value">{formatNumber(motoStats.litros, 2)} Lts</span>
          </div>

          <div className="metric-row">
            <span className="metric-label">Precio x Litro:</span>
            <span className="metric-value">{formatCurrency(settings.moto.precioPorLitro)}</span>
          </div>
        </div>

        <div className="card-footer">
          <span className="subtotal-label">Subtotal Moto:</span>
          <span className="subtotal-value value-moto font-display">
            {formatCurrency(motoStats.subtotal)}
          </span>
        </div>
      </div>

      {/* Tarjeta Auto */}
      <div className="summary-card card-auto">
        <div className="card-header">
          <div className="card-badge badge-auto">
            <Car size={18} />
            <span>AUTO</span>
          </div>
          <span className="card-vehicle-name">{settings.auto.nombre}</span>
        </div>

        <div className="card-metrics">
          <div className="metric-row">
            <span className="metric-label">KM Recorridos:</span>
            <span className="metric-value font-display">{formatNumber(autoStats.km, 1)} km</span>
          </div>

          <div className="metric-row">
            <span className="metric-label">Consumo ({settings.auto.kmPorLitro} km/l):</span>
            <span className="metric-value">{formatNumber(autoStats.litros, 2)} Lts</span>
          </div>

          <div className="metric-row">
            <span className="metric-label">Precio x Litro:</span>
            <span className="metric-value">{formatCurrency(settings.auto.precioPorLitro)}</span>
          </div>
        </div>

        <div className="card-footer">
          <span className="subtotal-label">Subtotal Auto:</span>
          <span className="subtotal-value value-auto font-display">
            {formatCurrency(autoStats.subtotal)}
          </span>
        </div>
      </div>

      {/* Tarjeta Gran Total */}
      <div className="summary-card card-total">
        <div className="card-header">
          <div className="card-badge badge-total">
            <TrendingUp size={18} />
            <span>TOTAL LIQUIDACIÓN</span>
          </div>
          <span className="card-user-tag">{activeUserName}</span>
        </div>

        <div className="card-metrics">
          <div className="metric-row">
            <span className="metric-label">Total Kilómetros:</span>
            <span className="metric-value font-display total-km">{formatNumber(totalKm, 1)} km</span>
          </div>

          <div className="metric-row">
            <span className="metric-label">Total Combustible:</span>
            <span className="metric-value">{formatNumber(totalLitros, 2)} Lts</span>
          </div>

          <div className="metric-row">
            <span className="metric-label">Cantidad de Viajes:</span>
            <span className="metric-value">{motoStats.count + autoStats.count} viajes</span>
          </div>
        </div>

        <div className="card-footer total-footer">
          <span className="subtotal-label">Total a Liquidar:</span>
          <span className="grand-total-value font-display">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};
