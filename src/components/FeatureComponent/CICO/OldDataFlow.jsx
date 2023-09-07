import React from "react";
import MainActivity from "../StudentActivitys/MainActivity";
const lottieAnimationDelay = 5000;
const deadlineForActvity = 3600 * 1000;
export default class OldDataFlow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCheckoutAffirmationNextBtn: { val: 0 },
      showActivityNotification: true,
    };
  }
  componentDidMount = () => {
    this.openActivity(this.props.activity_type, this.props.activity_id);
  };
  openActivity = (type, i) => {
    let notification = true;
    let search = window.location.search;
    let urlParams = new URLSearchParams(search);
    let liveClassID = urlParams.get("liveClassID");
    liveClassID = liveClassID?.trim();
    let keys = "activityNotification" + liveClassID;
    try {
      notification = JSON.parse(localStorage.getItem(keys));
      let startTime = Number(notification?.startTime) || 0;
      let currentTime = Date.now();
      let differenceTime = currentTime - startTime;
      if (differenceTime >= deadlineForActvity) {
        notification = true;
        startTime = currentTime;
        localStorage.setItem(
          keys,
          JSON.stringify({
            notification: true,
            startTime: currentTime,
          })
        );
      } else {
        notification = notification?.notification;
      }
    } catch (e) {
      let obj = {
        notification: true,
        startTime: Date.now(),
      };
      localStorage.setItem(keys, JSON.stringify(obj));
    }
    this.setState({
      selected: 11,
      selectedActivity: type,
      currentScreenName: `${type} Activity`,
      isCheckInActivity: !i,
      showActivityNotification: notification,
      sendActiveWhiteBoardData: [],
      mounting: false,
      isCheckOutActivityEnd: false,
      isCheckInActivityEnd: false,
      cicoApiData: {},
    });
    let id = setTimeout(() => {
      this.setState({ mounting: true });
    }, 0);
  };
  handleCloseActivity = (val) => {
    this.closeActivityMethod(val);

    this.props.handleCloseActivity(val);
  };
  closeActivityMethod = (val) => {
    console.log(val);
    if (val?.startsWith("feelingchart")) {
      this.setState({ showEndActivityAnimation: val });
      this.resetActivityLocalStorage();
      return;
    }
    this.setState({ showEndActivityAnimation: true });
    let id = setTimeout(
      () => {
        clearTimeout(id);
        this.setState({ showEndActivityAnimation: false });
        this.resetActivityLocalStorage();
      },
      val === "feelingchart" ? 0 : 5000
    );
  };
  handleShapeChallengeStudentResponseSaved = () => {
    console.log("student side");
    this.setState({ isStudentShapeChallengeResponseSaved: true });
    this.props.handleShapeChallengeStudentResponseSaved();
  };
  handleShowActivityNotification = () => {
    let search = window.location.search;
    let urlParams = new URLSearchParams(search);
    let liveClassID = urlParams.get("liveClassID");
    liveClassID = liveClassID?.trim();
    let keys = "activityNotification" + liveClassID;
    let obj = JSON.parse(localStorage.getItem(keys));
    localStorage.setItem(keys, JSON.stringify({ ...obj, notification: false }));
    this.setState({ showActivityNotification: false });
    this.props.handleShowActivityNotification({
      showActivityNotification: false,
    });
  };
  handleSendTeacherActivityResponse = () => {
    this.setState({
      teacherActivityResponseSaved:
        this.state?.teacherActivityResponseSaved === true ? 1 : true,
    });

    this.props?.handleSendTeacherActivityResponse();
  };
  resetActivityLocalStorage = () => {
    let search = window.location.search;
    let urlParams = new URLSearchParams(search);
    let liveClassID = urlParams.get("liveClassID");
    liveClassID = liveClassID?.trim();
    let keys1 = "activityNotification" + liveClassID;
    let keys2 = "";
    let keys3 =
      "activityTimer" +
      (this.state.isCheckInActivity ? "Check-In" : "Check-Out") +
      liveClassID;
    let keys4 =
      "AffirmationActivityTimer" +
      (this.state.isCheckInActivity ? "Check-in" : "Check-out") +
      liveClassID;
    let keys5 =
      "feelingChart" +
      (this.state.isCheckInActivity ? "check-in" : "check-out") +
      liveClassID +
      "student";
    let keys6 =
      "feelingChart" +
      (this.state.isCheckInActivity ? "check-in" : "check-out") +
      liveClassID +
      "teacher";
    let keys7 =
      "selfaffirmation" +
      (this.state.isCheckInActivity ? "check-in" : "check-out") +
      liveClassID +
      "student";
    let keys8 =
      "shapechallenge" +
      (this.state.isCheckInActivity ? "check-in" : "check-out") +
      liveClassID +
      "student";
    localStorage.removeItem(keys1);
    localStorage.removeItem(keys2);
    localStorage.removeItem(keys3);
    localStorage.removeItem(keys4);
    localStorage.removeItem(keys5);
    localStorage.removeItem(keys6);
    localStorage.removeItem(keys7);
    localStorage.removeItem(keys8);
    this.setState({
      isStudentActivityEnd: true,
    });
  };
  sendShapeChallengeImage = (data) => {
    let obj = {
      identity: this.props?.videoRoom?.localParticipant?.identity,
      image: "dkdkdkddk",
    };
    this.setState({
      isActivityScreenShotCapture:
        this.state?.isActivityScreenShotCapture === true ? 1 : true,
    });
    this.props.sendShapeChallengeImage(obj);
  };
  sendActiveWhiteBoardData = (data) => {
    let obj = {
      identity: this.props?.videoRoom?.localParticipant?.identity,
      coordinates: data,
    };
    this.props.sendActiveWhiteBoardData(obj);
  };
  onAffirmationCheckoutNextButton = (val) => {
    console.log(val);
    this.setState({
      showCheckoutAffirmationNextBtn: {
        val: val + 1,
      },
    });
    this.props.onAffirmationCheckoutNextButton({
      val: val + 1,
      cicoApiData: this.state.cicoApiData,
      isCheckInActivity: this.state.isCheckInActivity,
      currentScreenName: this.state.currentScreenName,
      selectedActivity: this.state.selectedActivity,
    });
  };
  sendCicoDataToStudent = ({ data, type, isCheckInActivity }) => {
    this.setState({
      cicoApiData: data,
    });
    this.props.openActivity({
      selected: 11,
      selectedActivity: type,
      currentScreenName: `${type} Activity`,
      isCheckInActivity: isCheckInActivity,
      showActivityNotification: true,
      sendActiveWhiteBoardData: [],
      cicoApiData: data,
    });
  };
  sendSelectedAffirmationValue = (value) => {
    this.setState({
      affirmationActivityStudentResponse: Number(value) + 1,
      showAffirmationNextButton: true,
    });
    let obj = {
      identity: this.props?.videoRoom?.localParticipant?.identity,
      value: value,
    };
    this.props.sendSelectedAffirmationValue(obj);
  };
  onSendStoriesToStudent = () => {
    this.setState({
      showAffirmationStories: true,
      showAffirmationNextButton: false,
    });
    this.props.onSendStoriesToStudent({
      showAffirmationStories: true,
      cicoApiData: this.state.cicoApiData,
      isCheckInActivity: this.state.isCheckInActivity,
      currentScreenName: this.state.currentScreenName,
      selectedActivity: this.state.selectedActivity,
    });
  };
  handleEndCheckInActivity = () => {
    this.setState({ isCheckInActivityEnd: true });
  };
  handleEndCheckOutActivity = () => {
    this.setState({ isCheckOutActivityEnd: true });
  };
  handleIncomingDatas = (data) => {
    console.log("Data", data);
    const { videoRoom } = this.props;
    const isSafari =
      /Safari/.test(navigator.userAgent) &&
      /Apple Computer/.test(navigator.vendor);
    if (data.startsWith("ChangeAffirmationStoriesPageNumber")) {
      var pageNumber = data.split("ChangeAffirmationStoriesPageNumber|");
      pageNumber.shift();
      pageNumber = pageNumber[0];
      this.setState({ storyBookPageNumber: Number(pageNumber) });
    }

    if (data.startsWith("MainActivity")) {
      if (!isSafari) {
        let audio = new Audio(
          "https://soundbible.com/mp3/Elevator%20Ding-SoundBible.com-685385892.mp3"
        );
        // audio.play();
      }
      let arr = data.split("|");
      arr.shift();
      let temp = JSON.parse(arr.join("|"));
      let temp2 = { ...this.state, ...temp };
      let specialParticipant = ["liveadmin", "tech"];

      if (
        specialParticipant.includes(
          String(videoRoom?.localParticipant?.identity.trim())
        )
      ) {
        try {
          console.log(JSON.stringify(temp));
        } catch (e) {
          console.log(temp);
        }
      }
      temp2 = { ...temp2, mounting: false };
      this.setState({ ...temp2 });
      let id = setTimeout(() => {
        this.setState({ mounting: true });
        clearTimeout(id);
      }, 0);
    }
    if (data.startsWith("ActivityNotification")) {
      let arr = data.split("|");
      arr.shift();
      let temp = JSON.parse(arr.join("|"));
      let temp2 = { ...this.state, ...temp };
      this.setState({ ...temp2, sendActiveWhiteBoardData: [], selected: 11 });
    }
    if (data.startsWith("EndActivityRequest")) {
      let arr = data.split("|");
      this.closeActivityMethod(arr[1]);
    }
    if (data.startsWith("CheckoutAffirmationNextButton")) {
      let arr = data.split("|");

      arr.shift();
      let obj = JSON.parse(arr[0]);
      this.setState({
        showCheckoutAffirmationNextBtn: { val: obj?.val || 0 },
        selected: 11,
        selectedActivity: obj?.selectedActivity,
        isCheckInActivity: obj?.isCheckInActivity,
        currentScreenName: obj?.currentScreenName,
      });
    }
    if (data.startsWith("TeacherActivityResponseSaved")) {
      this.setState({
        teacherActivityResponseSaved:
          this.state.teacherActivityResponseSaved === true ? 1 : true,
      });
    }
    if (data.startsWith("SendShapeActivityImage")) {
      let arr = data.split("|");
      arr.shift();
      arr = arr.join("|");
      let obj = JSON.parse(arr);
      console.log(this.props.videoRoom?.localParticipant?.identity);
      if (this.props.videoRoom?.localParticipant?.identity === "tutor") {
        this.setState({
          shapeActivityStudentResponse: {
            [obj?.identity]: obj?.image,
          },
          selected: 11,
        });
      }
    }
    if (data.startsWith("ShapeActivityWhiteboardPoints")) {
      let arr = data.split("|");
      arr.shift();
      arr = arr.join("|");
      let obj = JSON.parse(arr);
      console.log(obj);
      if (true) {
        console.log("kddk", obj.coordinates);
        this.setState({
          shapesActivityTutorsWhiteBoardPoint: obj.coordinates,
          selected: 11,
          renderShapeChallenge: !this.state.renderShapeChallenge,
        });
      }
    }
    if (data.startsWith("AffirmationSelectedValue")) {
      let arr = data.split("|");
      arr.shift();
      arr = arr.join("|");
      let obj = JSON.parse(arr);
      this.setState({
        affirmationActivityStudentResponse: Number(obj?.value) + 1,
        showAffirmationNextButton: true,
        selected: 11,
      });
    }
    if (data.startsWith("ShowAffirmationStories")) {
      let arr = data.split("|");
      arr.shift();
      arr = arr.join("|");
      let obj = JSON.parse(arr);
      this.setState({
        showAffirmationStories: obj?.showAffirmationStories,
        selected: 11,
        showAffirmationNextButton: false,
        selectedActivity: obj?.selectedActivity,
        isCheckInActivity: obj?.isCheckInActivity,
        currentScreenName: obj?.currentScreenName,
      });
    }
    if (data.startsWith("showAffirmationPreviewImageStudent")) {
      let arr = data.split("|");
      console.log(arr, arr[1]);
      this.setState({
        isAffirmationPreviewImage: arr[1] == "true" ? true : false,
        selected: 11,
      });
    }
    if (data.startsWith("FeelingChartSelectedImg")) {
      let arr = data.split("|");
      arr.shift();

      let keys =
        this.state.selectedActivity === "Check In"
          ? "FeelingChartSelectedImg"
          : "FeelingChartSelectedImgCheckout";
      this.setState({
        [keys]: Number(arr[0]) + 1,

        selected: 11,
      });
    }
    if (data.startsWith("FeelingChartOpenDropBox")) {
      let arr = data.split("|");
      arr.shift();

      this.setState({
        feelingChartDropBox: true,
        selected: 11,
      });
    }
  };
  handleShowPreviewImageAffrimation = (val) => {
    this.setState({
      isAffirmationPreviewImage: val,
    });
    this.props.handleShowPreviewImageAffrimation(val);
  };
  onSendSelectedFeelingImg = (val) => {
    let keys =
      this.state?.selectedActivity === "Check In"
        ? "FeelingChartSelectedImg"
        : "FeelingChartSelectedImgCheckout";
    this.setState({
      [keys]: Number(val) + 1,
    });
    this.props.onSendSelectedFeelingImg(val);
  };

  onSendOpenDropBox = (val) => {
    this.setState({
      feelingChartDropBox: true,
    });
    this.props.onSendOpenDropBox(val);
  };
  handleChangeActivityPageNumber = (val) => {
    this.setState({
      storyBookPageNumber: Number(val) || 0,
    });

    this.props.changeAffirmationStoriesPageNumber(val);
  };
  render() {
    console.log("called");
    window.oldDataTrack = this.handleIncomingDatas;
    const { videoRoom } = this.props;
    return (
      <>
        {this.state.selected === 11
          ? this.state.mounting && (
              <MainActivity
                state={this.state.selected}
                identity={videoRoom.localParticipant.identity}
                participantMuted={
                  this.state[videoRoom?.localParticipant?.identity + "_mute"]
                }
                type={this.state.selectedActivity}
                isCheckInActivity={this.state.isCheckInActivity}
                showActivityNotification={this.state.showActivityNotification}
                handleShowActivityNotification={
                  this.handleShowActivityNotification
                }
                remoteParticipants={this?.props?.all_ids || []}
                cicoApiData={this.state.cicoApiData || {}}
                sendCicoDataToStudent={this.sendCicoDataToStudent}
                handleCloseActivity={this.handleCloseActivity}
                sendShapeChallengeImage={this.sendShapeChallengeImage}
                shapeActivityStudentResponse={
                  this.state?.shapeActivityStudentResponse || {}
                }
                shapesActivityTutorsWhiteBoardPoint={
                  this.state?.shapesActivityTutorsWhiteBoardPoint || []
                }
                sendActiveWhiteBoardData={this.sendActiveWhiteBoardData}
                renderShapeChallenge={this.state.renderShapeChallenge}
                onStudentIpadState={this.StudentIpadState}
                IpadState={this.state.studentIpadStatesss}
                sendSelectedAffirmationValue={this.sendSelectedAffirmationValue}
                affirmationActivityStudentResponse={
                  this.state?.affirmationActivityStudentResponse || ""
                }
                onSendStoriesToStudent={this.onSendStoriesToStudent}
                showAffirmationStories={this.state.showAffirmationStories}
                storyBookPageNumber={this.state.storyBookPageNumber}
                handleChangePageNumber={this.handleChangeActivityPageNumber}
                showEndActivityAnimation={this.state.showEndActivityAnimation}
                tutorName={this.props.tutorName}
                teacherActivityResponseSaved={
                  this.state.teacherActivityResponseSaved
                }
                handleSendTeacherActivityResponse={
                  this.handleSendTeacherActivityResponse
                }
                showAffirmationNextButton={this.state.showAffirmationNextButton}
                tutorMuteStatus={this.props.isMuteEnabled}
                FeelingChartSelectedImg={this.state.FeelingChartSelectedImg}
                onSendSelectedFeelingImg={this.onSendSelectedFeelingImg}
                onSendOpenDropBox={this.onSendOpenDropBox}
                resetActivityState={this.resetActivityState}
                feelingChartDropBox={this.state.feelingChartDropBox}
                FeelingChartSelectedImgCheckout={
                  this.state.FeelingChartSelectedImgCheckout
                }
                isAffirmationPreviewImage={this.state.isAffirmationPreviewImage}
                handleShowPreviewImageAffrimation={
                  this.handleShowPreviewImageAffrimation
                }
                isStudentActivityEnd={this.state.isStudentActivityEnd}
                isActivityScreenShotCapture={
                  this.state.isActivityScreenShotCapture
                }
                showCheckoutAffirmationNextBtn={
                  this.state.showCheckoutAffirmationNextBtn
                }
                onAffirmationCheckoutNextButton={
                  this.onAffirmationCheckoutNextButton
                }
                handleShapeChallengeStudentResponseSaved={
                  this.handleShapeChallengeStudentResponseSaved
                }
                isStudentShapeChallengeResponseSaved={
                  this.state.isStudentShapeChallengeResponseSaved
                }
                handleEndCheckOutActivity={this.handleEndCheckOutActivity}
                handleEndCheckInActivity={this.handleEndCheckInActivity}
              />
            )
          : ""}
      </>
    );
  }
}
