import { UUID } from "./types";
import { AuthorResource } from "./resources/message-response-resource";

export interface MessageData {
    id: UUID;
    author: AuthorResource & { id: UUID };
    content: string;
    timestamp: string;
}
