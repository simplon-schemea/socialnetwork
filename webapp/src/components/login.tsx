import "./account-form.scss";

import React, { ChangeEvent, FormEvent, useCallback, useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { UserCredentials } from "@models/user";
import { AccountService } from "@services/account.service";
import { withRouter } from "react-router-dom";
import { store } from "@store";
import { actions } from "@store/actions";
import { ProfileService } from "@services/profile.service";
import { PersistentStorage } from "../storage/persistent-storage";
import { HttpContext } from "../http";
import { ProfileResource } from "@models/resources/profile-resource";

export const LoginComponent = withRouter(function Login({ history }) {
    const [ user, setUser ] = useState<UserCredentials>({
        mail: "",
        password: "",
    });

    const setUserField = function (field: keyof UserCredentials) {
        return useCallback((event: ChangeEvent<HTMLInputElement>) => setUser({
            ...user,
            [field]: event.target.value || "",
        }), [ user, setUser ]);
    };

    const http           = useContext(HttpContext);
    const profileService = new ProfileService(http);
    const accountService = new AccountService(http);

    const setMail     = setUserField("mail");
    const setPassword = setUserField("password");

    const login = useCallback(function (event: FormEvent) {
        event.preventDefault();


        accountService.login(user).then(function (response) {
            store.dispatch(actions.setInfoBannerMessage("success", "Successfully logged in"));

            const payload = JSON.parse(atob(response.accessToken.split(".")[1]));

            if (!payload.sub) {
                throw new Error("invalid token");
            }

            PersistentStorage.set("token", response.accessToken);

            return profileService.get(payload.sub);
        }).then(function (profile: ProfileResource) {
            store.dispatch(actions.loadProfile(profile));
            history.push("/profile");
        });
    }, [ user ]);

    const register = useCallback(function () {
        history.push("/register");
    }, [ history ]);

    return (
        <form className="account-form" onSubmit={ login }>
            <div className="grid">
                <InputLabel variant="standard">Email
                </InputLabel>
                <Input name="mail" placeholder="Email" required={ true } type="email" value={ user.mail }
                       autoComplete="email"
                       onChange={ setMail }/>
                <InputLabel variant="standard">Password</InputLabel>
                <Input name="password" placeholder="Password" required={ true } type="password"
                       value={ user.password } onChange={ setPassword }/>
            </div>
            <div className="footer">
                <Button variant="outlined" onClick={ register }>register</Button>
                <Button variant="outlined" type="submit">login</Button>
            </div>
        </form>
    );
});
