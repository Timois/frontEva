/* eslint-disable react/prop-types */
import { Controller } from 'react-hook-form';
import Select from 'react-select';

export const SelectMultiple = ({ name, control, options, label, isMulti = false }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="form-group">
          <label>{label}</label>
          <Select
            {...field}
            options={options}
            isMulti={isMulti}
            onChange={(selected) => {
              const value = isMulti 
                ? selected?.map(item => String(item.value)) || []
                : selected?.value ? String(selected.value) : null;
              field.onChange(value);
            }}
            value={
              isMulti
                ? options.filter(option => 
                    field.value?.includes(String(option.value)))
                : options.find(option => 
                    String(option.value) === String(field.value)) || null
            }
            className={error ? 'is-invalid' : ''}
            classNamePrefix="select"
          />
          {error && (
            <div className="invalid-feedback d-block">
              {error.message}
            </div>
          )}
        </div>
      )}
    />
  );
};