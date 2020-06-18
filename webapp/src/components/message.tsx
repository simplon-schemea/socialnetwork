import "./message.scss";

import React, { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { MessageData } from "@models/message-data";
import { useHistory } from "react-router";
import Reply from "@material-ui/icons/Reply";
import Button from "@material-ui/core/Button";


interface Props {
    message: MessageData
}

export function MessageComponent({ message }: Props) {
    const history = useHistory();

    const onAuthorClick = useCallback(function () {
        history.push(`/profile/${ message.author.id }`);
    }, [ message.author.id ]);

    return (
        <div className="message-container" key={ message.id }>
            <div className="author" onClick={ onAuthorClick }>
                <div>
                    <img src="/assets/portrait.png" alt="" className="author-image"/>
                    <div className="author-name-wrapper">
                        <div className="author-name">
                            <span>{ message.author.lastname }</span>&nbsp;
                            <span>{ message.author.firstname }</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content">
                <ReactMarkdown source={ message.content }/>
                <div className="content-footer">
                    <Button className="fab" variant="outlined">
                        <Reply fontSize="small"/>
                    </Button>
                </div>
            </div>
        </div>
    );
}
