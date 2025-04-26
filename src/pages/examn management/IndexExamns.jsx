/* eslint-disable no-unused-vars */
import React from 'react'
import ButtonAdd from './ButtonAdd'
import { Examns } from './Examns'
import ModalRegister from './ModalRegister'

export const IndexExamns = () => {
  const modalId = 'registerExamn'
  return (
    <div className='m-3 p-3'>
      <div className="d-flex justify-content-center">
        <ButtonAdd modalIdP={modalId} />
      </div>
      <div className='w-100 d-flex justify-content-center'>
        <Examns />
      </div>
      <ModalRegister modalId={modalId} title="Registrar examen"/>
    </div>
  )
}
