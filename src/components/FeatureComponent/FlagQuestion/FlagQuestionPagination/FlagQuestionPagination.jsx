import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { FlagQuestionContext } from "../ContextProvider/FlagQuestionContextProvider";
import useThrottle from "../CustomHooks/UseThrottle";
import { useDispatch } from "react-redux";
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
}) {
  const dispatch = useDispatch();
  const { room } = useVideoContext();
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
    handleWhiteboardState();
  };

  const handleWhiteboardState = () => {
    // dispatch(
    //   resetWhiteBoardData({
    //     dataTrackKey: MISCELLANEOUS.miscellaneousDataWhiteBoard,
    //   })
    // );
    dispatch(openClosedMathzoneWhiteBoard(false));

    handleDataTrack();
  };

  const handleDataTrack = () => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    let DataTrackObj = {
      pathName: currentSelectedRouter,
      key: currentSelectedKey,
      value: {
        type: MATHZONEDATAKEY.openClosedWhiteBoard,
        identity: null,
        isMathZoneWhiteBoard: false,
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
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
