import "./account-form.scss";

import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useState } from "react";
import { Button, Input, InputLabel } from "@material-ui/core";
import { User } from "../models/user";
import { AccountService } from "../services/account.service";
import { useStore } from "react-redux";
import { actions } from "../store/actions";
import { withRouter } from "react-router-dom";

function setStateField<S>(state: S, setState: Dispatch<SetStateAction<S>>, field: keyof S) {
    return useCallback((event: ChangeEvent<HTMLInputElement>) => setState({
        ...state,
        [field]: event.target.value || "",
    }), [ state, setState ]);
}

export const RegisterComponent = withRouter(function ({ history }) {
    const [ user, setUser ] = useState<User>({
        mail: "",
        password: "",
        firstname: "",
        lastname: "",
        birthday: "",
    });

    const [ state, setState ] = useState({
        passwordBis: "",
    });

    const store = useStore();


    function setUserField(field: keyof User) {
        return setStateField(user, setUser, field);
    }

    const setMail      = setUserField("mail");
    const setPassword  = setUserField("password");
    const setFirstname = setUserField("firstname");
    const setLastname  = setUserField("lastname");
    const setBirthday  = setUserField("birthday");

    const setPasswordBis = setStateField(state, setState, "passwordBis");

    let passwordBisInput: HTMLInputElement | null = null;

    function setPasswordBisInput(ref: HTMLInputElement) {
        passwordBisInput = ref?.querySelector<HTMLInputElement>("input");
    }

    const register = useCallback(function (event: FormEvent) {
        event.preventDefault();

        AccountService.register(user).then(function () {
            store.dispatch(actions.setInfoBannerMessage("success", `Account created successfully`));
            history.push("/login");
        });
    }, [ user ]);

    useEffect(function () {
        passwordBisInput?.setCustomValidity((user.password !== state.passwordBis) ? "Password must match" : "");
    }, [ user.password, state.passwordBis, passwordBisInput ]);

    return (
        <form className="account-form" onSubmit={ register }>
            <div className="grid">
                <InputLabel required={ true } variant="standard">Email
                </InputLabel>
                <Input name="mail" placeholder="Email" required={ true } type="email" value={ user.mail }
                       autoComplete="email"
                       onChange={ setMail }/>

                <InputLabel required={ true } variant="standard">Password</InputLabel>
                <Input name="password" placeholder="Password" required={ true } type="password"
                       value={ user.password } onChange={ setPassword }/>

                <InputLabel required={ true } variant="standard">Password Confirmation</InputLabel>
                <Input placeholder="Password Confirmation" required={ true } type="password" ref={ setPasswordBisInput }
                       value={ state.passwordBis } onChange={ setPasswordBis }/>

                <InputLabel required={ true } variant="standard">Firstname</InputLabel>
                <Input name="firstname" placeholder="Firstname" required={ true }
                       value={ user.firstname } onChange={ setFirstname }/>

                <InputLabel required={ true } variant="standard">Lastname</InputLabel>
                <Input name="lastname" placeholder="Lastname" required={ true }
                       value={ user.lastname } onChange={ setLastname }/>

                <InputLabel variant="standard">Birthday</InputLabel>
                <Input name="birthday" placeholder="Birthday" required={ false }
                       value={ user.birthday } onChange={ setBirthday }/>
            </div>
            <div className="footer">
                <Button variant="outlined" type="submit">register</Button>
            </div>
        </form>
    );
});
