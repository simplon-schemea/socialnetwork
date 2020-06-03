import { UUID } from "../types";

export interface ProfileResource {
    id: UUID;
    mail: string;
    firstname: string;
    lastname: string;
    birthday?: string;
}
