/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

export const Card = ({className,children}) => {
  return (
    <div className={className} style={{ width: "auto", backgroundColor: '#bde0e9' }} >
        {children}
    </div>
  )
}
