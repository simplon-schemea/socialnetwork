import "./styles.scss";
import ReactDOM from "react-dom";
import React from "react";
import { App } from "./components/app";

const root = document.body.appendChild(document.createElement("div"));

ReactDOM.render(React.createElement(App), root);
