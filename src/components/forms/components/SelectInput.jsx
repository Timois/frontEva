/* eslint-disable react/prop-types */
import { Controller } from "react-hook-form";

export const SelectInput = ({ name, options, error, control, label, castToNumber = false }) => (
  <div className="mb-3">
    {label && <label className="form-label">{label}</label>}
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <select
          {...field}
          id={name}
          className={`form-select w-100 ${error ? "is-invalid" : ""}`}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              field.onChange(undefined); // o null si prefieres
            } else {
              field.onChange(castToNumber ? Number(value) : value);
            }
          }}
          value={field.value ?? ""}
        >
          <option value="">Seleccione una opción</option>
          {options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      )}
    />
  </div>
);
