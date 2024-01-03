import React from "react";
import GroupFile from "./english_zone_question/Component/GroupFile";

export default function RenderedQuestion({ obj }) {
  return (
    <div>
      <GroupFile data={obj} isShowQuestion={true} />
    </div>
  );
}
