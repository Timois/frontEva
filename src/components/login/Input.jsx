/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Controller } from 'react-hook-form';

export const Input = ({ type, placeholder, name, control }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue="" // 👈 ESTE ES CLAVE
      render={({ field }) => {
        const isNumber = type === 'number';
        return (
          <input
            className="form-control rounded-0 w-100"
            type={type}
            placeholder={placeholder}
            aria-describedby="basic-addon1"
            id={name}
            min={isNumber ? 0 : undefined}
            value={
              isNumber && (field.value === 0 || field.value === null)
                ? ''
                : field.value
            }
            onChange={(e) => {
              const rawValue = e.target.value;
              const value = isNumber
                ? rawValue === ''
                  ? 0
                  : Number(rawValue)
                : rawValue;
              field.onChange(value);
            }}
          />
        );
      }}
    />
  );
};
