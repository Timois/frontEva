/* eslint-disable no-unused-vars */
import React from 'react'
import { Card } from '../login/Card'
import { FormUnit } from '../editForms/FormUnit'
export const EditarUnidad = () => {
  return (
    <>
      <button
        type="button"
        className="btn btn-primary justify-content-end"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Editar
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{zIndex:"1100"}}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <Card className={"card align-items-center h-auto gap-3 p-3"}>
                <FormUnit />
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
