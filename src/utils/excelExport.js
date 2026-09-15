import { MONTH_NAMES } from './constants';
import { formatNumber, formatCurrency } from './storage';

/**
 * Genera y descarga un archivo Excel (.xls) compatible con Microsoft Excel, Google Sheets y LibreOffice
 * con el formato oficial de la liquidación de viáticos del mes.
 */
export const exportMonthToExcel = ({
  trips = [],
  settings,
  activeUser,
  selectedMonth
}) => {
  const [yearStr, monthStr] = selectedMonth.split('-');
  const monthIdx = parseInt(monthStr, 10) - 1;
  const monthName = MONTH_NAMES[monthIdx] || 'Mes';

  const motoTrips = trips.filter(t => t.tipoVehiculo === 'moto');
  const autoTrips = trips.filter(t => t.tipoVehiculo === 'auto');

  const motoKm = motoTrips.reduce((acc, t) => acc + (t.km || 0), 0);
  const autoKm = autoTrips.reduce((acc, t) => acc + (t.km || 0), 0);

  const motoKmPorLitro = settings.moto.kmPorLitro || 20;
  const autoKmPorLitro = settings.auto.kmPorLitro || 10;

  const motoLitros = motoKm / motoKmPorLitro;
  const autoLitros = autoKm / autoKmPorLitro;

  const motoPrecio = settings.moto.precioPorLitro || 2450;
  const autoPrecio = settings.auto.precioPorLitro || 2450;

  const motoTotal = motoLitros * motoPrecio;
  const autoTotal = autoLitros * autoPrecio;

  const grandTotalKm = motoKm + autoKm;
  const grandTotalLitros = motoLitros + autoLitros;
  const grandTotalAmount = motoTotal + autoTotal;

  // Filas de viajes
  const tripRowsHtml = trips.length === 0
    ? `<tr><td colspan="7" style="text-align:center; padding: 12px; color: #666;">Sin viajes registrados en este período.</td></tr>`
    : trips.map(trip => {
        const [y, m, d] = trip.fecha.split('-');
        const dateFormatted = `${d}/${m}/${y}`;
        const kmVal = trip.km || 0;
        const kmPorLitro = trip.tipoVehiculo === 'moto' ? motoKmPorLitro : autoKmPorLitro;
        const precioL = trip.tipoVehiculo === 'moto' ? motoPrecio : autoPrecio;
        const litros = kmVal / kmPorLitro;
        const subtotal = litros * precioL;
        const tipoLabel = trip.tipoVehiculo === 'moto' ? 'MOTO' : 'AUTO';

        return `
          <tr>
            <td style="text-align: center; border: 1px solid #ccc; padding: 6px;">${dateFormatted}</td>
            <td style="border: 1px solid #ccc; padding: 6px;">${trip.detalle || ''}</td>
            <td style="text-align: center; border: 1px solid #ccc; padding: 6px; font-weight: bold;">${tipoLabel}</td>
            <td style="text-align: right; border: 1px solid #ccc; padding: 6px;">${formatNumber(kmVal, 1)}</td>
            <td style="text-align: right; border: 1px solid #ccc; padding: 6px;">${formatNumber(litros, 2)}</td>
            <td style="text-align: right; border: 1px solid #ccc; padding: 6px;">$ ${formatNumber(precioL, 2)}</td>
            <td style="text-align: right; border: 1px solid #ccc; padding: 6px; font-weight: bold;">$ ${formatNumber(subtotal, 2)}</td>
          </tr>
        `;
      }).join('');

  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${monthName} ${yearStr}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: Calibri, Arial, sans-serif; }
        .header-title { font-size: 16pt; font-weight: bold; color: #1e3a8a; text-align: center; }
        .header-sub { font-size: 11pt; color: #475569; text-align: center; }
        .th-main { background-color: #1e293b; color: #ffffff; font-weight: bold; border: 1px solid #0f172a; padding: 8px; text-align: center; }
        .total-row { background-color: #f1f5f9; font-weight: bold; border: 1px solid #94a3b8; }
        .card-table { border-collapse: collapse; margin-top: 15px; }
        .card-th { background-color: #334155; color: white; font-weight: bold; padding: 6px 12px; }
        .card-td { border: 1px solid #cbd5e1; padding: 6px 12px; }
        .highlight-total { background-color: #10b981; color: white; font-size: 13pt; font-weight: bold; padding: 10px; text-align: right; }
      </style>
    </head>
    <body>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td colspan="7" class="header-title" style="padding: 10px 0;">PLANILLA DE CONTROL Y LIQUIDACIÓN DE VIÁTICOS</td>
        </tr>
        <tr>
          <td colspan="7" class="header-sub" style="padding-bottom: 15px;">
            <strong>Período:</strong> ${monthName} ${yearStr} &nbsp;&nbsp;|&nbsp;&nbsp;
            <strong>Solicitante:</strong> ${activeUser?.name || 'Empleado'}
          </td>
        </tr>
      </table>

      <br/>

      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
        <thead>
          <tr>
            <th class="th-main" style="width: 100px;">Fecha</th>
            <th class="th-main" style="width: 320px;">Detalle / Motivo del Traslado</th>
            <th class="th-main" style="width: 90px;">Vehículo</th>
            <th class="th-main" style="width: 90px;">KM</th>
            <th class="th-main" style="width: 100px;">Consumo (Lts)</th>
            <th class="th-main" style="width: 110px;">Precio x Litro</th>
            <th class="th-main" style="width: 120px;">Subtotal ($)</th>
          </tr>
        </thead>
        <tbody>
          ${tripRowsHtml}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="3" style="text-align: right; padding: 8px; border: 1px solid #ccc; font-weight: bold;">TOTALES GENERALES:</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ccc; font-weight: bold;">${formatNumber(grandTotalKm, 1)} km</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ccc; font-weight: bold;">${formatNumber(grandTotalLitros, 2)} L</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ccc;">-</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ccc; font-weight: bold; color: #047857;">$ ${formatNumber(grandTotalAmount, 2)}</td>
          </tr>
        </tfoot>
      </table>

      <br/><br/>

      <!-- Resumen por tipo de vehículo -->
      <table style="border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="vertical-align: top; padding-right: 30px;">
            <table class="card-table" style="border: 1px solid #d97706;">
              <thead>
                <tr><th colspan="2" style="background-color: #d97706; color: white; padding: 6px 12px; font-weight: bold;">RESUMEN MOTO (${motoKmPorLitro} KM/L)</th></tr>
              </thead>
              <tbody>
                <tr><td class="card-td">KM Recorridos:</td><td class="card-td" style="text-align: right; font-weight: bold;">${formatNumber(motoKm, 1)} km</td></tr>
                <tr><td class="card-td">Litros Gastados:</td><td class="card-td" style="text-align: right;">${formatNumber(motoLitros, 2)} L</td></tr>
                <tr><td class="card-td">Precio x Litro:</td><td class="card-td" style="text-align: right;">$ ${formatNumber(motoPrecio, 2)}</td></tr>
                <tr style="background-color: #fef3c7;"><td class="card-td" style="font-weight: bold;">Subtotal Moto:</td><td class="card-td" style="text-align: right; font-weight: bold; color: #b45309;">$ ${formatNumber(motoTotal, 2)}</td></tr>
              </tbody>
            </table>
          </td>

          <td style="vertical-align: top; padding-right: 30px;">
            <table class="card-table" style="border: 1px solid #2563eb;">
              <thead>
                <tr><th colspan="2" style="background-color: #2563eb; color: white; padding: 6px 12px; font-weight: bold;">RESUMEN AUTO (${autoKmPorLitro} KM/L)</th></tr>
              </thead>
              <tbody>
                <tr><td class="card-td">KM Recorridos:</td><td class="card-td" style="text-align: right; font-weight: bold;">${formatNumber(autoKm, 1)} km</td></tr>
                <tr><td class="card-td">Litros Gastados:</td><td class="card-td" style="text-align: right;">${formatNumber(autoLitros, 2)} L</td></tr>
                <tr><td class="card-td">Precio x Litro:</td><td class="card-td" style="text-align: right;">$ ${formatNumber(autoPrecio, 2)}</td></tr>
                <tr style="background-color: #dbeafe;"><td class="card-td" style="font-weight: bold;">Subtotal Auto:</td><td class="card-td" style="text-align: right; font-weight: bold; color: #1d4ed8;">$ ${formatNumber(autoTotal, 2)}</td></tr>
              </tbody>
            </table>
          </td>

          <td style="vertical-align: top;">
            <table class="card-table" style="border: 2px solid #059669; min-width: 220px;">
              <thead>
                <tr><th colspan="2" style="background-color: #059669; color: white; padding: 8px 12px; font-weight: bold; font-size: 11pt;">TOTAL A LIQUIDAR</th></tr>
              </thead>
              <tbody>
                <tr><td class="card-td">Total Viajes:</td><td class="card-td" style="text-align: right; font-weight: bold;">${trips.length}</td></tr>
                <tr><td class="card-td">Total Kilómetros:</td><td class="card-td" style="text-align: right; font-weight: bold;">${formatNumber(grandTotalKm, 1)} km</td></tr>
                <tr><td class="card-td">Total Combustible:</td><td class="card-td" style="text-align: right; font-weight: bold;">${formatNumber(grandTotalLitros, 2)} Lts</td></tr>
                <tr style="background-color: #ecfdf5;"><td class="card-td" style="font-weight: bold; font-size: 12pt; color: #047857;">IMPORTE TOTAL:</td><td class="card-td" style="text-align: right; font-weight: bold; font-size: 12pt; color: #047857;">$ ${formatNumber(grandTotalAmount, 2)}</td></tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>

      <br/><br/>
      <table style="width: 100%; margin-top: 40px;">
        <tr>
          <td style="width: 45%; text-align: center; border-top: 1px solid #475569; padding-top: 8px;">
            Firma Solicitante: <strong>${activeUser?.name || 'Empleado'}</strong>
          </td>
          <td style="width: 10%;"></td>
          <td style="width: 45%; text-align: center; border-top: 1px solid #475569; padding-top: 8px;">
            Firma Autorizada / Administración
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  const safeUserName = (activeUser?.name || 'usuario').toLowerCase().replace(/\s+/g, '_');
  downloadLink.href = url;
  downloadLink.download = `viaticos_${safeUserName}_${selectedMonth}.xls`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};
