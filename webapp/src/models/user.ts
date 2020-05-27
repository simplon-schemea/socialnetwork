export interface UserCredentials {
    mail: string;
    password: string;
}

export interface User extends UserCredentials{
    firstname: string;
    lastname: string;
    birthday?: string;
}
