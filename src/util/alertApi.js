import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { confirmAlert } from "react-confirm-alert"; // Import
import React from "react";
import { CDataTable } from "@coreui/react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export const alert = (title, message, buttons = [{ label: "Confirmar" }]) => {
  confirmAlert({
    title: "Title",
    message: "Message",
    buttons: [
      {
        label: "Yes",
        onClick: () => alert("Click Yes"),
      },
      {
        label: "No",
        onClick: () => alert("Click No"),
      },
    ],
  });
};
