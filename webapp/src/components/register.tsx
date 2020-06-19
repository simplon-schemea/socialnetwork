import "./account-form.scss";

import React, {
    ChangeEvent,
    Dispatch,
    FormEvent,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import Button from "@material-ui/core/Button";
import Input, { InputProps } from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { User } from "@models/user";
import { AccountService } from "@services/account.service";
import { useStore } from "react-redux";
import { actions } from "@store/actions";
import { withRouter } from "react-router-dom";
import { HttpContext } from "../http";

function setStateField<S>(state: S, setState: Dispatch<SetStateAction<S>>, field: keyof S) {
    return useCallback((event: ChangeEvent<HTMLInputElement>) => setState({
        ...state,
        [field]: event.target.value || "",
    }), [ state, setState ]);
}

const AuthInput = React.forwardRef(function AuthInputImpl({ label, ...props }: InputProps & { label: string }, ref) {
    const valueRef = useRef<string>();

    const onBlur = useCallback(function (event: React.FocusEvent<HTMLInputElement>) {
        const { target, target: { value } } = event;

        if (valueRef.current !== value) {
            target.reportValidity();
            valueRef.current = value;
        }
    }, []);

    function log(e: any) {
        e.persist();
        console.log(e);
    }


    return (
        <React.Fragment>
            <InputLabel required={ props.required } variant="standard">{ label }
            </InputLabel>
            <Input placeholder={ label } required={ true } onBlur={ onBlur } ref={ ref } onInvalid={ log }
                   onFocus={ log }
                   autoComplete={ props.type === "password" ? undefined : name } { ...props }/>
        </React.Fragment>
    );
});

export const RegisterComponent = withRouter(function Register({ history }) {
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

    const store          = useStore();
    const accountService = new AccountService(useContext(HttpContext));


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

        accountService.register(user).then(function () {
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
                <AuthInput name="mail" label="Email" required={ true } type="email" value={ user.mail }
                           onChange={ setMail }/>

                <AuthInput name="password" label="Password" required={ true } type="password"
                           value={ user.password } onChange={ setPassword }/>

                <AuthInput label="Password Confirmation" required={ true } type="password" ref={ setPasswordBisInput }
                           value={ state.passwordBis } onChange={ setPasswordBis }/>

                <AuthInput name="firstname" label="Firstname" required={ true }
                           value={ user.firstname } onChange={ setFirstname }/>

                <AuthInput name="lastname" label="Lastname" required={ true }
                           value={ user.lastname } onChange={ setLastname }/>

                <AuthInput name="birthday" label="Birthday" required={ false }
                           value={ user.birthday } onChange={ setBirthday }/>
            </div>
            <div className="footer">
                <Button variant="outlined" type="submit">register</Button>
            </div>
        </form>
    );
});
