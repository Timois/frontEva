/* eslint-disable no-unused-vars */
import React from 'react'
import { Periodos } from './Periodos'
import ButtonAdd from './ButtonAdd'
import ModalRegister from './ModalRegister'

export const IndexPeriod = () => {
  const modalId = "registerperiod"
  return (
    <div className='m-3 p-3'>
      <ButtonAdd modalIdP={modalId}/>
      <div className='w-100 d-flex justify-content-center'>
        <Periodos/>
      </div>
      <ModalRegister modalIdP={modalId}/>
    </div>
  )
}