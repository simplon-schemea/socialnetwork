import { UUID } from "@models/types";
import { MessageResponseResource } from "@models/resources/message-response-resource";
import { MessageData } from "@models/message-data";
import { store } from "@store";
import { actions } from "@store/actions";

export namespace StoreService {
    export function updateMessageList(topic: UUID, response: MessageResponseResource) {
        const data = response.messages.map((msg): MessageData => ({
            ...msg,
            author: response.authors[msg.author],
        }));

        store.dispatch(actions.updateMessageList(topic, data));
    }
}
