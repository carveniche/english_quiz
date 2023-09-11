import React from "react";
import OldDataFlow from "./OldDataFlow";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CICO } from "../../../constants";
import { useParams } from "react-router";

export default function Cico(props: any) {
  const { room } = useVideoContext();
  const [mounting, setMounting] = React.useState(false);
  const { cico_type }: { cico_type: any } = useParams();
  const {
    currentSelectedRouter,
    currentSelectedIndex,
    currentSelectedKey,
    activeTabArray,
  } = useSelector((state: RootState) => state.activeTabReducer);
  const localParticipant = room;
  const [allIds, setAllIds] = React.useState([]);
  const handleDataTrack = (payload: { data: string; key: string }) => {
    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];

    let activeTabData = activeTabArray[currentSelectedIndex];
    let DataTrackObj = {
      pathName: currentSelectedRouter,
      key: currentSelectedKey,
      value: {
        type: payload.key,
        behaviour: "old_data_flow",
        identity: null,
        cicoData: payload.data,
        activeTabData,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };
  const handleCloseActivity = (val: any) => {
    var dataMessage = "EndActivityRequest|" + val;
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
  };
  const sendShapeChallengeImage = (obj: any) => {
    var dataMessage = "SendShapeActivityImage|" + JSON.stringify(obj);
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
  };
  const sendActiveWhiteBoardData = (obj: any) => {
    var dataMessage = "ShapeActivityWhiteboardPoints|" + JSON.stringify(obj);
    console.log(obj);
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
  };
  const sendSelectedAffirmationValue = (obj: any) => {
    var dataMessage = "AffirmationSelectedValue|" + JSON.stringify(obj);
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
  };
  const handleSendTeacherActivityResponse = () => {
    var dataMessage = "TeacherActivityResponseSaved";
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
  };
  const onAffirmationCheckoutNextButton = (val: any) => {
    var dataMessage = "CheckoutAffirmationNextButton|" + JSON.stringify(val);
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
  };
  const onSendStoriesToStudent = (obj: any) => {
    var dataMessage = "ShowAffirmationStories|" + JSON.stringify(obj);
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
  };
  const handleShowPreviewImageAffrimation = (val: any) => {
    var dataMessage = "showAffirmationPreviewImageStudent|" + val;
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
  };
  const onSendSelectedFeelingImg = (val: any) => {
    var dataMessage = "FeelingChartSelectedImg|" + val;
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
  };
  const onSendOpenDropBox = (val: any) => {
    var dataMessage = "FeelingChartOpenDropBox|" + val;
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
  };
  const openActivity = (obj: any) => {
    var dataMessage = "MainActivity|" + JSON.stringify(obj);
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
    // this.sendDataMessage(dataMessage);
  };
  const handleShapeChallengeStudentResponseSaved = () => {
    var dataMessage = "studentShapeChallengeResponseSaved";
    handleDataTrack({ key: CICO.checkIn, data: dataMessage });
  };
  let remoteParticipant = room?.participants;
  const x = Array.from(remoteParticipant.values());

  React.useEffect(() => {
    let ids: any = [];
    ids = x.map((id) => {
      return id.identity;
    });
    ids = ids || [];
    setAllIds(ids);
  }, [x.length]);
  React.useEffect(() => {
    setMounting(true);
  }, []);
  return (
    <>
      {mounting && (
        <OldDataFlow
          key={cico_type}
          activity_type={cico_type === CICO.checkIn ? "Check In" : "Check Out"}
          activity_id={cico_type === CICO.checkIn ? 0 : 1}
          handleCloseActivity={handleCloseActivity}
          sendShapeChallengeImage={sendShapeChallengeImage}
          sendActiveWhiteBoardData={sendActiveWhiteBoardData}
          sendSelectedAffirmationValue={sendSelectedAffirmationValue}
          handleSendTeacherActivityResponse={handleSendTeacherActivityResponse}
          onAffirmationCheckoutNextButton={onAffirmationCheckoutNextButton}
          onSendStoriesToStudent={onSendStoriesToStudent}
          handleShowPreviewImageAffrimation={handleShowPreviewImageAffrimation}
          onSendSelectedFeelingImg={onSendSelectedFeelingImg}
          onSendOpenDropBox={onSendOpenDropBox}
          videoRoom={localParticipant}
          all_ids={allIds}
          openActivity={openActivity}
          handleShapeChallengeStudentResponseSaved={
            handleShapeChallengeStudentResponseSaved
          }
        />
      )}
    </>
  );
}
