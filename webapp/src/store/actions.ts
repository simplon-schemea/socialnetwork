import { Action } from "redux";
import { InfoBannerType } from "@models/info-banner-type";
import { Profile } from "@models/profile";

function createAction<Type extends string>(type: Type): Action<Type>;
function createAction<Type extends string, Props>(type: Type, props: Props): Action<Type> & Props;
function createAction<Type extends string>(type: Type, props = {}): Action<Type> {
    return {
        type,
        ...props,
    };
}

export enum ActionsTypes {
    setInfoBannerMessage = "[NOTIFICATION] Set message",
    clearInfoBanner      = "[NOTIFICATION] Clear",
    loadProfile          = "[API] Load profile"
}

export const actions = {
    setInfoBannerMessage(type: InfoBannerType, message: string) {
        return createAction(ActionsTypes.setInfoBannerMessage, { infoType: type, message });
    },
    clearInfoBanner() {
        return createAction(ActionsTypes.clearInfoBanner);
    },
    loadProfile(profile: Profile) {
        return createAction(ActionsTypes.loadProfile, { profile });
    },
};

type ActionIndex = typeof actions;

export type Actions = ReturnType<ActionIndex[keyof ActionIndex]>;
