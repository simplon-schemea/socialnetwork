import React, { useEffect, useState } from "react";
import { LoginComponent } from "./login";
import { BrowserRouter, Redirect, Route, RouteProps } from "react-router-dom";
import { RegisterComponent } from "./register";
import { Provider } from "react-redux";
import { store } from "@store";
import { InfoBannerComponent } from "./info-banner";
import { ProfileService } from "@services/profile.service";
import { actions } from "@store/actions";
import { ProfileComponent } from "./profile";

function AppRoute({ title, render, children, ...props }: { title: string } & RouteProps) {
    return (
        <Route { ...props } render={ function (...args) {
            document.title = title;

            return render ? render(...args) : children;
        } }/>
    );
}

enum LoggedState {
    UNKNOWN,
    LOGGED,
    GUEST
}

export function AppComponent() {
    const [ logged, setLogged ] = useState<LoggedState>(LoggedState.UNKNOWN);

    useEffect(function () {
        ProfileService.get(null, true)
            .then(function (profile) {
                store.dispatch(actions.loadProfile(profile));
                setLogged(LoggedState.LOGGED);
            })
            .catch(function () {
                setLogged(LoggedState.GUEST);
            });
    }, [ setLogged ]);

    return (
        <Provider store={ store }>
            <InfoBannerComponent/>
            <main>
                <BrowserRouter>
                    { logged === LoggedState.GUEST && <Redirect to="/login"/> }
                    <AppRoute title="Home" path="/" exact={ true }>
                        { logged !== LoggedState.LOGGED && <Redirect to="/profile"/> }
                    </AppRoute>
                    <AppRoute title="Login" path="/login" exact={ true }>
                        <LoginComponent/>
                    </AppRoute>
                    <AppRoute title="Register" path="/register" exact={ true }>
                        <RegisterComponent/>
                    </AppRoute>
                    <AppRoute title="Profile" path="/profile/:id?" exact={ true } render={ props => (
                        <ProfileComponent id={ props.match.params.id }/>
                    ) }/>
                </BrowserRouter>
            </main>
        </Provider>
    );
}
