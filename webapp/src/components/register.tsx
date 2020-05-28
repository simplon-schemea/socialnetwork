import "./account-form.scss";

import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { Button, Input, InputLabel } from "@material-ui/core";
import { User } from "../models/user";
import { AccountService } from "../services/account.service";
import { useStore } from "react-redux";
import { actions } from "../store/actions";
import { withRouter } from "react-router-dom";

export const Register = withRouter(function ({ history }) {
    const [ user, setUser ] = useState<User>({
        mail: "",
        password: "",
        firstname: "",
        lastname: "",
        birthday: "",
    });

    const store = useStore();

    const setUserField = function (field: keyof User) {
        return useCallback((event: ChangeEvent<HTMLInputElement>) => setUser({
            ...user,
            [field]: event.target.value || "",
        }), [ user, setUser ]);
    };

    const setMail      = setUserField("mail");
    const setPassword  = setUserField("password");
    const setFirstname = setUserField("firstname");
    const setLastname  = setUserField("lastname");
    const setBirthday  = setUserField("birthday");

    const onRegister = useCallback(function (event: FormEvent) {
        event.preventDefault();

        AccountService.register(user).  then(function () {
            store.dispatch(actions.setInfoBannerMessage("success", `Account created successfully`));
            history.push("/login");
        });
    }, [ user ]);

    return (
        <form className="account-form" onSubmit={ onRegister }>
            <div className="grid">
                <InputLabel variant="standard">Email:
                </InputLabel>
                <Input name="mail" placeholder="Email" required={ true } type="email" value={ user.mail }
                       autoComplete="email"
                       onChange={ setMail }/>

                <InputLabel variant="standard">Password:</InputLabel>
                <Input name="password" placeholder="Password" required={ true } type="password"
                       value={ user.password } onChange={ setPassword }/>

                <InputLabel variant="standard">Firstname:</InputLabel>
                <Input name="firstname" placeholder="Firstname" required={ true }
                       value={ user.firstname } onChange={ setFirstname }/>

                <InputLabel variant="standard">Lastname:</InputLabel>
                <Input name="lastname" placeholder="Lastname" required={ true }
                       value={ user.lastname } onChange={ setLastname }/>

                <InputLabel variant="standard">Birthday:</InputLabel>
                <Input name="birthday" placeholder="Birthday" required={ false }
                       value={ user.birthday } onChange={ setBirthday }/>
            </div>
            <div className="footer">
                <Button variant="outlined" type="submit">register</Button>
            </div>
        </form>
    );
});
