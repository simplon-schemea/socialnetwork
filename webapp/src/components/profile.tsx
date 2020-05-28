import React, { useEffect, useState } from "react";
import { Profile } from "../models/profile";
import { ProfileService } from "../services/profile.service";

interface Props {
    id: string | "self";
}

export function Profile(props: Props) {
    const [ profile, setProfile ] = useState<Profile>();

    useEffect(function () {
        ProfileService.get(props.id).then(function (profile) {
            setProfile(profile);
        });
    }, [ props.id ]);

    if (!profile) {
        return null;
    }

    const ageMS = Date.now() - Date.parse(profile.birthday);

    const age = Math.floor(ageMS / (365 * 24 * 3600 * 1000));

    return (
        <div>
            { profile.firstname } { profile.lastname } born in { profile.birthday }, is now { age } years old
        </div>
    );
}
