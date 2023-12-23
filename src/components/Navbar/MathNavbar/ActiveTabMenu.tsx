import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import {
  ActiveTabParams,
  addToActiveTab,
  deleteFromActiveTab,
} from "../../../redux/features/addActiveTabLink";
import { RootState } from "../../../redux/store";
import { getQueryParams } from "../../../utils/getQueryParams";
import CloseIconButton from "../NavbarIcons/CloseIconButton";
import TabIcon from "../NavbarIcons/TabIcon";
import { isTutorTechBoth } from "../../../utils/participantIdentity";
import { IFRAMENEWCODING, ROUTERKEYCONST } from "../../../constants";
import CustomAlert from "../../DisplayCustomAlert/CustomAlert";

export default function ActiveTabMenu() {
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const [alertMessage, setAlertMessage] = useState("");
  const [openAlertBox, setOpenAlertBox] = useState(true);
  const { room } = useVideoContext();
  const { activeTabArray, currentSelectedRouter } = useSelector(
    (state: RootState) => state.activeTabReducer
  );

  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { speedMathAlreadyStarted, isCodingIframeOpened } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const handleClick = (
    { path, key, name, icon, extraParams }: ActiveTabParams,
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
  ) => {
    console.log("pathssssss", path, key, name, icon, extraParams);
    if (!isTutorTechBoth({ identity: String(role_name) })) {
      event.preventDefault();
      return;
    }

    if (
      currentSelectedRouter === ROUTERKEYCONST.speedmath &&
      speedMathAlreadyStarted
    ) {
      setAlertMessage(
        "Speed Math is already running you can't change the screen now"
      );
      setOpenAlertBox(true);
      return;
    }

    if (
      currentSelectedRouter === IFRAMENEWCODING.path &&
      isCodingIframeOpened
    ) {
      setAlertMessage(
        "You have to close the coding tab to navigate to other options."
      );
      setOpenAlertBox(true);
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
        type: "addFromActiveTab",
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
        <div key={`${item.key}`} className="activeTabLayout hover:bg-black">
          <TabIcon src={item.icon} />
          <div>
            <NavLink
              to={
                speedMathAlreadyStarted
                  ? `/speedmath?${getQueryParams()}`
                  : isCodingIframeOpened
                  ? `${IFRAMENEWCODING.path}?${getQueryParams()}`
                  : `${item.path}?${getQueryParams()}`
              }
              onClick={(event) =>
                handleClick(
                  {
                    path: item.path,
                    key: item.key,
                    name: item.name,
                    icon: item.icon,
                    extraParams: item.extraParams,
                  },
                  event
                )
              }
            >
              {item.name}
            </NavLink>
          </div>
          <CloseIconButton onClick={() => handleCloseButton(item.key)} />
        </div>
      ))}

      {alertMessage !== "" && (
        <CustomAlert
          variant="info"
          headline={alertMessage}
          open={openAlertBox}
          handleClose={() => setOpenAlertBox(false)}
        />
      )}
    </>
  ) : (
    <></>
  );
}
