import { useEffect, useRef, useState } from "react";
import CallTechSupportActiveLogo from "../Navbar/NavbarIcons/CallTechSupportActiveLogo";
import CallTechSupportInActiveLogo from "../Navbar/NavbarIcons/CallTechSupportInActiveLogo";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { callTechSupport, techNotPresentApi } from "../../api";
import CustomAlert from "../DisplayCustomAlert/CustomAlert";

export default function CallTechSupport() {
  const [backgroundColor, setBackgroundColor] = useState("bg-header-black");
  const [activeLogo, setActiveLogo] = useState(false);
  const [connectingFlag, setConnectingFlag] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [openAlertBox, setOpenAlertBox] = useState(true);
  const [isApiCallInProgress, setApiCallInProgress] = useState(false);

  const { techJoinedClass, userId, liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const timeoutIdRef = useRef<NodeJS.Timeout | undefined>();
  const techSupportBtnClicked = useRef(false);

  const sendNotificationToTech = () => {
    timeoutIdRef.current = setTimeout(() => {
      if (!techJoinedClass) {
        techNotPresentApi(liveClassId); //Tech Not joined to calling the api
      }
    }, 300000);
  };

  useEffect(() => {
    if (techJoinedClass) {
      setConnectingFlag(false);
      clearTimeout(timeoutIdRef.current);
    } else {
      setActiveLogo(false);
    }
  }, [techJoinedClass]);

  const requestTechSupport = async () => {
    try {
      if (isApiCallInProgress) {
        return;
      }
      setApiCallInProgress(true);
      await callTechSupport(userId, liveClassId).then((response) => {
        if (response.data.status) {
          sendNotificationToTech();
        } else {
          techSupportBtnClicked.current = true;
          setAlertMessage(
            "You have already placed the request for the Support team. Please wait for them to join"
          );
          setOpenAlertBox(true);
          setActiveLogo(true);
          setConnectingFlag(true);
        }
      });
    } catch (error) {
      console.error("API request error:", error);
    } finally {
      setApiCallInProgress(false);

      if (!techSupportBtnClicked.current) {
        if (activeLogo) {
          setBackgroundColor("bg-header-black");
        } else {
          setBackgroundColor("bg-black");
        }
        setActiveLogo(true);
        setConnectingFlag(true);
      }
    }
  };

  return (
    <>
      <div className="relative ">
        <button disabled={techJoinedClass} onClick={() => requestTechSupport()}>
          <div
            className={`flex flex-row min-w-[100px] rounded-full gap-2 ${backgroundColor} hover:bg-black px-2 py-1`}
          >
            {activeLogo ? (
              <CallTechSupportActiveLogo />
            ) : (
              <CallTechSupportInActiveLogo />
            )}

            <span className="text-F2F2F2">
              {techJoinedClass ? "Support" : "Call support"}
            </span>
          </div>
        </button>
      </div>

      {techJoinedClass && (
        <div className="flex absolute top-12 min-w-[115px] min-h-[20px] rounded px-2 py-1  bg-callTechSupportLineConnect justify-center ">
          <span className="text-white">Connected</span>
        </div>
      )}

      {connectingFlag && (
        <div className="flex absolute top-12 min-w-[115px] min-h-[20px] rounded px-2 py-1  bg-header-black justify-center right-20 ">
          <span className="text-white">Connecting...</span>
        </div>
      )}

      {alertMessage !== "" && (
        <CustomAlert
          variant="info"
          headline={alertMessage}
          open={openAlertBox}
          handleClose={() => setOpenAlertBox(false)}
        />
      )}
    </>
  );
}
