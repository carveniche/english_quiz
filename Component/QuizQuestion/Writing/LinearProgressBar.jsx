import { CircularProgress, Typography } from "@mui/material";
import React from "react";

export default function LinearProgressBar() {
  return (
    <>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <CircularProgress />
        <Typography variant="body2" color="textSecondary">
          Using AI to evaluate your response. Please wait for the response
        </Typography>
      </div>
    </>
  );
}
