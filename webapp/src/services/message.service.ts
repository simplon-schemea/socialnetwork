import { baseURL } from "../config";
import { Http } from "./http.service";
import { MessageType } from "@models/message-type";
import { UUID } from "@models/types";
import { MessageResponseResource } from "@models/resources/message-response-resource";

const endpoint = baseURL + "/messages";

export namespace MessageService {
    export function send(type: MessageType, topic: UUID, content: string) {
        return Http.request({
            url: endpoint,
            body: {
                content,
                type,
                topic,
            },
        });
    }

    export function list(type: MessageType, topic: UUID) {
        return Http.request<MessageResponseResource>({
            url: endpoint + "/list",
            params: { type, topic },
            responseType: "json",
        });
    }
}
