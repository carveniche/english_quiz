import { useSelector } from "react-redux";
import { MAINWHITEBOARD } from "../../../constants";
import HelperWhiteBoard from "../../WhiteBoardHelper/HelperWhiteBoard";
import { RootState } from "../../../redux/store";

export default function Whiteboard() {
  const { currentSelectedRouter, currentSelectedKey } = useSelector(
    (state: RootState) => state.activeTabReducer
  );
  return (
    <>
      <HelperWhiteBoard
        dataTrackKey={MAINWHITEBOARD.mainWhiteBoardData}
        pathName={currentSelectedRouter}
        key={currentSelectedKey}
      />
    </>
  );
}
