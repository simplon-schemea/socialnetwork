import { UUID } from "./types";

export interface Profile {
    id: UUID;
    mail: string;
    firstname: string;
    lastname: string;
    birthday?: string;
}
