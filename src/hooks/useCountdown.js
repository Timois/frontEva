import { useState, useEffect } from 'react';

export const useCountdown = (data) => {
    const [countdowns, setCountdowns] = useState([]);

    const calculateTimeRemaining = (endDate) => {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        const currentDate = new Date();
        const timeRemaining = end - currentDate;

        if (timeRemaining <= 0) {
            return "Tiempo agotado";
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        const updateCountdowns = () => {
            const newCountdowns = data.map((gestion, index) => ({
                index,
                countdown: calculateTimeRemaining(gestion.end_date)
            }));

            setCountdowns(prev => {
                const updated = [...prev];
                newCountdowns.forEach(({ index, countdown }) => {
                    updated[index] = countdown;
                });
                return updated;
            });
        };

        // Actualización inicial
        updateCountdowns();

        // Actualizar cada segundo
        const intervalId = setInterval(updateCountdowns, 1000);

        return () => clearInterval(intervalId);
    }, [data]);

    return countdowns;
};