import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { FlagQuestionContext } from "../ContextProvider/FlagQuestionContextProvider";
import useThrottle from "../CustomHooks/UseThrottle";
import {
  openClosedMathzoneWhiteBoard,
  resetWhiteBoardData,
} from "../../../../redux/features/ComponentLevelDataReducer";
import { MATHZONEDATAKEY, MISCELLANEOUS } from "../../../../constants";
import useVideoContext from "../../../../hooks/useVideoContext/useVideoContext";

export default function FlagQuestionPagination({
  handleFlagQuestionChange,
  currentSelectedRouter,
  currentSelectedKey,
  handleCallBackToCloseWhiteboard,
}) {
  const [inprogressThrottle, handleThrottle] = useThrottle(1000);
  const [page, setPage] = React.useState(1);
  const {
    currentQuestionReview,
    totalReviewResult,
    handlePaginationRevieResult,
  } = React.useContext(FlagQuestionContext);

  const handleChange = (event, value) => {
    if (inprogressThrottle()) return;
    handlePaginationRevieResult(value - 1);
    typeof handleFlagQuestionChange == "function" &&
      handleFlagQuestionChange(value - 1, false);
    handleThrottle();
    handleCallBackToCloseWhiteboard();
  };

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
