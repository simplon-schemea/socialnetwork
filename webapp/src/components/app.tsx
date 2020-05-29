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

export function AppComponent() {
    const [ sessionChecked, setSessionChecked ] = useState(false);

    useEffect(function () {
        ProfileService.get(null, true).then(function (profile) {
            store.dispatch(actions.loadProfile(profile));
        }).finally(function () {
            setSessionChecked(true);
        });
    }, [ setSessionChecked ]);

    return (
        <Provider store={ store }>
            <InfoBannerComponent/>
            <main>
                <BrowserRouter>
                    <AppRoute title="Home" path="/" exact={ true }>
                        { sessionChecked && <Redirect to={ store.getState().profile?.id ? "/profile" : "/login" }/> }
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
