/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react"
import { Card } from "../../components/login/Card"
import { FormPeriod} from "../../components/forms/FormPeriod"

const ModalRegister = ({ modalIdP }) => {
  return (
    <div
      className="modal fade"
      id={modalIdP}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ zIndex: "1100" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <Card className="card align-items-center h-auto gap-3 p-3">
            <FormPeriod/>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ModalRegister