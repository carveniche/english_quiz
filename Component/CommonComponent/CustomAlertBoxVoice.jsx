import { Alert } from "@mui/material";
import React from "react";
import styled from "styled-components";

export default function CustomAlertBoxVoice({ msg }) {
  return (
    <AlertBox>
      <Alert severity="error" style={{textAlign: "center" }}>
        {msg || "Please record the answer..."}
      </Alert>
    </AlertBox>
  );
}

const AlertBox = styled.div`
  margin-bottom: 0.7rem;
  width: 100%;

  svg {
    display: none !important; /* hides the icon */
  }

  > div {
    color: rgb(95, 33, 32);
    font-weight: normal !important;
  }

  div {
    font-weight: 100 !important;
  }
`;
