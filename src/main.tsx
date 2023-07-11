import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme.ts";
import { VideoProvider } from "./components/VideoProvider";
import { VideoApp } from "./App.tsx";

import { SnackbarProvider } from "notistack";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={8}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          autoHideDuration={10000}
          variant="info"
        >
          <VideoApp />
        </SnackbarProvider>
      </MuiThemeProvider>
    </Provider>
  </React.StrictMode>
);
