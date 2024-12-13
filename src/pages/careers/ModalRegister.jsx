/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Card } from '../../components/login/Card'
import { FormCareer } from '../../components/forms/FormCareer'

export const ModalRegister = ({ ModalId }) => {
  return (
    <div
      className="modal fade"
      id={ModalId}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ zIndex: "1100" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <Card className={"card align-items-center h-auto gap-3 p-3"}>
            <FormCareer/>
              </Card>
        </div>
      </div>
    </div>
  )
}
