import moment from "moment";
import "moment/locale/es";
import { Calendar, momentLocalizer } from "react-big-calendar";

export const BigCalendar = ({ doubleClick }) => {

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

  return (
    <div style={{ height: "600px" }}>
      <Calendar
        localizer={localizer}
        culture="es"
        messages={messages} 
        events={[
          {
            id: 0,
            title: "Mi evento",
            start: new Date(),
            end: new Date(),
          },
        ]}
        startAccessor="start"
        endAccessor="end"
        onDoubleClickEvent={doubleClick}
      />
    </div>
  );
};
