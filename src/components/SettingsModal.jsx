import React, { useState } from 'react';
import { X, Bike, Car, Users, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { DEFAULT_SETTINGS, DEFAULT_USERS } from '../utils/constants';

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  users,
  onSaveUsers,
  onResetData
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('vehicles'); // 'vehicles' | 'users'

  // Estados locales para vehículos
  const [autoNombre, setAutoNombre] = useState(settings.auto.nombre);
  const [autoKmPorLitro, setAutoKmPorLitro] = useState(settings.auto.kmPorLitro.toString());
  const [autoPrecio, setAutoPrecio] = useState(settings.auto.precioPorLitro.toString());

  const [motoNombre, setMotoNombre] = useState(settings.moto.nombre);
  const [motoKmPorLitro, setMotoKmPorLitro] = useState(settings.moto.kmPorLitro.toString());
  const [motoPrecio, setMotoPrecio] = useState(settings.moto.precioPorLitro.toString());

  // Estados locales para usuarios
  const [userList, setUserList] = useState([...users]);

  const handleSaveAll = (e) => {
    e.preventDefault();

    const newSettings = {
      auto: {
        nombre: autoNombre.trim() || 'Auto',
        kmPorLitro: parseFloat(autoKmPorLitro) || 10,
        precioPorLitro: parseFloat(autoPrecio) || 2450
      },
      moto: {
        nombre: motoNombre.trim() || 'Moto',
        kmPorLitro: parseFloat(motoKmPorLitro) || 20,
        precioPorLitro: parseFloat(motoPrecio) || 2450
      }
    };

    onSaveSettings(newSettings);
    onSaveUsers(userList);
    onClose();
  };

  const handleUserNameChange = (id, newName) => {
    setUserList(prev => prev.map(u => {
      if (u.id === id) {
        const words = newName.trim().split(' ');
        const initials = words.length > 1 
          ? `${words[0][0]}${words[1][0]}`.toUpperCase()
          : newName.slice(0, 2).toUpperCase();
        return { ...u, name: newName, initials: initials || 'US' };
      }
      return u;
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container settings-modal-box">
        <div className="modal-header">
          <h2 className="modal-title">Configuración del Sistema</h2>
          <button onClick={onClose} className="modal-close-btn" title="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            <Car size={16} />
            <span>Vehículos y Tarifas de Nafta</span>
          </button>
          <button
            type="button"
            className={`modal-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            <span>Integrantes (4 personas)</span>
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="modal-form">
          {activeTab === 'vehicles' && (
            <div className="tab-content animate-fade-in">
              {/* Sección MOTO */}
              <div className="settings-section moto-section">
                <div className="section-title-wrap">
                  <div className="section-icon moto-icon">
                    <Bike size={20} />
                  </div>
                  <div>
                    <h4 className="section-title">Parámetros para MOTO</h4>
                    <p className="section-desc">Rendimiento y costo de combustible por litro</p>
                  </div>
                </div>

                <div className="settings-fields-grid">
                  <div className="form-group full-width">
                    <label className="input-label">Descripción / Modelo de Moto:</label>
                    <input
                      type="text"
                      value={motoNombre}
                      onChange={(e) => setMotoNombre(e.target.value)}
                      placeholder="Ej. Motomel Tuning 110 blitz"
                      className="custom-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Rendimiento (KM x Litro):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      value={motoKmPorLitro}
                      onChange={(e) => setMotoKmPorLitro(e.target.value)}
                      className="custom-input"
                      required
                    />
                    <span className="field-hint">Ejemplo: 20 km por litro</span>
                  </div>

                  <div className="form-group">
                    <label className="input-label">Precio Nafta ($ por Litro):</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={motoPrecio}
                      onChange={(e) => setMotoPrecio(e.target.value)}
                      className="custom-input"
                      required
                    />
                    <span className="field-hint">Ejemplo: $ 2.450,00</span>
                  </div>
                </div>
              </div>

              {/* Sección AUTO */}
              <div className="settings-section auto-section">
                <div className="section-title-wrap">
                  <div className="section-icon auto-icon">
                    <Car size={20} />
                  </div>
                  <div>
                    <h4 className="section-title">Parámetros para AUTO</h4>
                    <p className="section-desc">Rendimiento y costo de combustible por litro</p>
                  </div>
                </div>

                <div className="settings-fields-grid">
                  <div className="form-group full-width">
                    <label className="input-label">Descripción / Modelo de Auto:</label>
                    <input
                      type="text"
                      value={autoNombre}
                      onChange={(e) => setAutoNombre(e.target.value)}
                      placeholder="Ej. Auto Particular / Peugeot 208"
                      className="custom-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Rendimiento (KM x Litro):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      value={autoKmPorLitro}
                      onChange={(e) => setAutoKmPorLitro(e.target.value)}
                      className="custom-input"
                      required
                    />
                    <span className="field-hint">Ejemplo: 10 km por litro</span>
                  </div>

                  <div className="form-group">
                    <label className="input-label">Precio Nafta ($ por Litro):</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={autoPrecio}
                      onChange={(e) => setAutoPrecio(e.target.value)}
                      className="custom-input"
                      required
                    />
                    <span className="field-hint">Ejemplo: $ 2.450,00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="tab-content animate-fade-in">
              <div className="users-edit-list">
                <p className="tab-instruction">
                  Personalizá los nombres de las 4 personas que registran viáticos:
                </p>
                {userList.map((u, index) => (
                  <div key={u.id} className="user-edit-row">
                    <div className="user-index-tag">Persona #{index + 1}</div>
                    <input
                      type="text"
                      value={u.name}
                      onChange={(e) => handleUserNameChange(u.id, e.target.value)}
                      className="custom-input"
                      placeholder={`Nombre Persona ${index + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              onClick={onResetData}
              className="danger-btn-outline"
              title="Restablecer datos originales"
            >
              <RotateCcw size={15} />
              <span>Restablecer Ejemplo</span>
            </button>

            <div className="primary-actions-group">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                <Save size={16} />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
