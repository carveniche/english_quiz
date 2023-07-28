import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  ActiveTabParams,
  addToActiveTab,
} from "../../redux/features/addActiveTabLink";

import { addCurrentSelectedScreen } from "../../redux/features/liveClassDetails";
import routerConfig from "../../Router/RouterConfig";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { getQueryParams } from "../../utils/getQueryParams";
export default function Navbar() {
  const queryParams = getQueryParams();
  const { room } = useVideoContext();
  const dispatch = useDispatch();
  const handleClick = ({ path, key, name,icon }: ActiveTabParams) => {
    dispatch(addToActiveTab({ path, key, name,icon }));
    dispatch(addCurrentSelectedScreen(path));

    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    console.log("path sending", path);

    let DataTrackObj = {
      pathName: path,
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
      {routerConfig.map((item) => {
        return (
          <div className="justify-center text-white" key={`${item.key}`}>
            <NavLink
              to={`${item.path}?${queryParams}`}
              onClick={() =>
                handleClick({ path: item.path, key: item.key, name: item.name,icon:item.icon })
              }
            >
              {item.name}
            </NavLink>
          </div>
        );
      })}
    </>
  );
}
