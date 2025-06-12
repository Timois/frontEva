/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Controller } from 'react-hook-form';

export const DateInput = ({ label, name, error, control, errors = {}, type = "date", disabled=false }) => {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type={type} // Cambiará entre "date" y "time" según lo que pases al usar el componente
            id={name} // Usa el nombre del campo como id único
            disabled={disabled}
            className={`form-control ${errors[name] ? 'is-invalid' : ''}`} // Valida errores dinámicamente
            {...field}
            value={field.value || ""}
          />
        )}
      />
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
};
