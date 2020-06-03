import { MessageResource } from "./message-resource";

export interface AuthorResource {
    firstname: string,
    lastname: string
}

export interface MessageResponseResource {
    authors: { [k: string]: AuthorResource }
    messages: MessageResource[]
}
