import { useState } from "react";

import EverythingOkayModel from "./EverthingOkayModel/EverythingOkayModel";
import SuggestionCommentsModel from "./SuggestionCommentsModel/SuggestionCommentsModel";
export default function ParentActionNavbar() {
  const [everythingOkayModel, setShowEverythingOkayModel] = useState(false);
  const [suggestionCommentsModel, setSuggestionCommentsModel] = useState(false);
  const everythingOkayBtn = () => {
    setShowEverythingOkayModel(!everythingOkayModel);
  };

  const suggestionBtn = () => {
    setSuggestionCommentsModel(!suggestionCommentsModel);
  };

  const raiseAlarmBtn = () => {
    console.log("Raise An Alarm btn clicked");
  };

  return (
    <>
      <div className="flex flex-row min-w-[500px] min-h-[35px] sm:min-w-[200px] sm:min-h-[25px] items-center justify-between rounded gap-2 bg-header-black-top px-2 py-1">
        <div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={everythingOkayBtn}
          >
            Everything Seems Good
          </button>
        </div>
        <div>
          <button
            className="bg-yellow-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={suggestionBtn}
          >
            Send a Suggestion or Concern
          </button>
        </div>
        <div>
          <button
            className="bg-red-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={raiseAlarmBtn}
          >
            Raise An Alarm
          </button>
        </div>
      </div>

      {everythingOkayModel && (
        <EverythingOkayModel handleClose={everythingOkayBtn} />
      )}
      {suggestionCommentsModel && <SuggestionCommentsModel />}
    </>
  );
}
