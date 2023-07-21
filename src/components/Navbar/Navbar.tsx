import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  ActiveTabParams,
  addToActiveTab,
} from "../../redux/features/addActiveTabLink";
import routerConfig from "../../Router/RouterConfig";

export default function Navbar() {
  const queryParams = new URLSearchParams(window.location.search).toString();
  const dispatch = useDispatch();
  const handleClick = ({ path, key, name }: ActiveTabParams) => {
    dispatch(addToActiveTab({ path, key, name }));
    //send datatrack
  };

  return (
    <>
      {routerConfig.map((item) => {
        return (
          <div className="justify-center text-white" key={item.key}>
            <NavLink
              to={`${item.path}?${queryParams}`}
              onClick={() =>
                handleClick({ path: item.path, key: item.key, name: item.name })
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
