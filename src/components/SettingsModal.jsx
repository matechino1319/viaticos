import React, { useState, useEffect } from 'react';
import { X, Bike, Car, Users, Save, RotateCcw, Check, Fuel } from 'lucide-react';
import { DEFAULT_SETTINGS, DEFAULT_USERS } from '../utils/constants';

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  users,
  onSaveUsers,
  onResetData,
  activeUserId
}) => {
  if (!isOpen) return null;

  const [selectedUserConfigId, setSelectedUserConfigId] = useState(activeUserId || users[0].id);
  const [activeTab, setActiveTab] = useState('vehicles'); // 'vehicles' | 'users'

  // Estados locales para vehículos
  const [autoNombre, setAutoNombre] = useState('');
  const [autoKmPorLitro, setAutoKmPorLitro] = useState('');
  const [autoPrecio, setAutoPrecio] = useState('');

  const [motoNombre, setMotoNombre] = useState('');
  const [motoKmPorLitro, setMotoKmPorLitro] = useState('');
  const [motoPrecio, setMotoPrecio] = useState('');

  const [applyPriceToAll, setApplyPriceToAll] = useState(true);
  const [userList, setUserList] = useState(users || []);

  // Sincronizar automáticamente con la persona activa al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setSelectedUserConfigId(activeUserId || (users && users[0]?.id));
      setUserList(users || []);
    }
  }, [isOpen, activeUserId, users]);

  // Cargar configuración de los vehículos del usuario seleccionado en la pestaña
  useEffect(() => {
    const user = userList.find(u => u.id === selectedUserConfigId) || userList[0];
    const uSettings = user?.settings || settings;

    setAutoNombre(uSettings.auto?.nombre || 'Auto Particular');
    setAutoKmPorLitro((uSettings.auto?.kmPorLitro || 10).toString());
    setAutoPrecio((uSettings.auto?.precioPorLitro || 2450).toString());

    setMotoNombre(uSettings.moto?.nombre || 'Motomel Tuning 110 blitz');
    setMotoKmPorLitro((uSettings.moto?.kmPorLitro || 20).toString());
    setMotoPrecio((uSettings.moto?.precioPorLitro || 2450).toString());
  }, [selectedUserConfigId, userList, settings]);

  const handleSaveAll = (e) => {
    e.preventDefault();

    const priceAutoVal = parseFloat(autoPrecio) || 2450;
    const priceMotoVal = parseFloat(motoPrecio) || 2450;

    const userSpecificSettings = {
      auto: {
        nombre: autoNombre.trim() || 'Auto',
        kmPorLitro: parseFloat(autoKmPorLitro) || 10,
        precioPorLitro: priceAutoVal
      },
      moto: {
        nombre: motoNombre.trim() || 'Moto',
        kmPorLitro: parseFloat(motoKmPorLitro) || 20,
        precioPorLitro: priceMotoVal
      }
    };

    // Actualizar usuarios con sus configuraciones individuales
    const updatedUsers = userList.map(u => {
      if (u.id === selectedUserConfigId) {
        return {
          ...u,
          settings: userSpecificSettings
        };
      }
      if (applyPriceToAll && u.settings) {
        return {
          ...u,
          settings: {
            ...u.settings,
            auto: { ...u.settings.auto, precioPorLitro: priceAutoVal },
            moto: { ...u.settings.moto, precioPorLitro: priceMotoVal }
          }
        };
      }
      return u;
    });

    onSaveUsers(updatedUsers);

    // Si el usuario configurado es el activo, actualizar settings global también
    if (selectedUserConfigId === activeUserId) {
      onSaveSettings(userSpecificSettings);
    }

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

  const selectedUserObj = (userList && userList.find(u => u.id === selectedUserConfigId)) || (userList && userList[0]) || { name: 'Usuario' };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-container settings-modal-box">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Configuración de Vehículos y Tarifas</h2>
            <p className="modal-subtitle">Ajustá el rendimiento y precio de combustible por integrante</p>
          </div>
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
            <span>Vehículos y Rendimiento</span>
          </button>
          <button
            type="button"
            className={`modal-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            <span>Nombres de Integrantes</span>
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="modal-form">
          {activeTab === 'vehicles' && (
            <div className="tab-content animate-fade-in">
              {/* Selector de para qué persona configurar */}
              <div className="form-group full-width">
                <label className="input-label font-bold">
                  Configurar parámetros para:
                </label>
                <div className="user-chips-selector">
                  {userList.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelectedUserConfigId(u.id)}
                      className={`user-chip-btn ${selectedUserConfigId === u.id ? 'active' : ''}`}
                    >
                      <div className="chip-avatar" style={{ backgroundColor: u.avatarColor || '#2563eb' }}>
                        {u.initials || u.name.slice(0, 2)}
                      </div>
                      <span>{u.name}</span>
                    </button>
                  ))}
                </div>
                <span className="field-hint text-blue">
                  ℹ️ Modificar el rendimiento en km/l se aplica individualmente a <strong>{selectedUserObj.name}</strong> y no altera a los demás.
                </span>
              </div>

              {/* Sección MOTO */}
              <div className="settings-section moto-section">
                <div className="section-title-wrap">
                  <div className="section-icon moto-icon">
                    <Bike size={20} />
                  </div>
                  <div>
                    <h4 className="section-title">MOTO ({selectedUserObj.name})</h4>
                    <p className="section-desc">Rendimiento en km/l y precio por litro</p>
                  </div>
                </div>

                <div className="settings-fields-grid">
                  <div className="form-group full-width">
                    <label className="input-label">Modelo / Nombre de Moto:</label>
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
                    <label className="input-label">Precio Nafta ($ / Litro):</label>
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
                    <h4 className="section-title">AUTO ({selectedUserObj.name})</h4>
                    <p className="section-desc">Rendimiento en km/l y precio por litro</p>
                  </div>
                </div>

                <div className="settings-fields-grid">
                  <div className="form-group full-width">
                    <label className="input-label">Modelo / Nombre de Auto:</label>
                    <input
                      type="text"
                      value={autoNombre}
                      onChange={(e) => setAutoNombre(e.target.value)}
                      placeholder="Ej. Auto Particular"
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
                    <label className="input-label">Precio Nafta ($ / Litro):</label>
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

              {/* Checkbox compartir precio de nafta */}
              <div className="checkbox-option-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={applyPriceToAll}
                    onChange={(e) => setApplyPriceToAll(e.target.checked)}
                  />
                  <span>Actualizar el precio $/L de nafta para todos los integrantes</span>
                </label>
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
              <span>Restablecer Todo</span>
            </button>

            <div className="primary-actions-group">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                <Save size={16} />
                <span>Guardar Configuración</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
