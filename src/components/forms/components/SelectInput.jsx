/* eslint-disable react/prop-types */
import { Controller } from "react-hook-form";

export const SelectInput = ({ name, options, error, control, label, castToNumber = false, onChange }) => (
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
            const finalValue = value === "" ? undefined : (castToNumber ? Number(value) : value);
            field.onChange(finalValue); // actualiza react-hook-form
            if (onChange) onChange(e);  // actualiza tu estado local si se lo pasas
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
  