import { Actions, ActionsTypes } from "./actions";
import { InfoBannerType } from "../models/info-banner-type";
import { Profile } from "../models/profile";

export interface State {
    infoBanner?: {
        type: InfoBannerType,
        message: string
    };
    profile?: Profile
}

const initialState: State = {

}

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
        case ActionsTypes.loadProfile:
            return {
                ...state,
                profile: action.profile
            }
        default:
            return state;
    }
}
