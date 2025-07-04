/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from 'react'
import { ImportExcelQuestionsContext } from '../../../../context/ImportExcelQuestionsProvider'
import CheckPermissions from '../../../../routes/CheckPermissions'
import { ButtonImport } from './ButtonImport'
import { FaFileExcel } from 'react-icons/fa'
import { ModalImport } from './ModalImport'
import { ButtonViewQuestions } from './ButtonViewQuestions'
import { ButonDelete } from './ButonDelete'
import { Link, useParams } from 'react-router-dom'
import { useFetchAreaById } from '../../../../hooks/fetchAreas'

export const ImportQuestions = () => {
    const { id } = useParams()
    const { area, getDataAreaById} = useFetchAreaById()
    const { importExcelQuestions, setImportExcelQuestions, getData } = useContext(ImportExcelQuestionsContext)
    useEffect(() => {
        setImportExcelQuestions([]);
        if (id) {
            getData({ area_id: id });
        }
        return () => {
            setImportExcelQuestions([]);
        };
    }, [id]);
    
    useEffect(() => {
        getDataAreaById(id)
    }, [id])
    
    const IdImport = "importExcel";
    return (
        <div className="container-fluid p-4">
            <h1 className="text-center mb-4 text-capitalize">
                Area de {area.name}
            </h1>
            <Link to={"/administracion/areas"} className='btn btn-dark mb-2'>volver</Link>    
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="card-header bg-primary text-white py-3 rounded-top d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">
                        <FaFileExcel className="me-2" />
                        Archivos Importados
                    </h3>
                    
                    <CheckPermissions requiredPermission="importar-excel">
                        <ButtonImport
                            modalIdImp={IdImport}
                            className="btn btn-light btn-sm"
                        />
                    </CheckPermissions>
                </div>

                <div className="table-responsive rounded-3">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th scope="col" className="text-center fw-medium text-primary">N°</th>
                                <th scope="col" className="fw-medium text-primary">Archivo</th>
                                <th scope="col" className="fw-medium text-primary">Descripción</th>
                                <th scope="col" className="fw-medium text-primary">Estado</th>
                                <th scope="col" className="fw-medium text-primary">Tamaño</th>
                                <th scope="col" className="text-center fw-medium text-primary">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {importExcelQuestions.length > 0 ? (
                                importExcelQuestions.map((excel, index) => (
                                    <tr key={index}>
                                        <td className="text-center text-muted">{index + 1}</td>
                                        <td className="fw-semibold">{excel.file_name}</td>
                                        <td>{excel.description}</td>
                                        <td>
                                            <span className={`badge py-2 px-3 ${excel.status === 'completado' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                                {excel.status}
                                            </span>
                                        </td>
                                        <td>{(excel.size / (1024 * 1024)).toFixed(2)} MB</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <ButtonViewQuestions idExcel={excel.id}/>
                                                <ButonDelete 
                                                    idExcel={excel.id} 
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center text-muted">
                                            <FaFileExcel className="fs-1 mb-2" />
                                            No hay ningún archivo importado.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <CheckPermissions requiredPermission="importar-excel">
                        <ModalImport
                            modalIdImp={IdImport}
                            title="Importar Preguntas"
                        />
                    </CheckPermissions>
                </div>
            </div>
        </div>
    );
}
