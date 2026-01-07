export  interface BackendTokenRefreshResponse{
    access :string
}

export interface BackendUser{
    id: number
    name:string
    email:string
    picture:string
}