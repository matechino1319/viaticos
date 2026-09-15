# Contexto del proyecto: Sistema de Viáticos

## Última actualización
2026-09-15 11:50 ART

## Estado actual
Sistema web de registro, cálculo y liquidación de viáticos y kilometraje totalmente operativo y estructurado en flujo por pasos:
1. **Paso 1 (Identificación)**: Selección de integrante (**Mateo Martinez**, **Gonza**, **Fede**, **Diego**).
2. **Paso 2 (Meses del año)**: Grilla anual de los 12 meses con métricas acumuladas (viajes, km, subtotal $).
3. **Paso 3 (Detalle del mes)**: Vista de gestión mensual con botón para abrir popup modal de carga rápida de traslados en **Auto** o **Moto** con kilometraje y detalle.
4. **Configuración individual**: Cada usuario tiene su propio rendimiento en km/l y vehículo independiente.
5. **Exportación completa**: Descarga en **Excel (.xls)** con formato contable oficial y vista imprimible para **PDF**.
6. **Diseño**: Tema oscuro moderno con alta legibilidad y contrastes.

## Decisiones técnicas
- **Flujo desacoplado en 3 vistas**: Evita sobrecargar la pantalla inicial y guía al usuario en orden natural (Persona -> Mes -> Días/Viajes).
- **Parámetros vehiculares independientes por usuario**: Cada persona almacena su propio consumo km/l sin afectar los parámetros de sus compañeros.
- **Exportación nativa a Excel sin librerías pesadas**: Generación de HTML Spreadsheet XML MIME (`application/vnd.ms-excel`) con formato estilizado, celdas coloreadas y resúmenes.
- **Persistencia en `localStorage` con respaldo JSON**: Permite portabilidad y resguardo de datos inmediato sin dependencias de backend obligatorias.

## Problemas conocidos
- Los datos se almacenan de manera local en el navegador del dispositivo actual; para sincronización simultánea multi-dispositivo en tiempo real se requeriría una base de datos cloud (Firebase / Supabase).

## Próximos pasos
1. Opcional: Integración de backend / nube (Firebase/Supabase) para sincronización automática en tiempo real si cada persona carga desde su celular.
2. Opcional: Filtros avanzados por rangos de fechas personalizados adicionales a la vista mensual.

---

## Historial de sesiones

### Sesión 2026-09-15

**Completado:**
- Vinculación e inicialización del repositorio Git y push inicial a GitHub (`matechino1319/viaticos.git`).
- Asignación de los 4 integrantes definitivos: **Mateo Martinez**, **Gonza**, **Fede** y **Diego**.
- Rediseño del flujo general en 3 pasos secuenciales (`user_select` -> `months_grid` -> `month_detail`).
- Creación de popup modal `TripModal` para carga de viajes por día con toggle directo Auto/Moto y atajos de km.
- Creación de utilidad `excelExport.js` y modal `ExportModal` para exportar cualquier mes a Excel o PDF.
- Aislamiento de configuraciones de rendimiento km/l por persona.
- Ajuste y consolidación del tema visual oscuro premium.
- Resolución de bug de referencia en modal de configuración.

**Modificado:**
- `src/App.jsx` — Flujo por pasos, estados de modales y sincronización de configuraciones individuales.
- `src/App.css` — Estilos de la grilla de 12 meses, vista detalle de mes, modales de exportación y carga.
- `src/index.css` — Paleta y tokens de diseño en tema oscuro.
- `src/components/Header.jsx` — Barra superior con acciones de cambio de usuario, exportar y configuración.
- `src/components/YearMonthGrid.jsx` — Grilla interactiva de los 12 meses del año con métricas.
- `src/components/MonthDetailView.jsx` — Vista dedicada del mes con acceso a carga y tabla.
- `src/components/TripModal.jsx` — Popup ágil para seleccionar Auto/Moto, día y km.
- `src/components/ExportModal.jsx` — Selector de mes y exportación a Excel / PDF.
- `src/components/SettingsModal.jsx` — Configuración personalizada por integrante con sincronización automática.
- `src/utils/constants.js` — Datos iniciales de usuarios con esquemas de configuración personal.
- `src/utils/storage.js` — Carga y migración transparente de nombres y settings.
- `src/utils/excelExport.js` — Generador de planilla contable formal en Excel.

**Pendiente:**
- Ninguno en el alcance actual.
