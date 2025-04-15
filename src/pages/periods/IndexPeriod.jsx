/* eslint-disable no-unused-vars */
import React from 'react'
import { Periodos } from './Periodos'
import ButtonAdd from './ButtonAdd'
import ModalRegister from './ModalRegister'
import CheckPermissions from '../../routes/CheckPermissions'

export const IndexPeriod = () => {
  const modalId = "registerPeriod"
  return (
    <div className='m-3 p-3'>
      <CheckPermissions requiredPermission="crear-periodos">
        <div className="d-flex justify-content-center">
          <ButtonAdd modalIdP={modalId} />
        </div>
      </CheckPermissions>
      <div className='w-100 d-flex justify-content-center'>
        <Periodos />
      </div>
      <CheckPermissions requiredPermission="crear-periodos">
      <ModalRegister modalIdP={modalId} title="Registrar Periodo" />
      </CheckPermissions>F
    </div >
  )
}
