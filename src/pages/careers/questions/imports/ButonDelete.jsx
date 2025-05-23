/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { MdDelete } from "react-icons/md"
import { customAlert } from "../../../../utils/domHelper"
import { deleteApi } from "../../../../services/axiosServices/ApiService"
import { confirmDelete } from "../../../../hooks/ConfirmDelete"
import { ImportExcelQuestionsContext } from "../../../../context/ImportExcelQuestionsProvider"
import { useContext } from "react"

export const ButonDelete = ({idExcel}) => {
    const { getData } = useContext(ImportExcelQuestionsContext)
    const handleDelete = async(idExcel)=>{
       const result = await confirmDelete("¿Desea eliminar el archivo?")
       if (result) {
           const response = await deleteApi(`excel_import/delete/${idExcel}`)
           if (response) {
               customAlert("El archivo fue eliminado")
               getData()
           }
       }else{
           customAlert("El archivo no fue eliminado")
       }
    }

    return (
        <button
            type="button"
            className="btn btn-sm btn-outline-danger d-flex align-items-center m-2 p-2"
            title="Eliminar archivo"
            onClick={() => {
                handleDelete(idExcel)
            }}
        >
            <MdDelete />
        </button>
    )
}
