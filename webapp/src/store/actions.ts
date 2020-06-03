import { Action } from "redux";
import { InfoBannerType } from "@models/info-banner-type";
import { ProfileResource } from "@models/resources/profile-resource";
import { UUID } from "@models/types";
import { MessageData } from "@models/message-data";

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
    loadProfile          = "[API] Load profile",
    updateMessageList    = "[API] Update message list"
}

export const actions = {
    setInfoBannerMessage(type: InfoBannerType, message: string) {
        return createAction(ActionsTypes.setInfoBannerMessage, { infoType: type, message });
    },
    clearInfoBanner() {
        return createAction(ActionsTypes.clearInfoBanner);
    },
    loadProfile(profile: ProfileResource) {
        return createAction(ActionsTypes.loadProfile, { profile });
    },
    updateMessageList(topic: UUID, messages: MessageData[]) {
        return createAction(ActionsTypes.updateMessageList, { topic, messages });
    },
};

type ActionIndex = typeof actions;

export type Actions = ReturnType<ActionIndex[keyof ActionIndex]>;
