import { useContext } from "react";
import { getApi } from "../services/axiosServices/ApiService";
import { UnitContext } from "../context/UnitProvider";

export const useFetchUnit = () => {
    const { units, setUnits } = useContext(UnitContext);

    const getData = async () => {
        if (units.length < 1) {
            const response = await getApi("careers/listsFacultiesMayor");
            setUnits(response);
        }
        return units;
    };

    // ✅ Esta función siempre refresca la lista de unidades
    const refreshUnits = async () => {
        const response = await getApi("careers/listsFacultiesMayor");
        setUnits(response);
    };

    return { units, getData, refreshUnits };
};
