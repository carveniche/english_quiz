import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function TestingCom() {
  const testingValues = useSelector(
    (state: RootState) => state.reservations.value
  );

  return (
    <div>
      <h1>Mapping In Testing Comp</h1>
      {testingValues?.map((item) => {
        return (
          <div>
            <h1>{item}</h1>
          </div>
        );
      })}
    </div>
  );
}
