import React, { useState } from 'react';
import dayjs from 'dayjs';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
  const [events, setEvents] = useState({});
  const [popupData, setPopupData] = useState({ isVisible: false, events: [], position: {} });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysInMonth = currentMonth.daysInMonth();
  const firstDay = currentMonth.startOf('month').day();

  const getCalendarDates = () => {
    const dates = [];
    const prevMonth = currentMonth.subtract(1, 'month');
    const prevMonthDays = prevMonth.daysInMonth();
    for (let i = firstDay - 1; i >= 0; i--) {
      dates.push({ date: prevMonthDays - i, currentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({ date: i, currentMonth: true });
    }
    const nextDaysCount = 42 - dates.length;
    for (let i = 1; i <= nextDaysCount; i++) {
      dates.push({ date: i, currentMonth: false });
    }
    return dates;
  };

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));

  const handleMouseEnter = (dayObj, e) => {
    if (dayObj.currentMonth) {
      const dateKey = currentMonth.date(dayObj.date).format('YYYY-MM-DD');
      const dateEvents = events[dateKey] || [];
      if (dateEvents.length > 0) {
        const rect = e.target.getBoundingClientRect();
        setPopupData({
          isVisible: true,
          events: dateEvents,
          position: { top: rect.bottom - 10 + window.scrollY, left: rect.left + window.scrollX + 10 },
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setPopupData({ ...popupData, isVisible: false });
  };

  const addEvent = (dateKey, eventInput) => {
    const newEvents = { ...events, [dateKey]: [...(events[dateKey] || []), eventInput] };
    setEvents(newEvents);
  };

  const handleDateClick = (dayObj) => {
    if (dayObj.currentMonth) {
      const dateKey = currentMonth.date(dayObj.date).format('YYYY-MM-DD');
      const eventInput = prompt("Enter event:");
      if (eventInput) {
        addEvent(dateKey, eventInput);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 backdrop-blur-lg bg-white bg-opacity-20 rounded-2xl border border-gray-300 shadow-md">
      <div className="flex justify-between items-center mb-6 text-gray-800">
        <button onClick={handlePrevMonth} className="text-2xl font-semibold text-gray-700 hover:text-blue-500 transition duration-200">&lt;</button>
        <h2 className="text-3xl font-bold tracking-wide text-gray-900 transition duration-300 transform hover:scale-105">
          {currentMonth.format('MMMM YYYY')}
        </h2>
        <button onClick={handleNextMonth} className="text-2xl font-semibold text-gray-700 hover:text-blue-500 transition duration-200">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center mb-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="uppercase text-sm font-semibold text-blue-600">{day}</div>
        ))}
        {getCalendarDates().map((dayObj, index) => {
          const isToday = dayjs().isSame(currentMonth.date(dayObj.date), 'day') && dayObj.currentMonth;
          const dateKey = currentMonth.date(dayObj.date).format('YYYY-MM-DD');
          const dateEvents = events[dateKey] || [];

          return (
            <div
              key={index}
              className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300
                ${isToday ? 'bg-blue-600 text-white font-semibold shadow-lg transform scale-105' : ''}
                ${dayObj.currentMonth ? 'text-gray-800' : 'text-gray-400'}
                border ${dateEvents.length > 0 ? 'border-blue-500' : 'border-transparent'}
                hover:bg-blue-100`}
              onClick={() => handleDateClick(dayObj)}
              onMouseEnter={(e) => handleMouseEnter(dayObj, e)}
              onMouseLeave={handleMouseLeave}
            >
              {dayObj.date}
              {/* Event Popup */}
              {dateEvents.length > 0 && popupData.isVisible && (
                <div
                  className="absolute bg-white shadow-lg rounded-md p-2 text-gray-800"
                  style={{
                    top: '-10%',
                    left: '50%',
                    transform: 'translate(-50%, -100%)',
                    zIndex: 1000,
                  }}
                >
                  <h4 className="font-bold">Events:</h4>
                  <ul>
                    {dateEvents.map((event, i) => (
                      <li key={i} className="text-gray-800">{event}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
