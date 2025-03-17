import { removeToken, removeUser } from "./storage"

export const clearStorage = () => {
    removeToken()
    removeUser()
}