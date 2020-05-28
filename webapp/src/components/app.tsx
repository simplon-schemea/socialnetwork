import React, { useEffect } from "react";
import { LoginComponent } from "./login";
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import { RegisterComponent } from "./register";
import { Provider } from "react-redux";
import { store } from "../store";
import { InfoBannerComponent } from "./info-banner";
import { ProfileService } from "../services/profile.service";
import { actions } from "../store/actions";
import { ProfileComponent } from "./profile";

const RootRedirect = withRouter(function ({ history }) {
    useEffect(function () {
        ProfileService.get().then(function (profile) {
            store.dispatch(actions.loadProfile(profile));
            history.push("/profile");
        }).catch(function () {
            history.push("/login");
        });
    }, []);

    return <></>;
});

export function AppComponent() {
    return (
        <Provider store={ store }>
            <InfoBannerComponent/>
            <main>
                <BrowserRouter>
                    <Route path="/" exact={ true }>
                        <RootRedirect/>
                    </Route>
                    <Route path="/login" exact={ true }>
                        <LoginComponent/>
                    </Route>
                    <Route path="/register" exact={ true }>
                        <RegisterComponent/>
                    </Route>
                    <Route path="/profile" exact={ true }>
                        <ProfileComponent id="self"/>
                    </Route>
                </BrowserRouter>
            </main>
        </Provider>
    );
}
