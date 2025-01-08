import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const CareerAssignContext = createContext();

export const CareerAssignProvider = ({ children }) => {
    const [careerAssignments, setCareerAssignments] = useState([]);
    const [careerAssignmentsPeriods, setCareerAssignmentsPeriods] = useState([]);

    const addAssignment = (assignment) => {
        setCareerAssignments([...careerAssignments, assignment]);
    };

    const removeAssignment = (id) => {
        setCareerAssignments(careerAssignments.filter(assignment => assignment.id !== id));
    };

    const addAssignmentPeriod = (assignment) => {
        setCareerAssignmentsPeriods([...careerAssignmentsPeriods, assignment]);
    }

    const removeAssignmentPeriod = (id) => {
        setCareerAssignmentsPeriods(careerAssignmentsPeriods.filter(assignment => assignment.id !== id));
    }

    return (
        <CareerAssignContext.Provider value={{
            careerAssignments,
            addAssignment,
            removeAssignment,
            setCareerAssignments,
            addAssignmentPeriod,
            removeAssignmentPeriod,
            careerAssignmentsPeriods,
            setCareerAssignmentsPeriods
        }}>
            {children}
        </CareerAssignContext.Provider>
    );
};

CareerAssignProvider.propTypes = {
    children: PropTypes.node,
};
