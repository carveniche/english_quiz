import { useState } from "react";
import CallTechSupportActiveLogo from "../Navbar/NavbarIcons/CallTechSupportActiveLogo";
import CallTechSupportInActiveLogo from "../Navbar/NavbarIcons/CallTechSupportInActiveLogo";

export default function CallTechSupport() {
  const [backgroundColor, setBackgroundColor] = useState("bg-header-black");
  const [activeLogo, setActiveLogo] = useState(false);
  const [techJoinedCall, setTechJoinedCall] = useState(true);

  const requestTechSupport = () => {
    if (activeLogo) {
      setBackgroundColor("bg-header-black");
    } else {
      setBackgroundColor("bg-black");
    }
    setActiveLogo(!activeLogo);
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

      {techJoinedCall ? (
        <div className="flex absolute top-12 min-w-[115px] min-h-[20px] rounded-tl-none rounded-tr-none rounded-bl-lg rounded-br-lg px-2 py-1  bg-header-black justify-center ">
          <span className="text-white">Connected</span>
        </div>
      ) : (
        <div className="flex absolute top-12 min-w-[115px] min-h-[20px] rounded-tl-none rounded-tr-none rounded-bl-lg rounded-br-lg px-2 py-1  bg-header-black justify-center ">
          <span className="text-white">Connecting...</span>
        </div>
      )}
    </>
  );
}
