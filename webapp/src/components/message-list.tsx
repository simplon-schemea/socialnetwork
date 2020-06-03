import "./message-list.scss";
import * as React from "react";
import { useEffect, useMemo } from "react";
import { MessageService } from "@services/message.service";
import { MessageType } from "@models/message-type";
import { UUID } from "@models/types";
import { useSelector } from "react-redux";
import { State } from "@store/reducer";
import { StoreService } from "@services/store.service";
import { MessageComponent } from "./message";


interface Props {
    type: MessageType
    topic: UUID
}

export function MessageListComponent(props: Props) {
    const messages = useSelector((state: State) => state.messages[props.topic] || []);

    useEffect(function () {
        MessageService.list(props.type, props.topic).then(response => StoreService.updateMessageList(props.topic, response));
    }, [ props.topic ]);

    const messageElements = useMemo(function () {
        return messages
            .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
            .map(msg => <MessageComponent message={ msg }/>);
    }, [ messages ]);

    return (
        <div className="message-list-container">
            { messageElements }
        </div>
    );
}
