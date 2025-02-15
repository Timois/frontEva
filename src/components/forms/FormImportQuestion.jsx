/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

export const FormImportQuestion = () => {
    // Estado para manejar la carrera seleccionada
    const [selectedCareer, setSelectedCareer] = useState({
        id: '',
        sigla: ''
    });

    // Estado para manejar el archivo seleccionado
    const [selectedFile, setSelectedFile] = useState(null);

    // Lista de carreras (puedes obtenerla de una API o hardcodearla)
    const careers = [
        { id: 1, name: 'Ingeniería en Sistemas', sigla: 'IS' },
        { id: 2, name: 'Medicina', sigla: 'MED' },
        { id: 3, name: 'Derecho', sigla: 'DER' },
    ];

    // Manejar el cambio de selección de carrera
    const handleCareerChange = (event) => {
        const careerId = event.target.value;
        const selected = careers.find(career => career.id === parseInt(careerId));
        setSelectedCareer({
            id: careerId,
            sigla: selected ? selected.sigla : ''
        });
    };

    // Manejar el cambio de archivo seleccionado
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Manejar el envío del formulario
    const handleSubmit = (event) => {
        event.preventDefault();

        // Validar que se haya seleccionado una carrera y un archivo
        if (!selectedCareer.id || !selectedFile) {
            alert('Por favor, seleccione una carrera y un archivo.');
            return;
        }

        // Crear un FormData para enviar al backend
        const formData = new FormData();
        formData.append('career_id', selectedCareer.id);
        formData.append('sigla', selectedCareer.sigla);
        formData.append('file', selectedFile);

        // Enviar los datos al backend (usando fetch o axios)
        fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                alert('Archivo subido con éxito.');
                console.log(data);
            })
            .catch(error => {
                console.error('Error al subir el archivo:', error);
                alert('Error al subir el archivo.');
            });
    };

    return (
        <div>
            <h1>Importar Preguntas desde Excel</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="career">Seleccione la carrera:</label>
                    <select
                        id="career"
                        name="career"
                        value={selectedCareer.id}
                        onChange={handleCareerChange}
                        required
                    >
                        <option value="">Seleccione una carrera</option>
                        {careers.map(career => (
                            <option key={career.id} value={career.id}>
                                {career.name} ({career.sigla})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="file">Subir archivo Excel:</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit">Importar</button>
            </form>
        </div>
    );
};