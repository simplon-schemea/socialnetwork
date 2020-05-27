import "./info-banner.scss";
import React from "react";
import { useSelector } from "react-redux";
import { State } from "../store/reducer";
import classNames from "classnames";


export function InfoBanner() {
    const errors = useSelector((state: State) => state.infoBanner);

    return (
        <React.Fragment>
            { errors && (
                <div className={ classNames("info-banner-container", errors.type) }>
                    { errors.message }
                </div>
            ) }
        </React.Fragment>
    );
}
