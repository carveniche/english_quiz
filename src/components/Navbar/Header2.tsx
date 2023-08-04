import Navbar from "./Navbar";
import MenuHamburger from "./NavbarIcons/MenuHamburger";
import MenuDropDownArrow from "./NavbarIcons/MenuDropDownArrow";
import { useState } from "react";
import ActiveTabMenu from "./ActiveTabMenu";
import MuteAll from "../MuteAll/MuteAll";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { isTutorTechBoth } from "../../utils/participantIdentity";

export default function Header2() {
  const [showMenu, setShowMenu] = useState(false);

  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  return (
    <>
      <div className="bg-header-black flex min-h-[30px] h-[60px] w-full justify-between ">
        <div className="relative flex flex-row">
          <button onClick={() => setShowMenu(!showMenu)}>
            <div className="flex p-3 justify-start items-center	gap-x-3">
              <MenuHamburger />
              <span className="text-F2F2F2 ml-1.5">Menu</span>
              <div className="ml-1.5">
                <MenuDropDownArrow />
              </div>
            </div>
          </button>
          {showMenu && (
            <div className="absolute z-50 left-0 top-10 mt-2 bg-header-black border-black-300 rounded-md p-2 ">
              <div className="min-w-[200px] flex justify-center content-center flex-col">
                <Navbar />
              </div>
            </div>
          )}
          <ActiveTabMenu />
        </div>

        {isTutorTechBoth({ identity: String(role_name) }) && (
          <div className=" justify-center content-center items-center p-5 pr-[30px]">
            <MuteAll />
          </div>
        )}
      </div>
    </>
  );
}

{
  /* <Navbar /> */
}

{
  /* <ActiveTabMenu /> */
}
