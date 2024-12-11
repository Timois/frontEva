/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Controller } from 'react-hook-form'

export const YearInput = ({ control, errors={} }) => {
    return (
        <div className="mb-3">
            <label htmlFor="year" className="form-label">Año</label>
            <Controller
                name="year"
                control={control}
                render={({ field }) => (
                    <input
                        type="text"
                        id="year"
                        className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                        {...field}
                        value={field.value || ""}
                    />
                )}
            />
            {errors.year && <div className="invalid-feedback">{errors.year.message}</div>}
        </div>
    )
}
