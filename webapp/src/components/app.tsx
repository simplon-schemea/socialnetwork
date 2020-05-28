import React, { useEffect } from "react";
import { Login } from "./login";
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import { Register } from "./register";
import { Provider } from "react-redux";
import { store } from "../store";
import { InfoBanner } from "./info-banner";
import { ProfileService } from "../services/profile.service";
import { actions } from "../store/actions";
import { Profile } from "./profile";

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

export function App() {
    return (
        <Provider store={ store }>
            <InfoBanner/>
            <main>
                <BrowserRouter>
                    <Route path="/" exact={ true }>
                        <RootRedirect/>
                    </Route>
                    <Route path="/login" exact={ true }>
                        <Login/>
                    </Route>
                    <Route path="/register" exact={ true }>
                        <Register/>
                    </Route>
                    <Route path="/profile" exact={ true }>
                        <Profile id="self"/>
                    </Route>
                </BrowserRouter>
            </main>
        </Provider>
    );
}
