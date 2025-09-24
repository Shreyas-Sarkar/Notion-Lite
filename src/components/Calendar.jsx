import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendarService';

const Calendar = ({ events, setEvents }) => {
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await calendarService.getEvents();
        setEvents(fetchedEvents);
        setError(null);
      } catch (err) {
        setError('Failed to fetch events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [setEvents]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const renderCalendarDays = () => {
    const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const hasEvents = events.some(event => new Date(event.event_time).toDateString() === date.toDateString());
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${hasEvents ? 'has-events' : ''} ${selectedDate?.toDateString() === date.toDateString() ? 'selected' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          {day}
          {hasEvents && <div className="event-dot"></div>}
        </div>
      );
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      try {
        const createdEvent = await calendarService.createEvent(newEvent);
        console.log('Event created:', createdEvent);
        const updatedEvents = await calendarService.getEvents();
        setEvents(updatedEvents);
        setNewEvent({ title: '', date: '', time: '' });
        setError(null);
      } catch (err) {
        setError('Failed to create event');
        console.error(err);
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const success = await calendarService.deleteEvent(id);
      if (success) {
        setEvents(events.filter(event => event.id !== id));
        setError(null);
      }
    } catch (err) {
      setError('Failed to delete event');
      console.error(err);
    }
  };

  return (
    <div className="calendar-container">
      <h2>Calendar</h2>
      {loading && <div>Loading events...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)}>&lt;</button>
        <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={() => navigateMonth(1)}>&gt;</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>

      <div className="event-section">
        <h3>Add Event</h3>
        <div className="event-input">
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder="Event title"
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <input
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />
          <button onClick={handleAddEvent}>Add Event</button>
        </div>

        <div className="events-list">
          <h3>Events {selectedDate ? `for ${selectedDate.toLocaleDateString()}` : ''}</h3>
          {events
            .filter(event => selectedDate ? new Date(event.event_time).toDateString() === selectedDate.toDateString() : true)
            .length === 0 ? (
              <div className="no-events">No events added yet</div>
            ) : (
              events
                .filter(event => selectedDate ? new Date(event.event_time).toDateString() === selectedDate.toDateString() : true)
                .map(event => (
                  <div key={event.id} className="event-item">
                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <p>
                        {new Date(event.event_time).toLocaleDateString()}
                        {' '}
                        {new Date(event.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                  </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
