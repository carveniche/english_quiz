import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { FlagQuestionContext } from "../ContextProvider/FlagQuestionContextProvider";
import useThrottle from "../CustomHooks/UseThrottle";

export default function FlagQuestionPagination({ handleFlagQuestionChange }) {
  const [inprogressThrottle, handleThrottle] = useThrottle(1000);
  const handleChange = (event, value) => {
    if (inprogressThrottle()) return;
    handlePaginationRevieResult(value - 1);
    typeof handleFlagQuestionChange == "function" &&
      handleFlagQuestionChange(value - 1, false);
    handleThrottle();
  };
  const [page, setPage] = React.useState(1);
  const {
    currentQuestionReview,
    totalReviewResult,
    handlePaginationRevieResult,
  } = React.useContext(FlagQuestionContext);
  return (
    <Stack spacing={2}>
      <Pagination
        count={totalReviewResult || 1}
        size="medium"
        boundaryCount={2}
        onChange={handleChange}
        page={currentQuestionReview + 1}
      />
    </Stack>
  );
}
