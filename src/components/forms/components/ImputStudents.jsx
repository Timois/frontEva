/* eslint-disable react/prop-types */
export const ImputStudents = ({ onChange }) => {
    const handleChange = (e) => {
        const file = e.target.files[0];
        onChange(file); // <-- Asegúrate de que estás pasando el archivo
    };

    return (
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleChange} />
    );
};
