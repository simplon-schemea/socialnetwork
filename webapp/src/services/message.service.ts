import { baseURL } from "../config";
import { Http } from "./http.service";
import { MessageType } from "@models/message-type";
import { store } from "@store";
import { UUID } from "@models/types";
import { Message } from "@models/message";

const endpoint = baseURL + "/messages";

export namespace MessageService {
    export function send(content: string) {
        return Http.request({
            url: endpoint,
            body: {
                content,
                type: MessageType.PROFILE,
                topic: store.getState().profile?.id,
            },
        });
    }

    export function list(type: MessageType, topic: UUID) {
        return Http.request<Message[]>({
            url: endpoint + "/list",
            params: { type, topic },
            responseType: "json"
        })
    }
}
