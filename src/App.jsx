import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { UserSelectionScreen } from './components/UserSelectionScreen';
import { YearMonthGrid } from './components/YearMonthGrid';
import { MonthDetailView } from './components/MonthDetailView';
import { TripModal } from './components/TripModal';
import { SettingsModal } from './components/SettingsModal';
import { PrintReportModal } from './components/PrintReportModal';
import { ExportModal } from './components/ExportModal';
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

  // Navegación por pasos: 'user_select' | 'months_grid' | 'month_detail'
  const [step, setStep] = useState('user_select');

  // Modales
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [printMonth, setPrintMonth] = useState(selectedMonth);
  const [editingTrip, setEditingTrip] = useState(null);

  // Persistencia
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

  // Filtrar viajes del usuario en el mes seleccionado
  const currentMonthTrips = useMemo(() => {
    return trips.filter((t) => {
      const isUser = t.usuarioId === activeUserId;
      const isMonth = t.fecha && t.fecha.startsWith(selectedMonth);
      return isUser && isMonth;
    });
  }, [trips, activeUserId, selectedMonth]);

  // Viajes para el modal de impresión
  const printMonthTrips = useMemo(() => {
    return trips.filter((t) => {
      const isUser = t.usuarioId === activeUserId;
      const isMonth = t.fecha && t.fecha.startsWith(printMonth);
      return isUser && isMonth;
    });
  }, [trips, activeUserId, printMonth]);

  // Destinos frecuentes para el usuario
  const commonDestinations = useMemo(() => {
    const list = trips
      .filter((t) => t.usuarioId === activeUserId)
      .map((t) => t.detalle);
    return Array.from(new Set(list));
  }, [trips, activeUserId]);

  // Estadísticas MOTO para el mes seleccionado
  const motoStats = useMemo(() => {
    const motoTrips = currentMonthTrips.filter((t) => t.tipoVehiculo === 'moto');
    const km = motoTrips.reduce((acc, t) => acc + (t.km || 0), 0);
    const kmPorLitro = settings.moto.kmPorLitro || 20;
    const litros = km / kmPorLitro;
    const subtotal = litros * settings.moto.precioPorLitro;
    return { km, litros, subtotal, count: motoTrips.length };
  }, [currentMonthTrips, settings.moto]);

  // Estadísticas AUTO para el mes seleccionado
  const autoStats = useMemo(() => {
    const autoTrips = currentMonthTrips.filter((t) => t.tipoVehiculo === 'auto');
    const km = autoTrips.reduce((acc, t) => acc + (t.km || 0), 0);
    const kmPorLitro = settings.auto.kmPorLitro || 10;
    const litros = km / kmPorLitro;
    const subtotal = litros * settings.auto.precioPorLitro;
    return { km, litros, subtotal, count: autoTrips.length };
  }, [currentMonthTrips, settings.auto]);

  // Handlers
  const handleSelectUser = (userId) => {
    setActiveUserId(userId);
    setStep('months_grid');
  };

  const handleSelectMonth = (monthStr) => {
    setSelectedMonth(monthStr);
    setStep('month_detail');
  };

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
    setIsTripModalOpen(true);
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
    if (window.confirm('¿Restablecer los datos originales de ejemplo?')) {
      setUsers(DEFAULT_USERS);
      setSettings(DEFAULT_SETTINGS);
      setTrips(INITIAL_TRIPS);
      setActiveUserId(DEFAULT_USERS[0].id);
      setSelectedMonth('2026-08');
      setIsSettingsOpen(false);
      setStep('user_select');
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

  const handleOpenPrintFromExport = (monthStr) => {
    setPrintMonth(monthStr);
    setIsPrintOpen(true);
  };

  return (
    <div className="app-container">
      {/* Header global accesible */}
      <Header
        users={users}
        activeUserId={activeUserId}
        onSelectUser={(id) => {
          setActiveUserId(id);
          setStep('months_grid');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onExportBackup={handleExportBackup}
        onOpenUserSelection={() => setStep('user_select')}
      />

      <main className="main-content">
        {/* PASO 1: Elegir quién sos */}
        {step === 'user_select' && (
          <UserSelectionScreen
            users={users}
            trips={trips}
            settings={settings}
            onSelectUser={handleSelectUser}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* PASO 2: Elegir mes del año */}
        {step === 'months_grid' && (
          <YearMonthGrid
            selectedMonth={selectedMonth}
            onSelectMonth={handleSelectMonth}
            trips={trips}
            activeUser={activeUser}
            settings={settings}
            onChangeUser={() => setStep('user_select')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}

        {/* PASO 3: Detalle del mes, registrar viajes por día en Auto/Moto y liquidación */}
        {step === 'month_detail' && (
          <MonthDetailView
            selectedMonth={selectedMonth}
            activeUser={activeUser}
            trips={currentMonthTrips}
            settings={settings}
            motoStats={motoStats}
            autoStats={autoStats}
            onBackToMonths={() => setStep('months_grid')}
            onOpenTripModal={() => {
              setEditingTrip(null);
              setIsTripModalOpen(true);
            }}
            onEditTrip={handleEditTrip}
            onDeleteTrip={handleDeleteTrip}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* POPUP / MODAL: Registrar Viaje / Día (Auto o Moto y KM) */}
      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => {
          setIsTripModalOpen(false);
          setEditingTrip(null);
        }}
        onAddTrip={handleAddTrip}
        selectedMonth={selectedMonth}
        editingTrip={editingTrip}
        commonDestinations={commonDestinations}
      />

      {/* MODAL: Configuración de Rendimiento y Precios de Combustible */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        users={users}
        onSaveUsers={setUsers}
        onResetData={handleResetData}
      />

      {/* MODAL: Exportar a Excel y PDF */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        users={users}
        activeUserId={activeUserId}
        trips={trips}
        settings={settings}
        selectedMonth={selectedMonth}
        onOpenPrintModal={handleOpenPrintFromExport}
      />

      {/* MODAL: Planilla Formal Imprimible / PDF */}
      <PrintReportModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        trips={printMonthTrips}
        settings={settings}
        activeUser={activeUser}
        selectedMonth={printMonth}
      />
    </div>
  );
}

export default App;
