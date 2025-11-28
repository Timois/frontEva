/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react"
import { Card } from "../../components/login/Card"
import { FormGroup } from "../../components/forms/formGroup"

export const RegisterGroupView = () => {
  return (
    <div className="container mt-4">
      <h3 className="text-center text-success mb-3">Registrar Grupo</h3>

      <Card className="card gap-3 p-3 w-100 border-0">
        <FormGroup />
      </Card>
    </div>
  )
}
