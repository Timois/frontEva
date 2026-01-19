/* eslint-disable react/prop-types */
import { forwardRef, useEffect, useState } from "react";

export const InputFile = forwardRef(
  ({ onChange, error, accept, defaultPreview }, ref) => {
    const [preview, setPreview] = useState(defaultPreview || null);
    const [fileName, setFileName] = useState(null);
    const [isImage, setIsImage] = useState(false);

    const handleFileChange = (e) => {
      const files = e.target.files;

      if (files?.length > 0) {
        const file = files[0];
        const fileURL = URL.createObjectURL(file);

        setFileName(file.name);
        setIsImage(file.type.startsWith("image/"));
        setPreview(fileURL);
        onChange([file]);
      } else {
        resetLocal();
      }
    };

    const resetLocal = () => {
      setPreview(null);
      setFileName(null);
      setIsImage(false);
      onChange([]);
    };

    useEffect(() => {
      if (defaultPreview) {
        setPreview(defaultPreview);
        setIsImage(true);
      }
    }, [defaultPreview]);

    // Limpieza del objeto URL
    useEffect(() => {
      return () => {
        if (preview) {
          URL.revokeObjectURL(preview);
        }
      };
    }, [preview]);

    return (
      <div>
        <input
          ref={ref}                 // 👈 CLAVE
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="form-control"
        />

        {preview && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {isImage ? (
              <img
                src={preview}
                alt="Vista previa"
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "contain",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#f9f9f9",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <strong>Archivo seleccionado:</strong> {fileName}
              </div>
            )}
          </div>
        )}

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

// Opcional pero recomendado (mejor debug)
InputFile.displayName = "InputFile";
