import React, { useCallback, useEffect, useState } from "react";
import { ProfileService } from "../services/profile.service";
import { Button } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Profile } from "../models/profile";
import { AccountService } from "../services/account.service";
import { store } from "../store";
import { actions } from "../store/actions";
import { useSelector } from "react-redux";
import { State } from "../store/reducer";

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

export const ProfileComponent = withRouter(function ({ history, ...props }: RouteComponentProps<any> & Props) {
    const [ profile, setProfile ] = useState<Profile>();

    const storeProfile = useSelector((state: State) => state.profile);

    useEffect(function () {
        if (props.id) {
            ProfileService.get(props.id).then(function (profile) {
                setProfile(profile);
            });
        } else {
            setProfile(storeProfile);
        }
    }, [ props.id || storeProfile ]);

    const logout = useCallback(function () {
        AccountService.logout().then(function () {
            store.dispatch(actions.setInfoBannerMessage("success", "Successfully logout"));
            history.push("/login");
        });
    }, []);

    if (!profile) {
        return null;
    }

    return (
        <div>
            { profile.firstname } { profile.lastname }
            { profile.birthday && `born in ${ profile.birthday }, is now ${ calculateAge(new Date(profile.birthday)) } years old` }
            <br/>
            <Button variant="outlined" onClick={ logout }>
                logout
            </Button>
        </div>
    );
});
