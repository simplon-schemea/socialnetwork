import { Actions, ActionsTypes } from "./actions";
import { InfoBannerType } from "@models/info-banner-type";
import { ProfileResource } from "@models/resources/profile-resource";
import { MessageData } from "@models/message-data";

export interface State {
    infoBanner?: {
        type: InfoBannerType,
        message: string
    };
    profile?: ProfileResource
    messages: {
        [k: string]: MessageData[]
    }
}

const initialState: State = {
    messages: {},
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
            };
        case ActionsTypes.loadProfile:
            return {
                ...state,
                profile: action.profile,
            };
        case ActionsTypes.updateMessageList:
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [action.topic]: action.messages,
                },
            };
        default:
            return state;
    }
}
