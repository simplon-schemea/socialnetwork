import React, { useCallback, useEffect, useState } from "react";
import { ProfileService } from "../services/profile.service";
import { Button } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Profile } from "../models/profile";
import { AccountService } from "../services/account.service";
import { store } from "../store";
import { actions } from "../store/actions";

interface Props {
    id: string | "self";
}

export const ProfileComponent = withRouter(function ({ history, ...props }: RouteComponentProps<any> & Props) {
    const [ profile, setProfile ] = useState<Profile>();

    useEffect(function () {
        ProfileService.get(props.id).then(function (profile) {
            setProfile(profile);
        });
    }, [ props.id ]);

    const logout = useCallback(function () {
        AccountService.logout().then(function () {
            store.dispatch(actions.setInfoBannerMessage("success", "Successfully logout"));
            history.push("/login");
        });
    }, []);

    if (!profile) {
        return null;
    }

    let age: number | undefined;

    if (profile.birthday) {
        const ageMS = Date.now() - Date.parse(profile.birthday);
        age = Math.floor(ageMS / (365 * 24 * 3600 * 1000));
    }


    return (
        <div>
            { profile.firstname } { profile.lastname }{ age && ` born in { profile.birthday }, is now ${ age } years old`}
            <br/>
            <Button variant="outlined" onClick={ logout }>
                logout
            </Button>
        </div>
    );
});
