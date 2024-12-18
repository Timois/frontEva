import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const CareerAssignContext = createContext();

export const CareerAssignProvider = ({ children }) => {
    const [careerAssignments, setCareerAssignments] = useState([]);

    const addAssignment = (assignment) => {
        setCareerAssignments([...careerAssignments, assignment]);
    };

    const removeAssignment = (id) => {
        setCareerAssignments(careerAssignments.filter(assignment => assignment.id !== id));
    };

    return (
        <CareerAssignContext.Provider value={{ careerAssignments, addAssignment, removeAssignment, setCareerAssignments }}>
            {children}
        </CareerAssignContext.Provider>
    );
};

CareerAssignProvider.propTypes = {
    children: PropTypes.node,
};
