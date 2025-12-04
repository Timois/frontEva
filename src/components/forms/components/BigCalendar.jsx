import moment from "moment";
import "moment/locale/es";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "./CalendarModalStyles.css"
import { useEffect, useState } from "react";
export const BigCalendar = ({ doubleClick, events }) => {
  const [eventMapped, setEventMapped] = useState([])
  moment.locale("es");

  const localizer = momentLocalizer(moment);

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
  useEffect(() => {
    const mapped = events.map((event) => {
      return {
        ...event,
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
        onDoubleClickEvent={doubleClick}
        step={30}
        timeslots={1}
      />
    </div>
  );
};
