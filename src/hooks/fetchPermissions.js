import { useContext } from "react"
import { PermissionsContext } from "../context/PermissionsProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchPermission = () => {
    const { permisos, setPermisos} = useContext(PermissionsContext)

    const getData = async () => {
        if(permisos.length < 1){
            const response = await getApi("permissions/list")
            setPermisos(response)
        }
        return permisos
    }

    return { permisos, getData}
}