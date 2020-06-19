import { baseURL } from "../config";
import { MessageType } from "@models/message-type";
import { UUID } from "@models/types";
import { MessageResponseResource } from "@models/resources/message-response-resource";
import { HttpClient } from "../http/client";

const endpoint = baseURL + "/messages";

export class MessageService {

    constructor(public readonly http: HttpClient) {}

    send(type: MessageType, topic: UUID, content: string) {
        return this.http.request({
            url: endpoint,
            body: {
                content,
                type,
                topic,
            },
        });
    }

    list(type: MessageType, topic: UUID) {
        return this.http.request<MessageResponseResource>({
            url: endpoint + "/list",
            params: { type, topic },
            responseType: "json",
        });
    }
}
