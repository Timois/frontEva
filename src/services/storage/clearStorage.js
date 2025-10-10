import { removePermissionsStudent, removeStudent, removeTokenStudent } from "./storageStudent"
import { removePermissions, removeRolesPermissions, removeToken, removeUser } from "./storageUser"

export const clearStorage = () => {
    removeToken()
    removeUser()
    removePermissions()
    removeRolesPermissions()
}

export const clearStorageStudent = () => {
    removeTokenStudent()
    removeStudent()
    removePermissionsStudent()
}
