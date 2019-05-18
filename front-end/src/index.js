import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Cms from "./pages/Cms";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<Cms />, document.getElementById("root"));

serviceWorker.unregister();
