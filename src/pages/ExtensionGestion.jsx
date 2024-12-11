/* eslint-disable no-unused-vars */
import React from 'react'
import { FormExtensionAcademic } from '../components/forms/FormExtensionAcademic'
import { Card } from '../components/login/Card'

export const ExtensionGestion = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" >
      <Card className={"card align-items-center h-auto gap-3 p-3"}>
        <FormExtensionAcademic />
      </Card>
    </div>
  )
}
