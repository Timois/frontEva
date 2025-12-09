import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "./CalendarModalStyles.css"
import { useEffect, useState } from "react";

// Import Spanish locale for moment
import 'moment/dist/locale/es';

// Configure moment to use Spanish and create localizer
moment.locale('es');
const localizer = momentLocalizer(moment);

export const BigCalendar = ({ doubleClick, events, onSelectSlot }) => {
  const [eventMapped, setEventMapped] = useState([])

  const messages = {
    today: "Hoy",
    previous: "Anterior",
    next: "Siguiente",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "No hay eventos en este rango.",
  };

  const parsedTitleName = (event) => {
    return `${event.nombre_laboratorio} - ${event.nombre_grupo}`
  };

  useEffect(() => {
    const mapped = events.map((event) => {
      return {
        ...event,
        title: parsedTitleName(event),
        start: new Date(event.start),
        end: new Date(event.end),
      };
    })
    setEventMapped(mapped)
  }, [events])
  return (
    <div style={{ height: "600px" }}>
      <Calendar
        localizer={localizer}
        culture="es"
        messages={messages}
        events={eventMapped}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={onSelectSlot}
        onDoubleClickEvent={doubleClick}
        step={30}
        timeslots={1}
        defaultView="week"
      />
    </div>
  );
};
