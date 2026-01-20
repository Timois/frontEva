import { useRef, useState } from "react";

export const useIdempotentSubmit = () => {
    const inFlightRef = useRef(false);
    const [idempotencyKey, setIdempotencyKey] = useState(null);

    const start = () => {
        if (inFlightRef.current) return null;

        inFlightRef.current = true;
        const key = crypto.randomUUID();
        setIdempotencyKey(key);
        return key;
    };

    const end = () => {
        inFlightRef.current = false;
        setIdempotencyKey(null);
    };

    return {
        start,
        end,
        isSubmitting: inFlightRef.current,
        idempotencyKey,
    };
};
