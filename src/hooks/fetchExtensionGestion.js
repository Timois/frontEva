import { useContext } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import {GestionExtensionContext } from "../context/ExtensionGestionProvider"

export const useFetchExtensionGestion = () => {
    const { extensionsGestion, setExtensionGestion } = useContext(GestionExtensionContext)
    const getData = async () =>{
        if (extensionsGestion.lenght < 1){
            const response = await getApi("management_extension/list")
            setExtensionGestion(response)
        }
        return extensionsGestion
    }
    return { extensionsGestion, getData}
}