import React, { useContext, useEffect } from 'react'
import MainBlockBaseImage from '../component/BlockBaseImage/MainBlockBaseImage';
import MainDragDropImageCompare from '../component/ComparisionDragAndDropImage/MainDragDropImageCompare';
import MainCountOnTensframe from '../component/CountOnTensframe.jsx/MainCountOnTensframe';
import MainDragAndDrop from '../component/DragAndDrop/MainDragAndDrop';
import MainHorizontal from '../component/Horizontal/MainHorizontal';
import MainHorizontalFillUps from '../component/HorizontalFillUps/MainHorizontalFillUps';
import MainHorizontalNotSymbols from '../component/Horizontalnotsymbols/MainHorizontalNotSymbols';
import MainHorizontalPicture from '../component/HorizontalPicture/MainHorizontalPicture';
import HorizontalPreviewClick from '../component/HorizontalPreviewClick';
import HundredChart from '../component/HundredChart/HundredChart';
import LogicalTableKg from '../component/LogicalTableKg/LogicalTableKg';
import MainMatchObjectHorizontal from '../component/MatchObjectHorizontal/MainMatchObjectHorizontal';
import MainMatchObjectVertical from '../component/MatchObjectVertical/MainMatchObjectVertical';
import MainNumberBond from '../component/NumberBond/MainNumberBond';
import OnlineQuiz from '../component/OnlineQuiz';
import OptionMultiplePictureMain from '../component/OptionlMultiplePicture/OptionMultiplePictureMain';
import MainPlaceValueChart from '../component/PlaceValueChart/MainPlaceValueChart';
import MainValueTableSelect from '../component/PlaceValueTableSelect/MainValueTableSelect';
import MainQuestionTextImage from '../component/QuestionTextImage/MainQuestionTextImage';
import { ClickableOnPic } from '../component/questiontextoptions/clickableOnPicture/clickableOnPicture';
import { ClickableOnYesNo } from '../component/questiontextoptions/clickableOnYesNo/clickableOnYesNo';
import MainRandomArrangmentDragDrop from '../component/RandomArrangemenDragDrop/MainRandomArrangmentDragDrop';
import MainTensframe from '../component/TensFrame/MainTensFrame';
import MainVertical from '../component/Vertical/MainVertical';
import MainVerticalWithSymbols from '../component/VerticalWithSymbols/MainVerticalWithSymbols';
import { ValidationContext } from '../MainOnlineQuiz/MainOnlineQuizPage';


export default function CommonStudentResponse({data,type}){
    const {handleUpdateStudentAnswerResponse}=useContext(ValidationContext)
    useEffect(()=>{
        handleUpdateStudentAnswerResponse(true)
    },[])
  
    let questionType = {
     
        horizontal_fill_ups: (
          <MainHorizontalFillUps obj={data} meter={0} />
        ),
        horizontal_fill_ups_multi_row: (
          <MainHorizontalFillUps obj={data} meter={0} />
        ),
        horizontal: <MainHorizontal obj={data} meter={0} />,
        vertical: <MainVertical obj={data} meter={0} />,
        matchobjectsvertical: (<MainMatchObjectVertical obj={data} meter={0} />),
        randomarrangementdragdrop:<MainRandomArrangmentDragDrop obj={data} meter={0} />,
        place_value_chart: (
          <MainPlaceValueChart obj={data} meter={0} />
        ),
        compare_drag_operator: (
          <MainDragAndDrop obj={data} meter={0} />
        ),
        comparison_of_images: (
          <MainDragDropImageCompare obj={data} meter={0} />
        ),
        matchobjectshorizontal: (
          <MainMatchObjectHorizontal obj={data} meter={0} />
        ),
        base_block_images: (
          <MainBlockBaseImage obj={data} meter={0} />
        ),
        horizontalnotsymbols: (
          <MainHorizontalNotSymbols obj={data} meter={0} />
        ),
        options_multiple_pictures: (
          <OptionMultiplePictureMain obj={data} meter={0} />
        ),
        horizontalpicture: (
          <MainHorizontalPicture obj={data} meter={0} />
        ),
        place_value_table_select: (
          <MainValueTableSelect obj={data} meter={0} />
        ),
        countontenframes: (
          <MainCountOnTensframe obj={data} meter={0} />
        ),
        count_tenframes_multiple: (
          <OnlineQuiz obj={data} meter={0} studentResponseView={true}/>
        ),
        tenframes: <MainTensframe obj={data} meter={0} />,
        questiontextoptions: (
        <ClickableOnPic data={data} meter={0} />),
    verticalwithsymbols: (
      <MainVerticalWithSymbols obj={data} meter={0} />
    ),
    questiontextimages: (
      <MainQuestionTextImage obj={data} meter={0} />
      
    ),
    long_multiplication: <MainVertical obj={data} meter={0} />,
    logical_table_kg: <LogicalTableKg data={data} meter={0} />,
    horizontalpreviewclick: (
      <HorizontalPreviewClick obj={data} meter={0} />
    ),
    hundreds_chart: <HundredChart data={data} meter={0} />,
    countofobjectsyesno: (
      <ClickableOnYesNo data={data} meter={0} />
    ),
    number_bond: <MainNumberBond obj={data} meter={0} />,
       
      };
      return <>{questionType[type]}</>

}