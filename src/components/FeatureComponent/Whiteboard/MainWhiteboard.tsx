import { useSelector } from "react-redux";
import { MAINWHITEBOARD } from "../../../constants";
import HelperWhiteBoard from "../../WhiteBoardHelper/HelperWhiteBoard";
import { RootState } from "../../../redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { openCloseUploadResourceModalTeacher } from "../../../redux/features/liveClassDetails";
import { isTutorTechBoth } from "../../../utils/participantIdentity";
import UploadResourceWhiteBoard from "./UploadResourceWhiteBoard";
export default function MainWhiteboard() {
  const dispatch = useDispatch();

  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  // const { currentSelectedRouter, currentSelectedKey } = useSelector(
  //   (state: RootState) => state.activeTabReducer
  // );

  const { isUploadResourceOpen } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );

  useEffect(() => {
    return () => {
      dispatch(openCloseUploadResourceModalTeacher(false));
    };
  }, []);

  return (
    <>
      {isUploadResourceOpen ? (
        <>
          <UploadResourceWhiteBoard />
        </>
      ) : (
        <HelperWhiteBoard
          dataTrackKey={MAINWHITEBOARD.mainWhiteBoardData}
          // pathName={currentSelectedRouter}
          // key={currentSelectedKey}
          isCico={false}
          isWritingDisabled={false}
          images={[]}
          removeClearAllBtn={
            isTutorTechBoth({ identity: role_name.toString() }) ? false : true
          }
          from=""
        />
      )}
    </>
  );
}
