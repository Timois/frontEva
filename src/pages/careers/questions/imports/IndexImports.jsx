/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react'

import { ImportQuestions } from './ImportQuestions'
import CheckPermissions from '../../../../routes/CheckPermissions'

export const IndexImports = () => {
  const modalId = "registerImport"
  return (

    <div className='m-3 p-3'>
      <div className="d-flex justify-content-center">

      </div>
      <CheckPermissions requiredPermission="ver-importaciones">
        <div className='w-100 d-flex justify-content-center'>
          <ImportQuestions />
        </div>
      </CheckPermissions>

    </div>
  )
}
