import { UUID } from "../types";

export interface MessageResource {
    id: UUID;
    author: UUID;
    content: string;
    timestamp: string;
}
