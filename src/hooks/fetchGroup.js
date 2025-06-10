import { useContext } from "react"
import { GroupContext } from "../context/GroupsProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const fetchGroup = () => {
    const {groups, setGroups} = useContext(GroupContext)

    const getDataGroup = async () => {
        try {
            const response = await getApi("groups/list")
            setGroups(response)
        }catch (error) {
            console.error("Error fetching groups:", error)
        }
    }
    
    return {
        groups,
        getDataGroup
    }
}

export const fetchGroupByEvaluation = () => {
    const {groups, setGroups} = useContext(GroupContext)
    const getDataGroupEvaluation = async (evaluationId) => {
        try {
            const response = await getApi(`groups/listByEvaluation/${evaluationId}`)
            setGroups(response)
        }catch (error) {
            console.error("Error fetching groups:", error)
        }
    }
    return {
        groups,
        getDataGroupEvaluation
    }
}