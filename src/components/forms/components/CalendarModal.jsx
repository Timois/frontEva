/* eslint-disable react/prop-types */

import { Card } from "../../login/Card";
import { BigCalendar } from "./BigCalendar";
import "./CalendarModalStyles.css"
export const CalendarModal = ({ labs, modalId, title }) => {
  const doubleClick = (event) => {
    console.log(labs)
    alert(JSON.stringify(event, null, 4))
  }
  
    return (
        <div
          className="modal modal-lg fade"
          id={modalId}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
          style={{ zIndex: "1100" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-center text-success" id="exampleModalLabel">{title}</h5>
              </div>
              <Card className="card align-items-center h-auto gap-3 p-3">
                <BigCalendar labs={labs} doubleClick={doubleClick}/>
              </Card>
            </div>
          </div>
        </div>
      )
};
