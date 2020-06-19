import "./message-form.scss";
import Button from "@material-ui/core/Button";
import Send from "@material-ui/icons/Send";
import React, { FormEvent, useCallback, useContext, useState } from "react";
import { MessageService } from "@services/message.service";
import { store } from "@store";
import { actions } from "@store/actions";
import { StoreService } from "@services/store.service";
import { UUID } from "@models/types";
import { MessageType } from "@models/message-type";
import { HttpContext } from "../http";

interface Props {
    topic: UUID
    type: MessageType
}

export function MessageFormComponent(props: Props) {
    const [ content, setContent ] = useState("");

    const messageService = new MessageService(useContext(HttpContext));

    const onChange = useCallback(function (event: React.ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value);
    }, [ setContent ]);

    const onSubmit = useCallback(function (event: FormEvent) {
        event.preventDefault();
        messageService.send(props.type, props.topic, content).then(function () {
            store.dispatch(actions.setInfoBannerMessage("success", "Message Sent"));
            setContent("");
            messageService.list(props.type, props.topic).then(response => StoreService.updateMessageList(props.topic, response));
        });
    }, [ content, props.topic, props.type ]);

    const onKeyDown = useCallback(function (event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSubmit(event);
        }
    }, [ setContent, onSubmit ]);

    return (
        <form onSubmit={ onSubmit } className="message-form-container">
            <textarea required={ true } name="content" value={ content } onChange={ onChange } onKeyDown={ onKeyDown }
                      className="content"/>
            <Button type="submit">
                <Send/>
            </Button>
        </form>
    );
}
