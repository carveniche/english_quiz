import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeGgbStudent } from "../../../redux/features/ComponentLevelDataReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
interface students {
  id: string;
  name: string;
}
export default function UserTab({ students }: { students: students[] }) {
  const { ggbData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const { currentSelectedStudentId } = ggbData;
  const dispatch = useDispatch();
  const handleChangeStudent = (index: number) => {
    dispatch(changeGgbStudent(students[index]?.id));
  };
  useEffect(() => {
    if (!ggbData.currentSelectedStudentId)
      dispatch(changeGgbStudent(students[0]?.id));
  }, []);
  if ((students?.length || 0) < 2) return <></>;
  return (
    <div className="h-[40px]">
      {students?.map((item: { id: string; name: string }, key: number) => (
        <div
          key={key}
          className={`w-fit h-fit border ${
            item.id == currentSelectedStudentId ? "bg-sky-500" : ""
          } border-sky-500 pt-2`}
        >
          <button onClick={() => handleChangeStudent(key)}>{item.name}</button>
        </div>
      ))}
    </div>
  );
}
