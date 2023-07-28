import Navbar from "./Navbar";
import MenuHamburger from "./NavbarIcons/MenuHamburger";
import MenuDropDownArrow from "./NavbarIcons/MenuDropDownArrow";
import { useState } from "react";
import ActiveTabMenu from "./ActiveTabMenu";

export default function Header2() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="bg-header-black flex min-h-[40px] w-full">
        <div className="relative">
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
            <div className="absolute z-50 left-0 mt-2 bg-header-black border-black-300 rounded-md p-2 ">
              <div className="min-w-[200px] flex justify-center content-center flex-col">
                <Navbar />
              </div>
            </div>
          )}
        </div>
        <ActiveTabMenu />
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
