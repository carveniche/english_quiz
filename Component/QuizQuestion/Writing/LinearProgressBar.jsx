import { CircularProgress, Typography } from "@mui/material";
import React from "react";

export default function LinearProgressBar({ type }) {
  // console.log("this is type", type);

  return (
    <>
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          backgroundColor: `${type === "speaking" ? "#ffe997" : ""}`,
          borderRadius: `${type === "speaking" ? "10px" : ""}`,
          width: `${type === "speaking" ? "100%" : ""}`,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="textSecondary">
          Using AI to evaluate your response. Please wait for the response
        </Typography>
      </div>
    </>
  );
}
