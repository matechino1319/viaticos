import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MonthSelector } from './components/MonthSelector';
import { SummaryCards } from './components/SummaryCards';
import { TripForm } from './components/TripForm';
import { TripTable } from './components/TripTable';
import { SettingsModal } from './components/SettingsModal';
import { PrintReportModal } from './components/PrintReportModal';
import {
  loadData,
  saveUsers,
  saveSettings,
  saveTrips,
  saveActiveUserId,
  saveSelectedMonth,
  exportDataBackup
} from './utils/storage';
import { INITIAL_TRIPS, DEFAULT_SETTINGS, DEFAULT_USERS } from './utils/constants';
import './App.css';

export function App() {
  const [initialData] = useState(loadData);
  const [users, setUsers] = useState(initialData.users);
  const [settings, setSettings] = useState(initialData.settings);
  const [trips, setTrips] = useState(initialData.trips);
  const [activeUserId, setActiveUserId] = useState(initialData.activeUserId);
  const [selectedMonth, setSelectedMonth] = useState(initialData.selectedMonth);

  // Estados de UI Modales y Edición
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  // Persistir cambios
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveTrips(trips);
  }, [trips]);

  useEffect(() => {
    saveActiveUserId(activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    saveSelectedMonth(selectedMonth);
  }, [selectedMonth]);

  const activeUser = useMemo(() => {
    return users.find((u) => u.id === activeUserId) || users[0];
  }, [users, activeUserId]);

  // Filtrar viajes del usuario activo en el mes seleccionado
  const currentMonthTrips = useMemo(() => {
    return trips.filter((t) => {
      const isUser = t.usuarioId === activeUserId;
      const isMonth = t.fecha && t.fecha.startsWith(selectedMonth);
      return isUser && isMonth;
    });
  }, [trips, activeUserId, selectedMonth]);

  // Lista de meses con actividad
  const availableMonths = useMemo(() => {
    const monthSet = new Set(['2026-08', '2026-09']);
    trips.forEach((t) => {
      if (t.fecha) {
        monthSet.add(t.fecha.slice(0, 7));
      }
    });
    return Array.from(monthSet).sort().reverse();
  }, [trips]);

  // Destinos/justificantes frecuentes para autocompletado
  const commonDestinations = useMemo(() => {
    const list = trips
      .filter((t) => t.usuarioId === activeUserId)
      .map((t) => t.detalle);
    return Array.from(new Set(list));
  }, [trips, activeUserId]);

  // Estadísticas MOTO para el mes
  const motoStats = useMemo(() => {
    const motoTrips = currentMonthTrips.filter((t) => t.tipoVehiculo === 'moto');
    const km = motoTrips.reduce((acc, t) => acc + (t.km || 0), 0);
    const kmPorLitro = settings.moto.kmPorLitro || 20;
    const litros = km / kmPorLitro;
    const subtotal = litros * settings.moto.precioPorLitro;
    return { km, litros, subtotal, count: motoTrips.length };
  }, [currentMonthTrips, settings.moto]);

  // Estadísticas AUTO para el mes
  const autoStats = useMemo(() => {
    const autoTrips = currentMonthTrips.filter((t) => t.tipoVehiculo === 'auto');
    const km = autoTrips.reduce((acc, t) => acc + (t.km || 0), 0);
    const kmPorLitro = settings.auto.kmPorLitro || 10;
    const litros = km / kmPorLitro;
    const subtotal = litros * settings.auto.precioPorLitro;
    return { km, litros, subtotal, count: autoTrips.length };
  }, [currentMonthTrips, settings.auto]);

  // Handlers
  const handleAddTrip = (tripData) => {
    if (editingTrip) {
      setTrips((prev) =>
        prev.map((t) =>
          t.id === editingTrip.id ? { ...t, ...tripData } : t
        )
      );
      setEditingTrip(null);
    } else {
      const newTrip = {
        id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        usuarioId: activeUserId,
        ...tripData
      };
      setTrips((prev) => [newTrip, ...prev]);
    }
  };

  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleDeleteTrip = (tripId) => {
    if (window.confirm('¿Seguro que querés eliminar este registro de viaje?')) {
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      if (editingTrip?.id === tripId) {
        setEditingTrip(null);
      }
    }
  };

  const handleResetData = () => {
    if (window.confirm('¿Restablecer los datos de ejemplo originales? Se borrarán los cambios actuales.')) {
      setUsers(DEFAULT_USERS);
      setSettings(DEFAULT_SETTINGS);
      setTrips(INITIAL_TRIPS);
      setActiveUserId(DEFAULT_USERS[0].id);
      setSelectedMonth('2026-08');
      setIsSettingsOpen(false);
    }
  };

  const handleExportBackup = () => {
    exportDataBackup({
      users,
      settings,
      trips,
      activeUserId,
      selectedMonth,
      exportedAt: new Date().toISOString()
    });
  };

  return (
    <div className="app-container">
      {/* Barra superior con selector de los 4 usuarios y configuraciones */}
      <Header
        users={users}
        activeUserId={activeUserId}
        onSelectUser={setActiveUserId}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPrint={() => setIsPrintOpen(true)}
        onExportBackup={handleExportBackup}
      />

      <main className="main-content">
        {/* Navegador de meses */}
        <MonthSelector
          selectedMonth={selectedMonth}
          onChangeMonth={setSelectedMonth}
          availableMonths={availableMonths}
        />

        {/* Tarjetas resumen con desglose Moto, Auto y Total General */}
        <SummaryCards
          motoStats={motoStats}
          autoStats={autoStats}
          settings={settings}
          activeUserName={activeUser?.name}
        />

        {/* Formulario de carga y Edición */}
        <TripForm
          onAddTrip={handleAddTrip}
          selectedMonth={selectedMonth}
          editingTrip={editingTrip}
          onCancelEdit={() => setEditingTrip(null)}
          commonDestinations={commonDestinations}
        />

        {/* Tabla interactiva con filtro Auto/Moto y buscador */}
        <TripTable
          trips={currentMonthTrips}
          settings={settings}
          onEditTrip={handleEditTrip}
          onDeleteTrip={handleDeleteTrip}
        />
      </main>

      {/* Modal de Configuración (Auto/Moto $/L y km/l, Nombres de Usuarios) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        users={users}
        onSaveUsers={setUsers}
        onResetData={handleResetData}
      />

      {/* Modal de Planilla Formal Imprimible */}
      <PrintReportModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        trips={currentMonthTrips}
        settings={settings}
        activeUser={activeUser}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}

export default App;
