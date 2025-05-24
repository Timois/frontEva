/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { MdDelete } from "react-icons/md"
import { customAlert } from "../../../../utils/domHelper"
import { deleteApi } from "../../../../services/axiosServices/ApiService"
import { useContext } from "react"
import { ImportExcelQuestionsContext } from "../../../../context/ImportExcelQuestionsProvider"
import { confirmDelete} from "../../../../hooks/confirmDelete"
export const ButonDelete = ({ idExcel }) => {
    const { importExcelQuestions, setImportExcelQuestions } = useContext(ImportExcelQuestionsContext)

    const handleDelete = async (idExcel) => {
        const result = await confirmDelete("¿Desea eliminar el archivo?")
        if (result) {
            const response = await deleteApi(`excel_import/delete/${idExcel}`)
            if (response) {
                customAlert("El archivo fue eliminado")
                // Elimina del estado directamente sin llamar a getData
                setImportExcelQuestions(prev => prev.filter(excel => excel.id !== idExcel))
            }
        } else {
            customAlert("El archivo no fue eliminado")
        }
    }

    return (
        <button
            type="button"
            className="btn btn-sm btn-outline-danger d-flex align-items-center m-2 p-2"
            title="Eliminar archivo"
            onClick={() => handleDelete(idExcel)}
        >
            <MdDelete />
        </button>
    )
}
