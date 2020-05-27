import "./account-form.scss";

import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { Button, Input, InputLabel } from "@material-ui/core";
import { UserCredentials } from "../models/user";
import { AccountService } from "../services/account.service";
import { withRouter } from "react-router-dom";

export const Login = withRouter(function ({ history }) {
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

    const setMail     = setUserField("mail");
    const setPassword = setUserField("password");

    const onLogin = useCallback(function (event: FormEvent) {
        event.preventDefault();

        AccountService.login(user).then(function () {
            history.push("/profile");
        });
    }, [ user ]);

    const onRegister = useCallback(function () {
        history.push("/register");
    }, [ history ]);

    return (
        <form className="account-form" onSubmit={ onLogin }>
            <div className="grid">
                <InputLabel variant="standard">Email:
                </InputLabel>
                <Input name="mail" placeholder="Email" required={ true } type="email" value={ user.mail }
                       autoComplete="email"
                       onChange={ setMail }/>
                <InputLabel variant="standard">Password:</InputLabel>
                <Input name="password" placeholder="Password" required={ true } type="password"
                       value={ user.password } onChange={ setPassword }/>
            </div>
            <div className="footer">
                <Button variant="outlined" onClick={ onRegister }>register</Button>
                <Button variant="outlined" type="submit">login</Button>
            </div>
        </form>
    );
});
