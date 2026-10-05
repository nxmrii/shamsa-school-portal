export type UserType =
  | "teacher"
  | "parent"
  | "student"


export type PasswordRequest = {
  userType: UserType
  civilId: string
}


export type PasswordResponse = {
  success: boolean
  password?: string
  message?: string
}