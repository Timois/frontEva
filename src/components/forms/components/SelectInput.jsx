/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Controller } from "react-hook-form";

export const SelectInput = ({ name, options, error, control, label }) => {
    return (
        <div className="mb-3">
            {label && <label className="form-label">{label}</label>}
            <Controller
                label={label}
                name={name}
                control={control}
                render={({ field }) =>
                    <select
                        id={name}
                        className={`form-select w-100 ${error ? 'is-invalid' : ''}`}
                        {...field}
                        value={field.value ?? ""}
                    >
                        <option value="">
                            {label}
                        </option>
                        {options?.map((option, index) => (
                            <option key={index} value={option.value}>{option.text}
                            </option>
                        ))}
                    </select>
                }
            />
        </div>
    );
};

