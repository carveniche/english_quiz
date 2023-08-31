import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { ViewStatusContext } from "../mathzone";

export default function OnlineQuizPagination() {
  const handleChange = (event, value) => {
    handlePaginationRevieResult(value - 1);
  };
  const [page, setPage] = React.useState(1);
  const {
    currentQuestionReview,
    totalReviewResult,
    handlePaginationRevieResult,
  } = React.useContext(ViewStatusContext);
  return (
    <Stack spacing={2}>
      <Pagination
        count={totalReviewResult}
        size="medium"
        boundaryCount={2}
        onChange={handleChange}
        page={currentQuestionReview + 1}
      />
    </Stack>
  );
}
