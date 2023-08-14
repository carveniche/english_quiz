import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import {
  addToActiveTab,
  deleteFromActiveTab,
} from "../../redux/features/addActiveTabLink";
import { RootState } from "../../redux/store";
import { getQueryParams } from "../../utils/getQueryParams";
import CloseIconButton from "./CloseIconButton";
import TabIcon from "./TabIcon";

export default function ActiveTabMenu() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { room } = useVideoContext();
  const { activeTabArray, currentSelectedRouter } = useSelector(
    (state: RootState) => state.activeTabReducer
  );
  const handleClick = ({ path, key, name, icon }: ActiveTabParams) => {
    dispatch(addToActiveTab({ path, key, name, icon }));
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    console.log("path sending", path);

    let DataTrackObj = {
      pathName: path,
      key,
      name,
      icon,
      value: {
        type: null,
        identity: null,
      },
    };

    console.log("Data message send");
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));

    //send datatrack
  };
  const handleCloseButton = (key: String | undefined) => {
    dispatch(deleteFromActiveTab(`${key}`));
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    let DataTrackObj = {
      pathName: key,
      value: {
        type: "deleteFromActiveTab",
        identity: null,
      },
    };

    console.log("Data message send");
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };
  useEffect(() => {
    navigation(`${currentSelectedRouter}?${getQueryParams()}`);
  }, [currentSelectedRouter]);
  return activeTabArray.length ? (
    <>
      {activeTabArray.map((item) => (
        <div key={`${item.key}`} className="activeTabLayout">
          <TabIcon src={item.icon} />
          <div>
            <NavLink
              to={`${item.path}?${getQueryParams()}`}
              onClick={() =>
                handleClick({
                  path: item.path,
                  key: item.key,
                  name: item.name,
                  icon: item.icon,
                })
              }
            >
              {item.name}
            </NavLink>
          </div>
          <CloseIconButton onClick={() => handleCloseButton(item.key)} />
        </div>
      ))}
    </>
  ) : (
    <></>
  );
}