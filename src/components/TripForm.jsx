import React, { useState, useEffect } from 'react';
import { Bike, Car, Plus, Navigation, Calendar, AlignLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TripForm = ({
  onAddTrip,
  selectedMonth,
  editingTrip,
  onCancelEdit,
  commonDestinations = []
}) => {
  const [fecha, setFecha] = useState('');
  const [detalle, setDetalle] = useState('');
  const [km, setKm] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('moto'); // 'moto' | 'auto'

  // Si cambia el mes o si entra en modo edición, sincronizar fecha
  useEffect(() => {
    if (editingTrip) {
      setFecha(editingTrip.fecha);
      setDetalle(editingTrip.detalle);
      setKm(editingTrip.km.toString());
      setTipoVehiculo(editingTrip.tipoVehiculo);
    } else {
      // Fecha por defecto dentro del mes seleccionado
      const today = new Date().toISOString().slice(0, 10);
      if (today.startsWith(selectedMonth)) {
        setFecha(today);
      } else {
        // Primer día del mes seleccionado
        setFecha(`${selectedMonth}-01`);
      }
      setDetalle('');
      setKm('');
      setTipoVehiculo('moto');
    }
  }, [editingTrip, selectedMonth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fecha || !detalle.trim() || !km || parseFloat(km) <= 0) {
      alert('Por favor completá todos los campos correctamente con un kilometraje mayor a 0.');
      return;
    }

    onAddTrip({
      fecha,
      detalle: detalle.trim(),
      km: parseFloat(km),
      tipoVehiculo
    });

    // Pequeño efecto confetti al registrar
    if (!editingTrip) {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: tipoVehiculo === 'moto' ? ['#f59e0b', '#fbbf24'] : ['#3b82f6', '#60a5fa']
      });
      // Limpiar para el siguiente ingreso
      setDetalle('');
      setKm('');
    }
  };

  const handleQuickAddKm = (add) => {
    const current = parseFloat(km) || 0;
    setKm((current + add).toString());
  };

  return (
    <div className="trip-form-card no-print">
      <div className="form-title-bar">
        <h3 className="form-title">
          {editingTrip ? 'Editar Viaje / Traslado' : 'Registrar Nuevo Viaje'}
        </h3>
        {editingTrip && (
          <button onClick={onCancelEdit} className="btn-cancel-edit">
            Cancelar Edición
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-grid">
          {/* Selector de Tipo de Vehículo */}
          <div className="form-group full-width">
            <label className="input-label">Vehículo utilizado:</label>
            <div className="vehicle-toggle-group">
              <button
                type="button"
                onClick={() => setTipoVehiculo('moto')}
                className={`vehicle-toggle-btn btn-moto ${tipoVehiculo === 'moto' ? 'active' : ''}`}
              >
                <Bike size={20} />
                <span>Moto</span>
              </button>

              <button
                type="button"
                onClick={() => setTipoVehiculo('auto')}
                className={`vehicle-toggle-btn btn-auto ${tipoVehiculo === 'auto' ? 'active' : ''}`}
              >
                <Car size={20} />
                <span>Auto</span>
              </button>
            </div>
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label className="input-label">
              <Calendar size={15} />
              <span>Fecha del viaje:</span>
            </label>
            <input
              type="date"
              className="custom-input"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          {/* Kilómetros */}
          <div className="form-group">
            <label className="input-label">
              <Navigation size={15} />
              <span>Kilómetros (km):</span>
            </label>
            <div className="km-input-wrapper">
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Ej. 6.9"
                className="custom-input km-input"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                required
              />
              <div className="quick-km-badges">
                <button type="button" onClick={() => handleQuickAddKm(1)}>+1</button>
                <button type="button" onClick={() => handleQuickAddKm(5)}>+5</button>
                <button type="button" onClick={() => handleQuickAddKm(10)}>+10</button>
              </div>
            </div>
          </div>

          {/* Justificante / Detalle */}
          <div className="form-group full-width">
            <label className="input-label">
              <AlignLeft size={15} />
              <span>Justificante / Motivo del viaje:</span>
            </label>
            <input
              type="text"
              placeholder="Ej. Se llevó toner a Libertador / Trámite bancario"
              className="custom-input"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              required
            />
            {/* Sugerencias de justificantes comunes */}
            {commonDestinations.length > 0 && !editingTrip && (
              <div className="quick-suggestions">
                <span className="sugg-label">Frecuentes:</span>
                {commonDestinations.slice(0, 3).map((sugg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="sugg-chip"
                    onClick={() => setDetalle(sugg)}
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-trip-btn">
            <Plus size={18} />
            <span>{editingTrip ? 'Guardar Cambios' : 'Registrar Viaje'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
