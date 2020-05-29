import "./message-list.scss";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Message } from "@models/message";
import { MessageService } from "@services/message.service";
import { MessageType } from "@models/message-type";
import { UUID } from "@models/types";

interface Props {
    type: MessageType
    topic: UUID
}

export function MessageListComponent(props: Props) {
    const [ messages, setMessages ] = useState<Message[]>([]);

    useEffect(function () {
        MessageService.list(props.type, props.topic).then(function (messages) {
            setMessages(messages);
        });
    }, [ setMessages ]);

    const messageElements = useMemo(function () {
        return messages.map(msg => (
            <div className="message" key={ msg.id }>
                { msg.content }
            </div>
        ));
    }, [ messages ]);

    return (
        <div className="message-list-container">
            { messageElements }
        </div>
    );
}
