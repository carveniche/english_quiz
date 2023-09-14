import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import {
  ActiveTabParams,
  addToActiveTab,
  deleteFromActiveTab,
} from "../../redux/features/addActiveTabLink";
import { RootState } from "../../redux/store";
import { getQueryParams } from "../../utils/getQueryParams";
import CloseIconButton from "./CloseIconButton";
import TabIcon from "./TabIcon";
import { isTutor, isTutorTechBoth } from "../../utils/participantIdentity";

export default function ActiveTabMenu() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { room } = useVideoContext();
  const { activeTabArray, currentSelectedRouter } = useSelector(
    (state: RootState) => state.activeTabReducer
  );

  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const handleClick = ({
    path,
    key,
    name,
    icon,
    extraParams,
  }: ActiveTabParams) => {
    if (!isTutorTechBoth({ identity: String(role_name) })) {
      return;
    }

    dispatch(addToActiveTab({ path, key, name, icon, extraParams }));
    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];

    console.log("path sending", path);

    let DataTrackObj = {
      pathName: path,
      key,
      name,
      icon,
      extraParams,
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
    if (!isTutorTechBoth({ identity: String(role_name) })) {
      return;
    }
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
                  extraParams: item.extraParams,
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
