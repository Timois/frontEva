import { removeCredentials, removeKeySystem, removeTokenSystem } from "./storage"

export const clearStorage = () => {
    removeCredentials()
    removeKeySystem()
    removeTokenSystem()
}