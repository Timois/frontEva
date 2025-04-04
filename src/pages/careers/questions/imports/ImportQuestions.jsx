/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useContext, useState } from 'react'
import { ModalEdit } from '../ModalEdit'
import { ImportExcelQuestionsContext } from '../../../../context/ImportExcelQuestionsProvider'


export const ImportQuestions = () => {
    const { imports, setImportExcelQuestions} = useContext(ImportExcelQuestionsContext)
    const [selectedExcelImport, setSelectedExcelImport] = useState(null)


    const handleEditClick = (excel) => {
        setSelectedExcelImport(excel)
    }

    const {getData} = useFetchImportQuestions()
    useEffect(() => {
        getData()
    }, [])
        
    const idEditar = "editarExcelImport"
    return (
        <>
            <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
                <thead>
                    <tr>
                        <th scope="col">N°</th>
                        <th scope="col">Archivo</th>
                        <th scope="col">Carrera</th>
                        <th scope="col">Sigla</th>
                        <th scope="col">Tamaño</th>
                        <th scope="col">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {imports.length > 0 ? (
                        imports.map((excel, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{excel.file_name}</td>
                                <td>{excel.career}</td>
                                <td>{excel.sigla}</td>
                                <td>{excel.size}</td>
                                <td>
                                    <ModalEdit
                                        idEditar={idEditar}
                                        data={excel}
                                        title="Editar Archivo"
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No hay ningun archivo importado</td>
                        </tr>
                    )}
                </tbody>
            </table>
           
        </>
    )
}
