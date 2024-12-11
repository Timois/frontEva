/* eslint-disable no-unused-vars */
import React from 'react'
import { FormPeriodExtension } from '../components/forms/FormPeriodExtension'
import { Card } from '../components/login/Card'

export const ExtensionPeriodos = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" >
      <Card className={"card align-items-center h-auto gap-3 p-3"}>
        <FormPeriodExtension />
      </Card>
    </div>
  )
}
