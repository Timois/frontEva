/* eslint-disable no-unused-vars */
import React from 'react'
import ButtonAdd from './ButtonAdd'
import { Examns } from './Examns'
import ModalRegister from './ModalRegister'
import CheckPermissions from '../../routes/CheckPermissions'
export const IndexExamns = () => {
  const modalId = 'registerExamn'
  return (
    <div className='m-3 p-3'>
      <CheckPermissions requiredPermission="crear-evaluaciones">
        <div className="d-flex justify-content-center">
          <ButtonAdd modalIdP={modalId} />
        </div>
      </CheckPermissions>
      <div className='w-100 d-flex justify-content-center'>
        <Examns />
      </div>
      <CheckPermissions requiredPermission="crear-evaluaciones">
        <ModalRegister modalId={modalId} title="Registrar evaluacion" />
      </CheckPermissions>
    </div >
  )
}
