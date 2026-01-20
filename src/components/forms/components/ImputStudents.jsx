/* eslint-disable react/prop-types */
export const ImputStudents = ({ onChange }) => {
    const handleChange = (e) => {
        const file = e.target.files?.[0] || null;
        onChange(file);
    };

    return (
        <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleChange}
        />
    );
};
