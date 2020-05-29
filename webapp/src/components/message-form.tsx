import "./message-form.scss";
import { Button } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import React, { FormEvent, useCallback, useState } from "react";
import { MessageService } from "@services/message.service";
import { store } from "@store";
import { actions } from "@store/actions";


export function MessageFormComponent() {
    const [ content, setContent ] = useState("");

    const onChange = useCallback(function (event: React.ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value);
    }, [ setContent ]);

    const onSubmit = useCallback(function (event: FormEvent) {
        event.preventDefault();
        MessageService.send(content).then(function () {
            store.dispatch(actions.setInfoBannerMessage("success", "Message Sent"));
        });
    }, [ content ]);

    return (
        <form onSubmit={ onSubmit } className="message-form-container">
            <textarea required={ true } name="content" value={ content } onChange={ onChange } className="content"/>
            <Button type="submit">
                <Send/>
            </Button>
        </form>
    );
}
