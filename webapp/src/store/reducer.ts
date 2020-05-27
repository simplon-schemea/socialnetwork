import { Actions, ActionsTypes } from "./actions";
import { InfoBannerType } from "../models/info-banner-type";

export interface State {
    infoBanner?: {
        type: InfoBannerType,
        message: string
    };
}

const initialState: State = {}

export function reducer(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case ActionsTypes.setInfoBannerMessage:
            return {
                ...state,
                infoBanner: {
                    type: action.infoType,
                    message: action.message,
                },
            }
        case ActionsTypes.clearInfoBanner:
            return {
                ...state,
                infoBanner: undefined,
            }
        default:
            return state;
    }
}
