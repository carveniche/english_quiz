import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  ActiveTabParams,
  addToActiveTab,
} from "../../redux/features/addActiveTabLink";

import routerConfig from "../../Router/RouterConfig";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { getQueryParams } from "../../utils/getQueryParams";
import TabIcon from "./TabIcon";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ROUTERKEYCONST } from "../../constants";
import MathzoneNavbar from "./mathzoneNavbar";
export default function Navbar() {
  const { mathzone } = useSelector(
    (state: RootState) => state.liveClassConceptDetails
  );
  const queryParams = getQueryParams();
  const { room } = useVideoContext();
  const dispatch = useDispatch();
  const handleClick = ({
    path,
    key,
    name,
    icon,
    extraParams,
  }: ActiveTabParams) => {
    dispatch(addToActiveTab({ path, key, name, icon, extraParams }));

    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];
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

  return (
    <>
      {false && (
        <ul
          className="bg-header-black text-white transform group-hover:scale-100 absolute 
      transition duration-150 ease-in-out origin-top flex min-w-[260px] flex-col min-h-[48px] items-center"
        >
          <li className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full">
            Programming
          </li>
          <li className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full">
            DevOps
          </li>
          <li className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full">
            <button className="w-full text-left flex items-center outline-none focus:outline-none">
              <span className="pr-1 flex-1">Langauges</span>
              <span className="mr-auto"></span>
            </button>
            <ul
              className="bg-header-black border rounded-sm absolute top-0 right-0 
      transition duration-150 ease-in-out origin-top-left
      min-w-32
      "
            >
              <li className="px-3 py-1 hover:bg-black">Javascript</li>
              <li className="rounded-sm relative px-3 py-1 hover:bg-black">
                <button className="w-full text-left flex items-center outline-none focus:outline-none">
                  <span className="pr-1 flex-1">Python</span>
                  <span className="mr-auto">
                    <svg
                      className="fill-current h-4 w-4
                    transition duration-150 ease-in-out"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </span>
                </button>
                <ul
                  className="bg-white border rounded-sm absolute top-0 right-0 
          transition duration-150 ease-in-out origin-top-left
          min-w-32
          "
                >
                  <li className="px-3 py-1 hover:bg-black">2.7</li>
                  <li className="px-3 py-1 hover:bg-black">3+</li>
                </ul>
              </li>
              <li className="px-3 py-1 hover:bg-black">Go</li>
              <li className="px-3 py-1 hover:bg-black">Rust</li>
            </ul>
          </li>
        </ul>
      )}
      <ul
        className="bg-header-black text-white transform group-hover:scale-100 absolute 
      transition duration-150 ease-in-out origin-top flex min-w-[260px] flex-col min-h-[48px] items-center"
      >
        {true &&
          routerConfig.map((item, index) => {
            return item.key !== ROUTERKEYCONST.mathzone ? (
              <li
                key={index}
                className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full flex gap-2"
              >
                <NavLink
                  to={`${item.path}?${queryParams}`}
                  onClick={() =>
                    handleClick({
                      path: item.path,
                      key: item.key,
                      name: item.name,
                      icon: item.icon,
                      extraParams: {},
                    })
                  }
                  className={"w-48"}
                  style={{ display: "block" }}
                >
                  <div className="flex gap-2">
                    <TabIcon src={item.icon} />
                    <div> {item.name}</div>
                  </div>
                </NavLink>
                <TabIcon src={"/menu-icon/chevron.svg"} />
              </li>
            ) : (
              <MathzoneNavbar
                mathzone={mathzone}
                item={item}
                key={index}
                handleClick={handleClick}
                queryParams={queryParams}
              />
            );
          })}
      </ul>
    </>
  );
}
