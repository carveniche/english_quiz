import { Alert } from "@mui/material";
import React from "react";
import styled from "styled-components";
export default function CustomAlertBoxMathZone({ msg }) {
  return (
    <AlertBox>
      <Alert severity="error" style={{ width: "100%", textAlign: "center" }}>
        {msg ? msg : "Please choose the answer..."}
      </Alert>
    </AlertBox>
  );
}

const AlertBox = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box; /* ensures padding/border don't overflow */
  margin-bottom: 0.7rem;

  svg {
    display: none !important;
  }

  > div {
    width: 100%;
    max-width: 100%;
    color: rgb(95, 33, 32);
    font-weight: normal !important;
    box-sizing: border-box;
  }

  div {
    max-width: 100%;
    font-weight: 100 !important;
    box-sizing: border-box;
  }
`;
