/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FileUp, Upload } from 'lucide-react';

function FormImportQuestions() {
  const [career, setCareer] = useState('');
  const [code, setCode] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí manejarías la subida del archivo
    console.log({
      career,
      code,
      file
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <FileUp className="h-12 w-12 text-indigo-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Subir Archivo Excel
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="career" className="block text-sm font-medium text-gray-700 mb-1">
              Carrera
            </label>
            <input
              id="career"
              type="text"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Sigla
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Archivo Excel
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file"
                    className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Seleccionar archivo</span>
                    <input
                      id="file"
                      name="file"
                      type="file"
                      accept=".xlsx,.xls"
                      className="sr-only"
                      onChange={(e) => setFile(e.target.files[0] || null)}
                      required
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Excel (.xlsx, .xls)
                </p>
                {file && (
                  <p className="text-sm text-indigo-600 font-medium">
                    {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Subir Archivo
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormImportQuestions;
