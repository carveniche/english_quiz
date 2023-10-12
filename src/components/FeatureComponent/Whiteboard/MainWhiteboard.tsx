import { useSelector } from "react-redux";
import { MAINWHITEBOARD, UPLOADRESOURCE } from "../../../constants";
import HelperWhiteBoard from "../../WhiteBoardHelper/HelperWhiteBoard";
import { RootState } from "../../../redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { openCloseUploadResourceModalTeacher } from "../../../redux/features/liveClassDetails";

export default function MainWhiteboard() {
  const dispatch = useDispatch();
  const { currentSelectedRouter, currentSelectedKey } = useSelector(
    (state: RootState) => state.activeTabReducer
  );

  const { isUploadResourceOpen, uploadResourceImages } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );

  useEffect(() => {
    return () => {
      dispatch(openCloseUploadResourceModalTeacher(false));
    };
  }, []);

  return (
    <>
      <HelperWhiteBoard
        dataTrackKey={
          isUploadResourceOpen
            ? UPLOADRESOURCE.uploadResourceWhiteboardData
            : MAINWHITEBOARD.mainWhiteBoardData
        }
        pathName={currentSelectedRouter}
        key={currentSelectedKey}
        isCico={false}
        isWritingDisabled={false}
        images={isUploadResourceOpen ? uploadResourceImages : []}
      />
    </>
  );
}
