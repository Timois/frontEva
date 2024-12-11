export const saveTokenSystem = (token) =>{
    window.localStorage.setItem("token_system", token)
} 

export const getTokenSystem = () =>{
    return window.localStorage.getItem("token_system")
}

export const removeTokenSystem = () =>{
    window.localStorage.removeItem("token_system")
}
export const saveKeySystem = (key) =>{
    window.localStorage.setItem("key", key)
}

export const getKeySystem = () =>{
    return window.localStorage.getItem("key")
}

export const removeKeySystem = () =>{
    window.localStorage.removeItem("key")
}

export const saveCredentials = (dayly, weekly) =>{
    window.localStorage.setItem("dayly", dayly)
    window.localStorage.setItem("weekly", weekly)
}

export const getDaylyToken = () => {
    return window.localStorage.getItem("dayly")
}
export const getWeeklyToken = () =>{
    return window.localStorage.getItem("weekly")
}

export const removeCredentials = () =>{
    window.localStorage.removeItem("dayly")
    window.localStorage.removeItem("weekly")
}

export const saveUser = (user) => {
    const dataString = JSON.stringify(user)
    window.localStorage.setItem("user",dataString)
}

export const getUser = () => {
    const user = window.localStorage.getItem("user")
    return JSON.parse(user)
}
export const removeUser = () => {
    window.localStorage.removeItem("user")
}