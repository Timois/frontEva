/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Controller } from "react-hook-form";

export const SelectInput = ({ name, options, error, control }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => 
                <select
                    id={name}
                    className={`form-select w-100 ${error ? 'is-invalid' : ''}`}
                    {...field}
                >
                    <option value="">
                        Seleccione una opción
                    </option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>{option.text}
                        </option>
                    ))}
                </select>
            }
        />
    );
};
