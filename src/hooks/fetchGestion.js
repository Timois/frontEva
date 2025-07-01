import { useContext } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { GestionContext } from "../context/GestionProvider"

export const useFetchGestion = () =>{
    const { gestions, setGestions } = useContext(GestionContext)
    const getData = async () => {
        if (gestions.length < 1){
            const response = await getApi("management/list")
            setGestions(response)
        }
        return gestions 
    }
    
    const refreshGestions = async () => {
        const response = await getApi("management/list");
        setGestions(response);
    };
    return { gestions, getData, refreshGestions}
}