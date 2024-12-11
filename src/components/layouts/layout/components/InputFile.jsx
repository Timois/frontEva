/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Controller } from "react-hook-form";

const InputFile = ({ name, control, onChange, error, accept, errors={} }) => {
    return (
        <div>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <input
                        type="file"
                        id="type"
                        accept={accept}
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file && onChange) {
                              onChange(file)
                            }
                          }}
                        className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                        {...field}
                        value={field.value || ""}
                    />
                )}
            />
            {error && <p style={{ color: "red", marginTop: "0.5em" }}>{error}</p>}
        </div>
    );
};

export default InputFile;
