/* eslint-disable react/prop-types */

import { FaCalendarAlt } from "react-icons/fa"



export const ButtonCalendar = ({modalIdP}) => {
    return (
        <button
          type="button"
          className="btn btn-secondary justify-content-end" style={{backgroundColor: '#5dbf1a', color: 'white'}}
          data-bs-toggle="modal"
          data-bs-target={`#${modalIdP}`}
        >
          <FaCalendarAlt size={20} style={{ marginRight: 8 }} />
          Ver disponibilidad
        </button>
      )
}
