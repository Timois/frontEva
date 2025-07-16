/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export const InputFile = ({ onChange, error, accept, defaultPreview }) => {
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
      setPreview(null);
      setFileName(null);
      setIsImage(false);
      onChange([]);
    }
  };

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
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="form-control"
      />

      {preview && (
        <div style={{ marginTop: "10px" }}>
          {isImage ? (
            <img
              src={preview}
              alt="Vista previa"
              style={{ maxWidth: "150px", height: "auto", borderRadius: "8px" }}
            />
          ) : (
            <div
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              <strong>Archivo seleccionado:</strong> {fileName}
            </div>
          )}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
};
