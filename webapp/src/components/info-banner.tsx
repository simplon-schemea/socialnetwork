import "./info-banner.scss";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { State } from "../store/reducer";
import classNames from "classnames";
import { store } from "../store";
import { actions } from "../store/actions";
import { Transition } from "react-transition-group";


export function InfoBanner() {
    const errors = useSelector((state: State) => state.infoBanner);

    const timerID = useRef<number | null>(null);

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(function () {
        if (errors) {
            if (timerID.current) {
                clearTimeout(timerID.current);
            }

            // @ts-ignore
            timerID.current = setTimeout(function () {
                timerID.current = 0;
                store.dispatch(actions.clearInfoBanner());
            }, 5 * 1000);
        }
    }, [ errors ]);

    let previousErrors: typeof errors;
    {
        const errorsRef   = useRef(errors);
        previousErrors    = errorsRef.current;
        errorsRef.current = errors;
    }

    const displayedErrors = errors || previousErrors;

    return (
        <React.Fragment>
            <Transition in={ !!errors } timeout={ 300 } mountOnEnter={ true } unmountOnExit={ true }>
                { (state) => displayedErrors && (
                    <div ref={ ref } className={ classNames("info-banner-container", displayedErrors.type, state) }>
                        { displayedErrors.message }
                    </div>
                ) }
            </Transition>
        </React.Fragment>
    );
}
