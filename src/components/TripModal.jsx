import React, { useState, useEffect } from 'react';
import { X, Bike, Car, Navigation, Calendar, AlignLeft, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TripModal = ({
  isOpen,
  onClose,
  onAddTrip,
  selectedMonth,
  initialDate,
  editingTrip,
  commonDestinations = []
}) => {
  if (!isOpen) return null;

  const [tipoVehiculo, setTipoVehiculo] = useState('moto');
  const [fecha, setFecha] = useState('');
  const [km, setKm] = useState('');
  const [detalle, setDetalle] = useState('');

  useEffect(() => {
    if (editingTrip) {
      setTipoVehiculo(editingTrip.tipoVehiculo);
      setFecha(editingTrip.fecha);
      setKm(editingTrip.km.toString());
      setDetalle(editingTrip.detalle || '');
    } else {
      setTipoVehiculo('moto');
      setFecha(initialDate || `${selectedMonth}-01`);
      setKm('');
      setDetalle('');
    }
  }, [editingTrip, initialDate, selectedMonth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fecha || !km || parseFloat(km) <= 0) {
      alert('Por favor indicá la fecha y un kilometraje válido mayor a 0.');
      return;
    }

    onAddTrip({
      fecha,
      km: parseFloat(km),
      tipoVehiculo,
      detalle: detalle.trim() || (tipoVehiculo === 'moto' ? 'Traslado en Moto' : 'Traslado en Auto')
    });

    confetti({
      particleCount: 20,
      spread: 35,
      origin: { y: 0.7 },
      colors: tipoVehiculo === 'moto' ? ['#f59e0b', '#fbbf24'] : ['#3b82f6', '#60a5fa']
    });

    onClose();
  };

  const handleQuickKm = (add) => {
    const current = parseFloat(km) || 0;
    setKm((current + add).toString());
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-container trip-modal-box">
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <div className={`vehicle-badge-icon ${tipoVehiculo}`}>
              {tipoVehiculo === 'moto' ? <Bike size={20} /> : <Car size={20} />}
            </div>
            <div>
              <h2 className="modal-title">
                {editingTrip ? 'Editar Registro' : 'Nuevo Registro de Viaje'}
              </h2>
              <p className="modal-subtitle">Seleccioná vehículo e ingresá los kilómetros</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Cerrar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* 1. Selector Auto o Moto */}
          <div className="form-group full-width">
            <label className="input-label">1. Seleccioná Vehículo:</label>
            <div className="vehicle-toggle-group big-toggle">
              <button
                type="button"
                onClick={() => setTipoVehiculo('moto')}
                className={`vehicle-toggle-btn btn-moto ${tipoVehiculo === 'moto' ? 'active' : ''}`}
              >
                <Bike size={24} />
                <div className="btn-text-block">
                  <strong>MOTO</strong>
                  <span>Tarifa Moto</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTipoVehiculo('auto')}
                className={`vehicle-toggle-btn btn-auto ${tipoVehiculo === 'auto' ? 'active' : ''}`}
              >
                <Car size={24} />
                <div className="btn-text-block">
                  <strong>AUTO</strong>
                  <span>Tarifa Auto</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Día / Fecha */}
          <div className="form-group full-width">
            <label className="input-label">
              <Calendar size={15} />
              <span>2. Día / Fecha:</span>
            </label>
            <input
              type="date"
              className="custom-input"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          {/* 3. Kilómetros */}
          <div className="form-group full-width">
            <label className="input-label">
              <Navigation size={15} />
              <span>3. Kilómetros Recorridos (KM):</span>
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
                autoFocus
                required
              />
              <div className="quick-km-badges">
                <button type="button" onClick={() => handleQuickKm(1)}>+1 km</button>
                <button type="button" onClick={() => handleQuickKm(5)}>+5 km</button>
                <button type="button" onClick={() => handleQuickKm(10)}>+10 km</button>
              </div>
            </div>
          </div>

          {/* 4. Detalle / Motivo */}
          <div className="form-group full-width">
            <label className="input-label">
              <AlignLeft size={15} />
              <span>4. Detalle / Motivo del traslado (opcional):</span>
            </label>
            <input
              type="text"
              placeholder="Ej. Se llevó toner a Libertador"
              className="custom-input"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
            />
            {commonDestinations.length > 0 && !editingTrip && (
              <div className="quick-suggestions">
                <span className="sugg-label">Sugerencias:</span>
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

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              <Check size={16} />
              <span>{editingTrip ? 'Actualizar Registro' : 'Guardar Viaje'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
