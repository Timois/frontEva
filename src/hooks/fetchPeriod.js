/* eslint-disable no-unused-vars */
import { useContext } from "react"
import { PeriodContext } from "../context/PeriodProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchPeriod = () => {
    const { periods, setPeriods } = useContext(PeriodContext)
    const getData = async () => {
        const response = await getApi("periods/list")
        setPeriods(response)
        return periods
    }

    const refreshPeriods = async () => {
        const response = await getApi("periods/list");
        setPeriods(response);
    };
    return { periods, getData, refreshPeriods }

}

