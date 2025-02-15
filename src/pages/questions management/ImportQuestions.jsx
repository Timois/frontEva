/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react'
import ButtonEdit from '../periods/ButtonEdit'

export const ImportQuestions = () => {
     const { importExcel, setImportExcel } = useContext(PeriodContext)
      const [selectedImport, setSelectedImport] = useState(null)
    
      const handleEditClick = (import) => {
        setSelectedPeriod(import)
      }
    
      const { getData } = useFetchPeriod()
      useEffect(() => {
        getData()
      }, [])
      const idEditar = "editarPeriodo"
    return (
        <>
            <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
                <thead>
                    <tr>
                        <th scope="col">N°</th>
                        <th scope="col">Periodo</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {importQuestions.length > 0 ? (
                        imports.map((import, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{import.file_name}</td>
                                <td>{import.status}</td>
                                <td>
                                    <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(period)} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No hay Periodos registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <ModalEdit idEditar={idEditar} data={selectedPeriod} title="Editar Periodo" />
        </>
    )
}
