import { useState } from "react";
import jwtHandler from "../utils/JwtHandler";
import { MAIN_URL } from "../api-config";

// Interface that defines the structure of the hooks return value
interface CrudState<T> {
    dataResponse: T[];
    fetchData: () => Promise<void>;
    loading: boolean;
    error: Error | null;
}

// Custom hook that fetches data and manages loading and error states.
const useCrud = <T>(initialData: T[], apiURL: string): CrudState<T> => {
    const jwtAxiosHandler = jwtHandler();

    const [dataResponse, setDataResponse] = useState<T[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await jwtAxiosHandler.get(
                `${MAIN_URL}/${apiURL}`
            );
            const data = response.data;

            setDataResponse(data);
            setError(null);
            return data
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 400) {
                    setError(new Error("400"));
                } else if (error.response.status === 404) {
                    setError(new Error("404"));
                } else {
                    setError(new Error(`Error ${error.response.status}`));
                }
            } else {
                setError(new Error("Error network"));
            }
        } finally {
            setLoading(false);
        }
    };

    return { fetchData, dataResponse, loading, error };
};

export default useCrud;
