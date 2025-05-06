/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Controller } from 'react-hook-form'

export const Input = ({ type, placeholder, name, control }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) =>
        <input className={"form-control rounded-0 w-100"} type={type} placeholder={placeholder} aria-describedby="basic-addon1" id={name} {...field} value={field.value || ""} />
      }
    />
  )
}
