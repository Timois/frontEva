/* eslint-disable no-unused-vars */
import { useContext, useState } from "react"
import { GroupContext } from "../context/GroupsProvider"
import { getApi } from "../services/axiosServices/ApiService"
export const fetchGroupByEvaluation = () => {
    const { groups, setGroups } = useContext(GroupContext);
    const [totalStudents, setTotalStudents] = useState(0);

    const getDataGroupEvaluation = async (evaluationId) => {
        try {
            const response = await getApi(`groups/listByEvaluation/${evaluationId}`);
            setGroups(response.groups); // solo guardas el array
            setTotalStudents(response.total_students); // manejas total por separado
        } catch (error) {
            //console.error("Error fetching groups:", error);
        }
    };
    const refreshGroups = getDataGroupEvaluation; // puedes usar el mismo nombr
    return {
        groups,
        totalStudents,
        getDataGroupEvaluation,
        refreshGroups,
    };
};
