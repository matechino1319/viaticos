# Contexto del Proyecto: Sistema de Viáticos y Kilometraje

## 1. Propósito y Alcance
Aplicación web orientada al registro, cálculo y liquidación de viáticos por traslados en **Auto** o **Moto** para un equipo de **4 personas**, con soporte para múltiples períodos mensuales y configuraciones tarifarias independientes por tipo de vehículo.

---

## 2. Reglas de Negocio y Fórmulas de Cálculo

### Fórmulas
- **Consumo de combustible (Litros)**:
  $$\text{Litros} = \frac{\text{Kilómetros Recorridos}}{\text{Rendimiento del Vehículo (KM/L)}}$$

- **Subtotal por vehículo (\$ ARS)**:
  $$\text{Subtotal} = \text{Litros} \times \text{Precio Nafta (\$/L)}$$

- **Gran Total a Liquidar**:
  $$\text{Total} = \text{Subtotal Moto} + \text{Subtotal Auto}$$

---

## 3. Modelo de Datos y Entidades

### Vehículos y Tarifas
```typescript
interface ConfiguracionVehiculo {
  nombre: string;         // Ej: "Motomel Tuning 110 blitz" | "Auto General"
  kmPorLitro: number;     // Ej: 20 para moto, 10 para auto
  precioPorLitro: number; // Ej: $2.450,00
}

interface ConfiguracionGlobal {
  auto: ConfiguracionVehiculo;
  moto: ConfiguracionVehiculo;
}
```

### Usuarios (4 Integrantes)
```typescript
interface Usuario {
  id: string;          // 'user-1', 'user-2', 'user-3', 'user-4'
  name: string;        // Nombre completo editable
  initials: string;    // Iniciales para el avatar
  avatarColor: string; // Color identificador
}
```

### Viajes / Traslados
```typescript
interface Viaje {
  id: string;
  usuarioId: string;
  fecha: string;        // Formato ISO: YYYY-MM-DD
  detalle: string;      // Justificante / motivo del traslado
  km: number;           // Kilometraje recorrido (> 0)
  tipoVehiculo: 'moto' | 'auto';
}
```

---

## 4. Estructura y Componentes del Frontend

- **Tecnología**: React + Vite, Vanilla CSS modular, `lucide-react`, `canvas-confetti`.
- **Persistencia**: `localStorage` reactivo con importación y exportación de backups en JSON.
- **Componentes**:
  - `Header.jsx`: Selector de las 4 personas, accesos a configuración, impresión formal y respaldo JSON.
  - `MonthSelector.jsx`: Navegador entre meses (Agosto 2026, Septiembre 2026, etc.).
  - `SummaryCards.jsx`: Tarjetas con subtotales independientes para Moto, Auto y Gran Total a liquidar.
  - `TripForm.jsx`: Carga ágil con selector `[ Moto ]` / `[ Auto ]`, fecha, km (atajos +1, +5, +10) y justificante con sugerencias de destinos frecuentes.
  - `TripTable.jsx`: Listado con filtro por vehículo, buscador de texto, edición y cálculo unitario de litros e importe.
  - `SettingsModal.jsx`: Modal para modificar precio $/L y rendimiento km/l tanto para Auto como para Moto, más edición de nombres de los 4 usuarios.
  - `PrintReportModal.jsx`: Vista previa y reporte formal idéntico a la planilla de cálculo física para imprimir o guardar como PDF.

---

## 5. Ejecución Local
- **Comando**: `npm run dev`
- **URL por defecto**: `http://localhost:5173/`
