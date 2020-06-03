import "./info-banner.scss";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useStore } from "react-redux";
import { State } from "@store/reducer";
import classNames from "classnames";
import { actions } from "@store/actions";
import { Transition } from "react-transition-group";
import { Close } from "@material-ui/icons";

export function InfoBannerComponent() {
    const errors = useSelector((state: State) => state.infoBanner);

    const timerID = useRef<number | null>(null);

    const ref = useRef<HTMLDivElement | null>(null);

    const store = useStore<State>();

    const close = useCallback(function () {
        store.dispatch(actions.clearInfoBanner());
    }, [ store ]);

    useEffect(function () {
        if (errors) {
            if (timerID.current) {
                clearTimeout(timerID.current);
            }

            timerID.current = window.setTimeout(function () {
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
                    <div className={ classNames("info-banner-container", state) }>
                        <div ref={ ref } className={ classNames(displayedErrors.type, state) }>
                            { displayedErrors.message }
                            <Close className="icon" onClick={ close }/>
                        </div>
                    </div>
                ) }
            </Transition>
        </React.Fragment>
    );
}
