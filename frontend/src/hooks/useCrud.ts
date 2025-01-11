import { useState } from "react";
import jwtHandler from "../utils/JwtHandler";

// Interface that defines the structure of the hooks return value
interface CrudState<T> {
    dataResponse: T[];
    fetchData: () => Promise<void>;
    loading: boolean;
    error: Error | null;
}

// Custom hook, that fetches data and manages loading and error states.
const useCrud = <T>(initialData: T[], apiURL: string): CrudState<T> => {
    const jwtAxiosHandler = jwtHandler();

    const [dataResponse, setDataResponse] = useState<T[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await jwtAxiosHandler.get(
                `http://127.0.0.1:8000/api/${apiURL}`,
                {}
            );
            const data = response.data;
            setDataResponse(data);
            setError(null);
            setLoading(false);
            return data;
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                setError(new Error("400"));
            }
            setLoading(false);
            return Promise.reject(error);
        }
    };

    return { fetchData, dataResponse, loading, error };
};

export default useCrud;
