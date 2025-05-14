export const saveTokenStudent = (token) => {
    window.localStorage.setItem("jwt_token", token);
};

export const getTokenStudent = () => {
    return window.localStorage.getItem("jwt_token");
};

export const removeTokenStudent = () => {
    window.localStorage.removeItem("jwt_token");
};

export const saveStudent = (student) => {
   if (student) {
        const dataString = JSON.stringify(student);
        window.localStorage.setItem("user", dataString);
    }
};

export const getStudent = () => {
    const student = window.localStorage.getItem("user");
    if (student&& student !== 'undefined') {
        return JSON.parse(student);
    }
    return null;
};

export const removeStudent = () => {
    window.localStorage.removeItem("user");
};

export const savePermissionsStudent = (permissions) => {
    if (permissions) {
        localStorage.setItem("permissions", JSON.stringify(permissions));
    }
};