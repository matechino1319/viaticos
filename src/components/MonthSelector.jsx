import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { MONTH_NAMES } from '../utils/constants';

export const MonthSelector = ({
  selectedMonth,
  onChangeMonth,
  availableMonths = [],
  onAddNewMonth
}) => {
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;

  const currentMonthLabel = `${MONTH_NAMES[monthIdx]} ${year}`;

  const handlePrevMonth = () => {
    let newMonthIdx = monthIdx - 1;
    let newYear = year;
    if (newMonthIdx < 0) {
      newMonthIdx = 11;
      newYear -= 1;
    }
    const formattedMonth = String(newMonthIdx + 1).padStart(2, '0');
    onChangeMonth(`${newYear}-${formattedMonth}`);
  };

  const handleNextMonth = () => {
    let newMonthIdx = monthIdx + 1;
    let newYear = year;
    if (newMonthIdx > 11) {
      newMonthIdx = 0;
      newYear += 1;
    }
    const formattedMonth = String(newMonthIdx + 1).padStart(2, '0');
    onChangeMonth(`${newYear}-${formattedMonth}`);
  };

  return (
    <div className="month-selector-card no-print">
      <div className="month-navigation">
        <button 
          onClick={handlePrevMonth} 
          className="nav-arrow-btn"
          title="Mes anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="current-month-display">
          <Calendar size={20} className="calendar-icon" />
          <span className="month-title">{currentMonthLabel}</span>
        </div>

        <button 
          onClick={handleNextMonth} 
          className="nav-arrow-btn"
          title="Mes siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Meses rápidos con actividad */}
      <div className="quick-months">
        {availableMonths.map((m) => {
          const [y, mon] = m.split('-');
          const mLabel = `${MONTH_NAMES[parseInt(mon, 10) - 1]?.slice(0, 3)} ${y}`;
          const isSelected = m === selectedMonth;
          return (
            <button
              key={m}
              onClick={() => onChangeMonth(m)}
              className={`quick-month-chip ${isSelected ? 'active' : ''}`}
            >
              {mLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};
