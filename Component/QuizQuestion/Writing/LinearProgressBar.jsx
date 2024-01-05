import { CircularProgress, Typography } from "@mui/material";
import React from "react";

export default function LinearProgressBar() {
  return (
    <>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <CircularProgress />
        <Typography variant="body2" color="textSecondary">
          Please Wait for Response
        </Typography>
      </div>
    </>
  );
}
