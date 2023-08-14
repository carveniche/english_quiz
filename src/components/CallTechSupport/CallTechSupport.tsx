import { useEffect, useState } from "react";
import CallTechSupportActiveLogo from "../Navbar/NavbarIcons/CallTechSupportActiveLogo";
import CallTechSupportInActiveLogo from "../Navbar/NavbarIcons/CallTechSupportInActiveLogo";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { callTechSupport } from "../../api";

export default function CallTechSupport() {
  const [backgroundColor, setBackgroundColor] = useState("bg-header-black");
  const [activeLogo, setActiveLogo] = useState(false);
  const [connectingFlag, setConnectingFlag] = useState(false);
  const [connectedFlag, setConnectedFlag] = useState(false);

  const { techJoinedClass, userId, liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  useEffect(() => {
    if (techJoinedClass) {
      setConnectedFlag(true);
      setConnectingFlag(false);
      setTimeout(() => {
        setConnectedFlag(false);
        setConnectingFlag(false);
        setActiveLogo(!activeLogo);
      }, 2000);
    }
  }, [techJoinedClass]);

  const requestTechSupport = async () => {
    if (techJoinedClass) {
      console.log("Tech is already in the class");
      return;
    }

    if (activeLogo) {
      setBackgroundColor("bg-header-black");
    } else {
      setBackgroundColor("bg-black");
    }
    setActiveLogo(!activeLogo);
    setConnectingFlag(true);

    try {
      await callTechSupport(userId, liveClassId).then((response) => {
        console.log("Response", response);
      });
    } catch (error) {
      console.error("API request error:", error);
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
