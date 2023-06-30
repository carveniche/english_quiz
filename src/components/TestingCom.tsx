import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { addDetails } from "../redux/features/liveClassDetails";

export default function TestingCom() {
  const testingValues = useSelector(
    (state: RootState) => state.reservations.value
  );

  const dispatch = useDispatch();

  const updateDetailsInRedux = () => {
    dispatch(addDetails("hello"));
  };

  return (
    <div>
      <h1>Mapping In Testing Comp</h1>
      <button onClick={updateDetailsInRedux}>Testing</button>
    </div>
  );
}
