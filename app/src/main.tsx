import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { loadData } from "./sitedata";
import "./styles/global.css";

loadData()
  .then((data) => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <HashRouter>
          <App data={data} />
        </HashRouter>
      </React.StrictMode>
    );
  })
  .catch((err: Error) => {
    const el = document.getElementById("root");
    if (el) {
      el.innerHTML =
        '<p style="padding:2rem;font-family:sans-serif;color:#efe9dc">' + err.message + "</p>";
    }
  });
