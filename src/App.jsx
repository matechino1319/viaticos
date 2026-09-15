import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { UserSelectionScreen } from './components/UserSelectionScreen';
import { YearMonthGrid } from './components/YearMonthGrid';
import { MonthSelector } from './components/MonthSelector';
import { SummaryCards } from './components/SummaryCards';
import { TripForm } from './components/TripForm';
import { TripTable } from './components/TripTable';
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

  // Vista activa: 'user_select' | 'dashboard'
  const [view, setView] = useState(() => {
    // Si viene de una sesión previa, podemos arrancar en el dashboard o selector
    return 'dashboard';
  });

  // Modales
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [printMonth, setPrintMonth] = useState(selectedMonth);
  const [editingTrip, setEditingTrip] = useState(null);

  const formSectionRef = useRef(null);

  // Persistencia reactiva
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

  // Lista de meses con actividad del usuario activo
  const availableMonths = useMemo(() => {
    const monthSet = new Set(['2026-08', '2026-09']);
    trips
      .filter((t) => t.usuarioId === activeUserId)
      .forEach((t) => {
        if (t.fecha) {
          monthSet.add(t.fecha.slice(0, 7));
        }
      });
    return Array.from(monthSet).sort().reverse();
  }, [trips, activeUserId]);

  // Destinos frecuentes
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
  const handleSelectUserFromWelcome = (userId) => {
    setActiveUserId(userId);
    setView('dashboard');
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
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
      {/* Header General */}
      <Header
        users={users}
        activeUserId={activeUserId}
        onSelectUser={(id) => {
          setActiveUserId(id);
          setView('dashboard');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onExportBackup={handleExportBackup}
        onOpenUserSelection={() => setView('user_select')}
      />

      <main className="main-content">
        {view === 'user_select' ? (
          /* Pantalla Inicial de Selección de Quién Sos */
          <UserSelectionScreen
            users={users}
            trips={trips}
            settings={settings}
            onSelectUser={handleSelectUserFromWelcome}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        ) : (
          /* Dashboard Principal del Usuario Activo */
          <>
            {/* Grilla con los 12 Meses del Año para elegir el mes */}
            <YearMonthGrid
              selectedMonth={selectedMonth}
              onChangeMonth={setSelectedMonth}
              trips={trips}
              activeUserId={activeUserId}
              settings={settings}
              onSelectMonthAndScroll={() => {
                if (formSectionRef.current) {
                  formSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Barra de Navegación Rápida del Mes Activo */}
            <MonthSelector
              selectedMonth={selectedMonth}
              onChangeMonth={setSelectedMonth}
              availableMonths={availableMonths}
            />

            {/* Tarjetas de Resumen del Mes (Moto, Auto, Total a Liquidar) */}
            <SummaryCards
              motoStats={motoStats}
              autoStats={autoStats}
              settings={settings}
              activeUserName={activeUser?.name}
            />

            {/* Formulario de Carga del Día / Viaje (Auto / Moto, KM, Detalle) */}
            <div ref={formSectionRef}>
              <TripForm
                onAddTrip={handleAddTrip}
                selectedMonth={selectedMonth}
                editingTrip={editingTrip}
                onCancelEdit={() => setEditingTrip(null)}
                commonDestinations={commonDestinations}
              />
            </div>

            {/* Tabla Detallada de Viajes del Mes */}
            <TripTable
              trips={currentMonthTrips}
              settings={settings}
              onEditTrip={handleEditTrip}
              onDeleteTrip={handleDeleteTrip}
            />
          </>
        )}
      </main>

      {/* Modal de Configuración (Auto/Moto KM/L y $/L, Nombres de Integrantes) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        users={users}
        onSaveUsers={setUsers}
        onResetData={handleResetData}
      />

      {/* Modal de Exportación a Excel / PDF con selector de mes */}
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

      {/* Modal de Planilla Formal Imprimible / PDF */}
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
