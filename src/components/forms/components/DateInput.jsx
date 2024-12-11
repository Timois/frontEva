/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Controller } from 'react-hook-form'

export const DateInput = ({ label, name, error, control, errors={} }) => {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type="date"
            id="year"
            className={`form-control ${errors.year ? 'is-invalid' : ''}`}
            {...field}
            value={field.value || ""}
          />
        )}
      />
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  )
}
