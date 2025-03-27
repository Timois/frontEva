import { useContext } from "react"
import { RolContext } from "../context/RolesProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchRol = () => {
    const { roles, setRoles } = useContext(RolContext)

    const getData = async () => {
        if (roles.length < 1){
            const response = await getApi("roles/list")
            setRoles(response)
        }
        return roles
    }
    return { roles, getData}
}