import { removeStudent, removeTokenStudent } from "./storageStudent"
import { removeToken, removeUser } from "./storageUser"

export const clearStorage = () => {
    removeToken()
    removeUser()
}

export const clearStorageStudent = () => {
    removeTokenStudent()
    removeStudent()
}