import "./message-list.scss";
import * as React from "react";
import { useEffect, useMemo } from "react";
import { MessageService } from "@services/message.service";
import { MessageType } from "@models/message-type";
import { UUID } from "@models/types";
import { useSelector } from "react-redux";
import { State } from "@store/reducer";
import { StoreService } from "@services/store.service";
import ReactMarkdown from "react-markdown";


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
            .map(msg => (
                <div className="message" key={ msg.id }>
                    <div className="author">
                        <div className="author-inner">
                            <div className="author-name">
                                <span>{ msg.author.lastname }</span>&nbsp;
                                <span>{ msg.author.firstname }</span>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <ReactMarkdown source={ msg.content }/>
                    </div>
                </div>
            ));
    }, [ messages ]);

    return (
        <div className="message-list-container">
            { messageElements }
        </div>
    );
}
