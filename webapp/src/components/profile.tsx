import React, { useCallback, useEffect, useState } from "react";
import { ProfileService } from "@services/profile.service";
import Button from "@material-ui/core/Button";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AccountService } from "@services/account.service";
import { store } from "@store";
import { actions } from "@store/actions";
import { useSelector } from "react-redux";
import { State } from "@store/reducer";
import { MessageFormComponent } from "./message-form";
import { MessageListComponent } from "./message-list";
import { MessageType } from "@models/message-type";
import { ProfileResource } from "@models/resources/profile-resource";
import { PersistentStorage } from "../storage/persistent-storage";

interface Props {
    id?: string;
}

function yearLess(date: Date) {
    date.setFullYear(0);
    return date.getTime();
}

function calculateAge(birthday: Date) {
    const now = new Date();
    const age = now.getFullYear() - birthday.getFullYear();

    return age - (yearLess(now) < yearLess(birthday) ? 1 : 0);
}

export const ProfileComponent = withRouter(function Profile({ history, ...props }: RouteComponentProps<any> & Props) {
    const [ profile, setProfile ] = useState<ProfileResource>();

    const storeProfile = useSelector((state: State) => state.profile);

    useEffect(function () {
        if (props.id) {
            ProfileService.get(props.id).then(function (profile) {
                setProfile(profile);
            });
        } else {
            if (PersistentStorage.get("token")) {
                setProfile(storeProfile);
            } else {
                history.push("/login");
            }
        }
    }, [ props.id || storeProfile ]);

    const logout = useCallback(function () {
        AccountService.logout();

        store.dispatch(actions.setInfoBannerMessage("success", "Successfully logout"));
        history.push("/login");
    }, []);

    if (!profile) {
        return null;
    }

    return (
        <div>
            { profile.firstname } { profile.lastname }
            { profile.birthday && ` born in ${ profile.birthday }, is now ${ calculateAge(new Date(profile.birthday)) } years old` }
            <br/>
            <Button variant="outlined" onClick={ logout }>
                logout
            </Button>
            <MessageListComponent type={ MessageType.PROFILE } topic={ profile.id }/>
            <MessageFormComponent type={ MessageType.PROFILE } topic={ profile.id }/>
        </div>
    );
});
