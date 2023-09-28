import { useEffect, useRef, useState } from "react";
import CallTechSupportActiveLogo from "../Navbar/NavbarIcons/CallTechSupportActiveLogo";
import CallTechSupportInActiveLogo from "../Navbar/NavbarIcons/CallTechSupportInActiveLogo";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { callTechSupport, techNotPresentApi } from "../../api";

export default function CallTechSupport() {
  const [backgroundColor, setBackgroundColor] = useState("bg-header-black");
  const [activeLogo, setActiveLogo] = useState(false);
  const [connectingFlag, setConnectingFlag] = useState(false);
  const [connectedFlag, setConnectedFlag] = useState(false);

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
      setConnectedFlag(true);
      setConnectingFlag(false);
      clearTimeout(timeoutIdRef.current);
      setTimeout(() => {
        setConnectedFlag(false);
        setConnectingFlag(false);
        setActiveLogo(false);
      }, 2000);
    }
  }, [techJoinedClass]);

  const requestTechSupport = async () => {
    if (techJoinedClass) {
      alert("Tech Support has already joined the session");
      return;
    }

    try {
      await callTechSupport(userId, liveClassId).then((response) => {
        if (response.data.status) {
          sendNotificationToTech();
        } else {
          techSupportBtnClicked.current = true;
          alert(
            "You have already request Tech Support Please wait for TechSupport to Join"
          );
        }
      });
    } catch (error) {
      console.error("API request error:", error);
    }

    if (!techSupportBtnClicked.current) {
      if (activeLogo) {
        setBackgroundColor("bg-header-black");
      } else {
        setBackgroundColor("bg-black");
      }
      setActiveLogo(true);
      setConnectingFlag(true);
    }
  };

  return (
    <>
      <div className="relative">
        <button onClick={() => requestTechSupport()}>
          <div
            className={`flex flex-row min-w-[100px] rounded-full gap-2 ${backgroundColor} px-2 py-1`}
          >
            {activeLogo ? (
              <CallTechSupportActiveLogo />
            ) : (
              <CallTechSupportInActiveLogo />
            )}

            <span className="text-F2F2F2">Call support</span>
          </div>
        </button>
      </div>

      {connectedFlag && (
        <div className="flex absolute top-12 min-w-[115px] min-h-[20px] rounded px-2 py-1  bg-callTechSupportLineConnect justify-center ">
          <span className="text-white">Connected</span>
        </div>
      )}

      {connectingFlag && (
        <div className="flex absolute top-12 min-w-[115px] min-h-[20px] rounded px-2 py-1  bg-header-black justify-center ">
          <span className="text-white">Connecting...</span>
        </div>
      )}
    </>
  );
}
