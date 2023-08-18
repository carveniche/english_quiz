import React from "react";
import MainBlockBaseImage from "./component/BlockBaseImage/MainBlockBaseImage";
import MainCkEditor from "./component/Ckeditor/MainCkEditor";
import MainDragDropImageCompare from "./component/ComparisionDragAndDropImage/MainDragDropImageCompare";
import MainCountOnTensframe from "./component/CountOnTensframe.jsx/MainCountOnTensframe";
import MainDragAndDrop from "./component/DragAndDrop/MainDragAndDrop";
import MainFillInTheBlanks from "./component/FillInTheBlacks/MainFillInTheBlanks";
import MainHorizontal from "./component/Horizontal/MainHorizontal";
import MainHorizontalFillUps from "./component/HorizontalFillUps/MainHorizontalFillUps";
import MainHorizontalNotSymbols from "./component/Horizontalnotsymbols/MainHorizontalNotSymbols";
import MainHorizontalPicture from "./component/HorizontalPicture/MainHorizontalPicture";
import HorizontalPreviewClick from "./component/HorizontalPreviewClick";
import HundredChart from "./component/HundredChart/HundredChart";
import LogicalTableKg from "./component/LogicalTableKg/LogicalTableKg";
import MainLongDivision from "./component/LongDivision/MainLongDivision";
import MainMatchObjectHorizontal from "./component/MatchObjectHorizontal/MainMatchObjectHorizontal";
import MainMatchObjectVertical from "./component/MatchObjectVertical/MainMatchObjectVertical";
import MainMemoryCardGame from "./component/MemoryCardGame/MainMemoryCardGame";
import MainMultipleChoice from "./component/MultipleChoice/MainMultipleChoice";
import MainMultipleSelect from "./component/MultipleSelect/MainMultipleSelect";
import MainNumberBond from "./component/NumberBond/MainNumberBond";
import MainOl from "./component/OL/MainOl";
import OnlineQuiz from "./component/OnlineQuiz";
import MainOprc from "./component/Oprc/mainOprc";
import OptionMultiplePictureMain from "./component/OptionlMultiplePicture/OptionMultiplePictureMain";
import MainOrc from "./component/ORC/MainORC";
import MainPlaceValueChart from "./component/PlaceValueChart/MainPlaceValueChart";
import MainValueTableSelect from "./component/PlaceValueTableSelect/MainValueTableSelect";
import MainQuestionTextImage from "./component/QuestionTextImage/MainQuestionTextImage";
import { ClickableOnPic } from "./component/questiontextoptions/clickableOnPicture/clickableOnPicture";
import { ClickableOnYesNo } from "./component/questiontextoptions/clickableOnYesNo/clickableOnYesNo";
import MainRandomArrangmentDragDrop from "./component/RandomArrangemenDragDrop/MainRandomArrangmentDragDrop";
import DisabledTeacherCkEditor from "./component/TeacherOnlineQuiz/component/AllDisabledQuestion/Ckeditor/DisabledTeacherCkEditor";
import MainTensframe from "./component/TensFrame/MainTensFrame";
import MainVertical from "./component/Vertical/MainVertical";
import MainVerticalWithSymbols from "./component/VerticalWithSymbols/MainVerticalWithSymbols";

export default function AllFile({ obj, temp, type, isResponse, isTutor }) {
  let questionType = {
    "Multiple choice": (
      <MainMultipleChoice obj={obj} meter={obj?.question_no} />
    ),
    "True/False": <MainMultipleChoice obj={obj} meter={obj?.question_no} />,
    "Fill in the blanks": (
      <MainFillInTheBlanks obj={obj} meter={obj?.question_no} />
    ),
    "multi select": <MainMultipleSelect obj={obj} meter={obj?.question_no} />,
    horizontalpreviewclick: (
      <HorizontalPreviewClick obj={temp} meter={obj?.question_no} />
    ),
    horizontalnotsymbols: (
      <MainHorizontalNotSymbols obj={temp} meter={obj?.question_no} />
    ),
    matchobjectsvertical: (
      <MainMatchObjectVertical obj={temp} meter={obj?.question_no} />
    ),
    countontenframes: (
      <MainCountOnTensframe obj={temp} meter={obj?.question_no} />
    ),
    count_tenframes_multiple: (
      <OnlineQuiz obj={temp} meter={obj?.question_no} />
    ),
    tenframes: <MainTensframe obj={temp} meter={obj?.question_no} />,
    questiontextoptions: (
      <ClickableOnPic data={temp} meter={obj?.question_no} />
    ),
    countofobjectsyesno: (
      <ClickableOnYesNo data={temp} meter={obj?.question_no} />
    ),
    randomarrangementdragdrop: (
      <MainRandomArrangmentDragDrop obj={temp} meter={obj?.question_no} />
    ),
    matchobjectshorizontal: (
      <MainMatchObjectHorizontal obj={temp} meter={obj?.question_no} />
    ),
    horizontalpicture: (
      <MainHorizontalPicture obj={temp} meter={obj?.question_no} />
    ),
    options_multiple_pictures: (
      <OptionMultiplePictureMain obj={temp} meter={obj?.question_no} />
    ),
    hundreds_chart: <HundredChart data={temp} meter={obj?.question_no} />,
    comparison_of_images: (
      <MainDragDropImageCompare obj={temp} meter={obj?.question_no} />
    ),
    compare_drag_operator: (
      <MainDragAndDrop obj={temp} meter={obj?.question_no} />
    ),
    base_block_images: (
      <MainBlockBaseImage obj={temp} meter={obj?.question_no} />
    ),
    horizontal_fill_ups: (
      <MainHorizontalFillUps obj={temp} meter={obj?.question_no} />
    ),
    horizontal_fill_ups_multi_row: (
      <MainHorizontalFillUps obj={temp} meter={obj?.question_no} />
    ),
    place_value_chart: (
      <MainPlaceValueChart obj={temp} meter={obj?.question_no} />
    ),
    vertical: <MainVertical obj={temp} meter={obj?.question_no} />,
    horizontal: <MainHorizontal obj={temp} meter={obj?.question_no} />,
    verticalwithsymbols: (
      <MainVerticalWithSymbols obj={temp} meter={obj?.question_no} />
    ),
    questiontextimages: (
      <MainQuestionTextImage obj={temp} meter={obj?.question_no} />
    ),
    place_value_table_select: (
      <MainValueTableSelect obj={temp} meter={obj?.question_no} />
    ),
    long_multiplication: <MainVertical obj={temp} meter={obj?.question_no} />,
    logical_table_kg: <LogicalTableKg data={temp} meter={obj?.question_no} />,
    orc: <MainOrc obj2={obj} meter={obj?.question_no} />,
    ol: <MainOl obj2={obj} meter={obj?.question_no} />,
    ckeditor: isResponse ? (
      <DisabledTeacherCkEditor
        str={obj?.question_data[0]?.question_text}
        choiceData={obj?.question_data[0]?.choice_data}
        choiceId={obj?.question_data[0]?.studentAnswer}
        upload_file_name={obj?.question_data[0]?.upload_file_name}
      />
    ) : (
      <MainCkEditor
        str={obj?.question_data[0]?.question_text}
        meter={obj?.question_no}
        choiceData={obj?.question_data[0]?.choice_data}
        upload_file_name={obj?.question_data[0]?.upload_file_name}
      />
    ),
    oprc: <MainOprc meter={obj?.question_no} obj2={obj} />,
    number_bond: <MainNumberBond meter={obj?.question_no} obj={temp} />,

    memory_card_game: (
      <MainMemoryCardGame obj={temp} meter={obj?.question_no} teacher={false} />
    ),
    long_division: (
      <MainLongDivision obj={temp} meter={obj?.question_no} teacher={false} />
    ),
  };

  return <>{questionType[type]}</>;
}
