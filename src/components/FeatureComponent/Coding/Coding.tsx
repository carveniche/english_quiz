import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BaseUrl from "../../../api/ApiConfig";
import CodingOld from "./CodingOld/CodingOld";
import CodingNew from "./CodingNew/CodingNew";
import { RootState } from "../../../redux/store";
export default function Coding() {
  const [oldCodingApi, setOldCodingApi] = useState("");
  const { liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const { class_type, demo, show_new_codings, role_name, env } = useSelector(
    (state) => state.videoCallTokenData
  );

  useEffect(() => {
    console.log("h1llo");
    let oldCodingUrl =
      BaseUrl + "online_classes/coding_links?live_class_id=" + liveClassId;
    setOldCodingApi(oldCodingUrl);
  }, []);

  const showNewCoding = () => {
    return <CodingNew identity={role_name} env={env} />;
  };

  const showOldCoding = () => {
    return <CodingOld codingUrl={oldCodingApi} />;
  };

  const renderCoding = () => {
    if (class_type === "math_coding") {
      if (demo) {
        if (show_new_codings) {
          return showNewCoding();
        } else {
          return showOldCoding();
        }
      } else {
        return showNewCoding(); //Need to uncommnent this just commenting it to test old coding
      }
    } else {
      return showOldCoding();
    }
  };

  return (
    <div className="flex w-full h-full justify-center items-center">
      {renderCoding()}
    </div>
  );
}
