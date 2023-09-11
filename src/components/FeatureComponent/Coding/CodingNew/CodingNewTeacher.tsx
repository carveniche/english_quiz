import data from "./dummydata.json";

import todayClassFlag from "../../../../assets/todayClassIconGreen.png";

const activeProjectBgCss = "bg-gradient-to-r from-[#3bd7b1] to-[#a4ec9e]";
const unactiveProjectBgCss = "bg-gradient-to-r from-[#eb3349] to-[#f45c43]";
export default function CodingNewTeacher() {
  console.log("data", data);

  const showScratchProject = (item: any) => {
    return item.students.map((item: any) => {
      return (
        <div
          className={`flex w-full h-[80%] justify-center items-center border border-gray-200 rounded-full ${
            item.status === "active" || item.status === "In progress"
              ? activeProjectBgCss
              : unactiveProjectBgCss
          }`}
        >
          <p className="text-white font-semibold text-sm">{item.name}</p>
        </div>
      );
    });
  };

  const showPythonProject = (item: any) => {
    return <></>;
  };

  return (
    <div className="flex flex-col gap-5 w-[98%] h-[98%] items-center border border-gray-300 p-5 rounded">
      {data.activities.length > 0 &&
        data.activities.map((item) => {
          return (
            <div className="flex w-[98%] h-[28%] justify-center items-center border border-gray-300 p-1 rounded">
              <div className="flex w-[10%] h-full justify-center items-center">
                <div className="flex w-16 h-16 justify-center items-center bg-white border rounded-full">
                  <p className="text-speedMathTextColor font-semibold text-2xl">
                    {item.day}
                  </p>
                </div>
              </div>
              <div className="flex w-[10%] h-full justify-center items-center">
                {item.today_class && (
                  <img className="flex w-[50%] h-[50%]" src={todayClassFlag} />
                )}
              </div>
              <div className="flex w-[10%] h-full justify-center items-center">
                <a className="text-blue-500 hover:text-blue-700 cursor-pointer">
                  <p className="text-speedMathTextColor font-semibold text-lg">
                    {item.lesson_data.name
                      ? "View Lesson"
                      : "Dummy View Lesson"}
                  </p>
                </a>
              </div>
              <div className="flex flex-col w-[20%] h-full justify-center items-center ">
                <div className="flex w-full h-[50%] justify-center items-center flex-wrap overflow-auto ">
                  <p className="text-speedMathTextColor font-semibold text-lg">
                    {item.class_title}
                  </p>
                </div>
                <div className="flex w-full h-[50%] justify-center items-center flex-wrap overflow-auto">
                  <p className="text-speedMathTextColor font-semibold text-lg">
                    {item.learning_outcome}
                  </p>
                </div>
              </div>
              <div className="flex flex-col w-[40%] h-full justify-center items-center border border-red-100">
                <div className="flex w-full h-[50%] justify-center items-center border border-red-50">
                  <p className="text-speedMathTextColor font-semibold text-lg">
                    Student Project
                  </p>
                </div>
                <div className="flex w-full h-[50%] justify-center items-center border border-red-50">
                  {item.project_type === "scratch" ? (
                    <div className="flex flex-row w-full h-full justify-between items-center gap-2">
                      {showScratchProject(item)}
                    </div>
                  ) : item.project_type === "python" ? (
                    <div className="flex flex-row w-full h-full justify-between items-center gap-2">
                      {showPythonProject(item)}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="flex flex-col w-[10%] h-full justify-center items-center border border-red-100">
                <div>Teacher Project</div>
                <div>Teacher Project View Image</div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
