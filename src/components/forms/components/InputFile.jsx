/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
export const InputFile = ({ onChange, error, accept, placeholder }) => {
  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length > 0) {
            onChange(Array.from(files)); // Convertir FileList a Array
          } else {
            onChange([]); // Si no hay archivos, enviar array vacío
          }
        }}
        accept={accept}
        className="form-control"
      />
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
};
