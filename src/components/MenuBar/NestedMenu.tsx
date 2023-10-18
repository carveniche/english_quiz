import { useDispatch } from "react-redux";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { isTutorTechBoth } from "../../utils/participantIdentity";
import Navbar from "../Navbar/Navbar";
import MenuDropDownArrow from "../Navbar/NavbarIcons/MenuDropDownArrow";
import MenuHamburger from "../Navbar/NavbarIcons/MenuHamburger";
import { useState } from "react";
import { toggleMenuBar } from "../../redux/features/liveClassDetails";
export default function NestedMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const { room } = useVideoContext();
  const dispatch = useDispatch();
  const localParticipant = room?.localParticipant?.identity;
  const isValidParticipant = isTutorTechBoth({ identity: localParticipant });
  const handleShowMenu = (value: boolean) => {
    setShowMenu(value);
    dispatch(toggleMenuBar(value));
  };
  return (
    <>
      <div className="group inline-block submenu-react hover:bg-black">
        <button
          className="outline-none focus:outline-none flex items-center"
          onClick={() => (isValidParticipant ? handleShowMenu(!showMenu) : "")}
        >
          <div className="flex p-3 justify-start items-center	gap-x-3">
            <MenuHamburger />

            <span className="text-F2F2F2 ml-1.5">Menu</span>

            <div className="ml-1.5">
              <MenuDropDownArrow />
            </div>
          </div>
        </button>
        {showMenu && <Navbar onClick={() => handleShowMenu(false)} />}
      </div>
    </>
  );
}
