import React, { useState } from 'react';
import { Bike, Car, Edit2, Trash2, Search, Filter, AlertCircle } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/storage';

export const TripTable = ({
  trips = [],
  settings,
  onEditTrip,
  onDeleteTrip
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'moto' | 'auto'

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trip.fecha.includes(searchTerm);
    const matchesType = filterType === 'all' || trip.tipoVehiculo === filterType;
    return matchesSearch && matchesType;
  });

  // Ordenar por fecha descendente o ascendente
  const sortedTrips = [...filteredTrips].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const totalKmFiltered = sortedTrips.reduce((acc, t) => acc + (t.km || 0), 0);

  return (
    <div className="trip-table-card no-print">
      <div className="table-header-bar">
        <div className="table-title-group">
          <h3 className="table-title">Detalle de Viajes del Mes</h3>
          <span className="table-counter-badge">{trips.length} registrados</span>
        </div>

        <div className="table-controls">
          {/* Barra de búsqueda */}
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por detalle o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filtro por tipo de vehículo */}
          <div className="filter-buttons">
            <button
              onClick={() => setFilterType('all')}
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('moto')}
              className={`filter-btn moto ${filterType === 'moto' ? 'active' : ''}`}
            >
              <Bike size={14} />
              <span>Motos</span>
            </button>
            <button
              onClick={() => setFilterType('auto')}
              className={`filter-btn auto ${filterType === 'auto' ? 'active' : ''}`}
            >
              <Car size={14} />
              <span>Autos</span>
            </button>
          </div>
        </div>
      </div>

      {sortedTrips.length === 0 ? (
        <div className="empty-table-state">
          <AlertCircle size={36} className="empty-icon" />
          <p className="empty-text">No se encontraron viajes para este período con los filtros seleccionados.</p>
          <span className="empty-subtext">Cargá un nuevo trayecto desde el formulario superior.</span>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th className="col-fecha">Fecha</th>
                <th className="col-vehiculo">Vehículo</th>
                <th className="col-detalle">Justificante / Detalle</th>
                <th className="col-km text-right">KM</th>
                <th className="col-litros text-right">Litros Est.</th>
                <th className="col-subtotal text-right">Subtotal</th>
                <th className="col-acciones text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrips.map((trip) => {
                const isMoto = trip.tipoVehiculo === 'moto';
                const vehiculoConfig = isMoto ? settings.moto : settings.auto;
                const kmPorLitro = vehiculoConfig.kmPorLitro || 1;
                const precioPorLitro = vehiculoConfig.precioPorLitro || 0;
                const litros = trip.km / kmPorLitro;
                const subtotal = litros * precioPorLitro;

                // Formato de fecha legible (DD/MM/AAAA)
                const [y, m, d] = trip.fecha.split('-');
                const formattedDate = `${d}/${m}/${y}`;

                return (
                  <tr key={trip.id} className={`trip-row row-${trip.tipoVehiculo}`}>
                    <td className="col-fecha font-medium">{formattedDate}</td>
                    <td className="col-vehiculo">
                      <span className={`vehicle-badge ${trip.tipoVehiculo}`}>
                        {isMoto ? <Bike size={14} /> : <Car size={14} />}
                        <span>{isMoto ? 'Moto' : 'Auto'}</span>
                      </span>
                    </td>
                    <td className="col-detalle">{trip.detalle}</td>
                    <td className="col-km text-right font-display font-semibold">
                      {formatNumber(trip.km, 1)}
                    </td>
                    <td className="col-litros text-right font-mono text-muted">
                      {formatNumber(litros, 2)} L
                    </td>
                    <td className="col-subtotal text-right font-display font-bold">
                      {formatCurrency(subtotal)}
                    </td>
                    <td className="col-acciones text-center">
                      <div className="action-icons-group">
                        <button
                          onClick={() => onEditTrip(trip)}
                          className="icon-action-btn edit-btn"
                          title="Editar viaje"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => onDeleteTrip(trip.id)}
                          className="icon-action-btn delete-btn"
                          title="Eliminar viaje"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="table-total-row">
                <td colSpan="3" className="font-display font-bold">
                  Total Filtrado ({sortedTrips.length} viajes)
                </td>
                <td className="text-right font-display font-bold text-accent">
                  {formatNumber(totalKmFiltered, 1)} km
                </td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
