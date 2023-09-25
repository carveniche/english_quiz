import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import AWS from "aws-sdk";
import {
  recordingUpdateToServer,
  doCreateLiveClassRecordings,
  doPartUploadingStatus,
  recordingFailedError,
  getAllRecordingUploadId,
  checkRecordingStatus,
} from "../../api";
import { submitErrorLog } from "../../api";
import moment from "moment-timezone";
import { mapToArray } from "../../utils/common";
import { useDispatch } from "react-redux";
import { startAndStopRecordingRecording } from "../../redux/features/liveClassDetails";
import RecordingStepModal from "./Modal/RecordingStepModal";
import RecordingPermissionModal from "./Modal/RecordingPermissionModal";
var stream;
var recorder;

AWS.config.region = "ap-south-1"; // Region
AWS.config.update({
  correctClockSkew: true,
});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "ap-south-1:b06bcd03-3bde-4dd0-a552-7e68221a75d2",
});
AWS.config.credentials.get(function (err) {
  if (err) console.log(err);
});

let tempChunks = [];
let chunkCount = 0;
let combinedStream;

const recordingIntervalTime = 15000;
const minRecordingSize = 6242880;

const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const _UPLOAD_STATUS = "_UPLOAD_STATUS";
const _FILE_KEY = "_FILE_KEY";
const _UPLOAD_ID = "_UPLOAD_ID";
const _UPLOAD_PART_ARRAY = "_UPLOAD_PART_ARRAY";

let multipartCreateResult;
let uploadPromiseResult;
let uploadPartResults = [];
let completeUploadResponse;
let multipartUploadId = "";
let multiPartFileKey = "";
var bucketName = "begalileo-liveclass-recordings";
let search = window.location.search;
let params = new URLSearchParams(search);
let live_class_id = params.get("liveClassID");
let user_id = params.get("userID");
let recordingID = 0;

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: bucketName },
});
let source2 = [];
let context = "";
let source1 = "";
let destination = "";
let biquadFilter = "";
function getCurrentDateInFormat() {
  const dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var momentDate = moment().tz("Asia/Kolkata").format();
  let dates = momentDate.split("T")[0];
  dates = dates.split("-");
  for (let i = 0; i < dates.length; i++) dates[i] = Number(dates[i]);
  dates = dates.join("");

  let y = year + "" + month + "" + day;

  return dates;
}
var dateValue = getCurrentDateInFormat();
var fileName =
  live_class_id +
  "_" +
  dateValue +
  "_" +
  Math.floor(Date.now() / 1000) +
  ".webm";

var fileKey = "live-class-recordings/" + getFileDate() + "/" + fileName;

function niceBytes(x) {
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}
let desktopStream;
function getFileDate() {
  const dateObj = new Date();

  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  if (month < 10) month = "0" + month;
  var day = dateObj.getUTCDate();
  if (day < 10) day = "0" + day;
  var year = dateObj.getUTCFullYear();
  var momentDate = moment().tz("Asia/Kolkata").format();
  let dates = momentDate.split("T")[0];

  return dates;
}

let blob = [];

const ScreenRecording = forwardRef((props, ref) => {
  const [status, setStatus] = useState(false);
  const [isUploading, setIsUploading] = useState("None");
  const localParticipantAudioChangeRef = useRef(null);
  const [isRecordingDone, setIsRecordingDone] = useState(false);
  const recordingRef = useRef(false);
  const finalPartRef = useRef(false);
  const isFinalPartUploaded = useRef(false);
  const [completeExecuted, setCompleteExecuted] = useState(false);
  const [showteacherRecordingPopup, setShowTeacherRecordingPopUp] =
    useState(false);
  const [uploadQueue, setUploadQueue] = useState(0);

  const [time, setTime] = useState(0);

  const [running, setRunning] = useState(false);
  const [teacherGiveRecordingPermission, setTeacherGiveTeacherPermission] =
    useState(true);
  const [recordingSlogan, setSlogan] = useState(false);

  const [recordingStepsModal, setRecordingStepsModal] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    let interval;
    if (running) {
      dispatch(startAndStopRecordingRecording(true));
      // interval = setInterval(() => {
      //   setTime((prevTime) => prevTime + 10);
      // }, 10);
    } else if (!running) {
      // clearInterval(interval);
      dispatch(startAndStopRecordingRecording(false));
    }
    return () => {
      dispatch(startAndStopRecordingRecording(false));
    };
  }, [running]);

  useEffect(() => {
    console.log("Upload Queue", uploadQueue);
    console.log("is Uploading", isUploading);
    // if (recorder != undefined && recorder.state == "inactive" && isUploading == 'COMPLETED' && uploadQueue < 1)
    //   onAllRecordingCompleted()
  }, [uploadQueue, isUploading, status]);
  useEffect(() => {
    return () => {
      console.log("recording has stoped", recorder);
      stopRecording();
    };
  }, []);
  useImperativeHandle(ref, () => ({
    leaveClassStopRecording() {
      console.log("Leave Class Stop Recording");
      if (recorder != undefined) {
        stopRecording();
      }
    },
    localParticipantMutedStatus(stat) {
      console.log("Mute Status", stat);
      if (combinedStream?.getAudioTracks() !== undefined)
        combinedStream.getAudioTracks()[0].enabled = !stat;
    },
    checkRecordingStatus() {
      return status;
    },

    startRecordingOnClassStart() {
      console.log("Inside ScreenRecording Component");
      startRecording();
    },
  }));

  useEffect(() => {
    if (props.userJoined) {
      console.log("User Joined");

      setTimeout(() => {
        console.log("Status  ", recorder);
        if (recorder == undefined) setShowTeacherRecordingPopUp(true);
      }, 3000);
    }
  }, []);

  function startExtension() {
    var checkbox = $('input[type="checkbox"]');
    if ($(checkbox).prop("checked")) {
      startRecording();
    } else {
      //  stopRecording();
    }
  }
  props.screenRecordingRef2.current = stopRecording;
  async function onAllRecordingCompleted() {
    console.log("All recording completed");
    try {
      console.log("last part upload");
    } catch (e) {
    } finally {
      console.log("list part upload");
      listAndEndRecordingParts();
    }
  }

  function onRecording(data) {
    console.log("E data", data.size);
    let isAudioTrackEnabled = true;
    props.room.localParticipant.audioTracks.forEach(function (audioTrack) {
      console.log("Audio Track", audioTrack.isTrackEnabled);
      isAudioTrackEnabled = audioTrack.isAudioTrackEnabled;
    });
    tempChunks.push(data);

    //combinedStream.getAudioTracks()[0].enabled = false;

    console.log("Combined Streams", combinedStream.getAudioTracks()[0]);
    if (finalPartRef.current) {
      uploadLastPartToStorage(s3);
      tempChunks = [];
      return;
    }
    const result = tempChunks.reduce(
      (total, current) => (total = total + current.size),
      0
    );
    console.log("Total Size ", niceBytes(result));

    if (result > minRecordingSize) {
      console.log("Upload recording ", niceBytes(result));

      uploadToStorage(s3);
      tempChunks = [];
    }
  }

  async function initalizeRecording() {
    // if (!props.recordingEnabled) props.setRecordingEnabledStatus();
    // let desktopStream, voiceStream;
    let voiceStream;
    voiceStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { deviceId: "default", echoCancellation: false },
    });

    const tracks = [
      ...desktopStream.getVideoTracks(),
      ...mergeAudioStreams(desktopStream, voiceStream),
    ];

    console.log("Tracks to add to stream", tracks);
    combinedStream = new MediaStream(tracks);

    recorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm; codecs=vp8,opus",
    });

    recorder.ondataavailable = (e) => {
      // blob.push(e.data)
      onRecording(e.data);
    };
    recorder.onstart = (e) => {
      console.log("On Recroding Started", e);

      onRecordingStarted(e);
    };

    recorder.onstop = (e) => {
      console.log("Recoridng stopped", combinedStream);
      finalPartRef.current = true;
      combinedStream
        .getTracks() // get all tracks from the MediaStream
        .forEach((track) => track.stop()); // stop each of them
      setIsRecordingDone(true);
    };

    recorder.start(recordingIntervalTime);
  }

  async function createNewRecording() {
    // var params = {
    //   Bucket: bucketName,
    //   Key: fileKey,
    //   ACL: "public-read",
    //   ContentType: "video/webm",
    //   StorageClass: "STANDARD",
    // };

    // var s3CreateRecording = new Promise(function (resolve, reject) {
    //   s3.createMultipartUpload(params, function (err, data) {
    //     if (err) {
    //       console.debug("Failed List params", err)
    //       reject(err);
    //     } else {
    //       resolve(data);
    //     }
    //   });
    // });

    // s3CreateRecording.then(
    //   function (value) {
    //     console.log("Listing Parts", value.Parts.length);
    //     var uploadResultIndexed = [];

    //     value.Parts.map((data) => {
    //
    //       uploadResultIndexed.push({
    //         PartNumber: data.PartNumber,
    //         ETag: data.ETag,
    //       });
    //     });
    //     console.log("uploadResultIndexed", uploadResultIndexed.length);

    //     chunkCount = uploadResultIndexed.length - 1;
    //     console.log("Resumart count", chunkCount)
    //     initalizeRecording()

    //   },
    //   function (err) {

    //     console.log("Listing Parts failed", err);

    //   }
    // );

    s3.createMultipartUpload(
      {
        Bucket: bucketName,
        Key: fileKey,
        ACL: "public-read",
        ContentType: "video/webm",
        StorageClass: "STANDARD",
      },
      async function (err, data) {
        if (err) {
          errorUpdationMultipartCreatingError(err);
          console.log("Error in creating multipart");
          recordingRef.current = false;
        } else {
          console.log("MultipartUploadId", data.UploadId);
          console.log("MultipartFileKey", data.Key);
          multipartUploadId = data.UploadId;
          multiPartFileKey = data.Key;
          let datas = await updateUploadIdToServer();
          if (datas?.status) recordingID = datas?.recording_id;
          else
            submitErrorLog(
              user_id,
              live_class_id,
              `recording id not found ${datas?.recording_id}`,
              datas?.recording_id
            );
          console.log(recordingID);
          initalizeRecording();
        }
      }
    );
  }
  const handleStopSharingBtn = () => {
    alert(
      "You can not click on the stop sharing button during class, please rejoin again."
    );
    window.location.reload();
  };
  async function startRecording() {
    if (recordingRef.current) return;
    recordingRef.current = true;

    try {
      if (desktopStream) {
        desktopStream
          .getTracks()[0]
          .removeEventListener("ended", handleStopSharingBtn);
      }
      desktopStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor",
        },
        audio: { deviceId: "default", echoCancellation: false },
      });
      console.log("Display Stream", desktopStream);
      desktopStream
        .getTracks()[0]
        .addEventListener("ended", handleStopSharingBtn);

      let userOperatingSys = props.userOperatingSystemName;
      let audioDeviceTest = desktopStream.getAudioTracks()?.length || 0;

      if (audioDeviceTest < 1 && userOperatingSys === "Windows") {
        var tracks = desktopStream.getTracks();
        recordingRef.current = false;
        console.log("Tracks", tracks);
        for (let i = 0; i < tracks.length; i++) {
          tracks[i].stop();
        }
        setRecordingStepsModal(true);
        return;
      } else {
        setRecordingStepsModal(false);
      }
      setShowTeacherRecordingPopUp(false);
    } catch (err) {
      recordingRef.current = false;
      if (err.message === "Permission denied") {
        let result = -1;
        setShowTeacherRecordingPopUp(true);
        setSlogan(true);
        return result;
      }
      console.log("Err", err.message);
    }

    checkRecordingStatus(live_class_id).then((resp) => {
      console.log("Reponse ", resp.data);
      const data = resp.data;
      if (data.status) {
        alert("Recording is already completed");
        return;
      } else {
        console.log("Start new Recording");
        createNewRecording();
      }
    });

    return;
  }

  async function updateUploadIdToServer() {
    try {
      let { data } = await doCreateLiveClassRecordings(
        live_class_id,
        multipartUploadId,
        multiPartFileKey
      );
      return data;
    } catch (e) {
      console.log("recording ", e);
      await submitErrorLog(
        user_id,
        live_class_id,
        "error while uploading upload id",
        0
      );
      return { status: false };
    }
  }

  function mergeAudioStreams(desktopStream, voiceStream) {
    context = new AudioContext();
    destination = context.createMediaStreamDestination();
    let hasDesktop = false;
    let hasVoice = false;
    biquadFilter = context.createBiquadFilter();
    biquadFilter.type = "highshelf";
    biquadFilter.frequency.value = 1000;
    biquadFilter.gain.value = 0.7;
    let mediaStreamTrack = twilioAudioContext() || [];
    for (let i = 0; i < mediaStreamTrack?.length; i++) {
      if (
        mediaStreamTrack[i] &&
        mediaStreamTrack[i]?.getAudioTracks().length > 0
      ) {
        source2[i] = context.createMediaStreamSource(mediaStreamTrack[i]);

        source2[i].connect(biquadFilter); //.connect(destination);//source2[i].connect(biquadFilter)//
        hasVoice = true;
      }
    }
    let localTwilioAudio = twilioLocalParticipantTrack();

    if (
      localTwilioAudio &&
      typeof localTwilioAudio?.getAudioTracks == "function" &&
      localTwilioAudio.getAudioTracks().length > 0
    ) {
      console.log("Twilio audio.....");
      source1 = context.createMediaStreamSource(localTwilioAudio);

      source1.connect(biquadFilter).connect(destination);
      hasVoice = true;
    } else if (voiceStream && voiceStream.getAudioTracks().length > 0) {
      source1 = context.createMediaStreamSource(voiceStream);

      source1.connect(biquadFilter).connect(destination);
      hasVoice = true;
    }

    return hasDesktop || hasVoice ? destination.stream.getAudioTracks() : [];
  }

  function onRecordingStarted(e) {
    setRunning(true);
    setStatus(true);
  }

  async function checkRecordingList() {
    var params = {
      Bucket: bucketName,
      Key: multiPartFileKey,
      UploadId: multipartUploadId,
    };

    var s3ListParts = new Promise(function (resolve, reject) {
      s3.listParts(params, function (err, data) {
        if (err) {
          console.debug("Failed List params", err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    s3ListParts.then(
      function (value) {
        var uploadResultIndexed = [];

        value.Parts.map((data) => {
          uploadResultIndexed.push({
            PartNumber: data.PartNumber,
            ETag: data.ETag,
          });
        });
        let lastItem = 0;
        if (uploadResultIndexed.length > 0)
          lastItem =
            uploadResultIndexed[uploadResultIndexed.length - 1].PartNumber;

        console.log("Size of the index", uploadResultIndexed.length);
        console.log("last Part anumnber", lastItem);
        console.log("uploadResultIndexed", uploadResultIndexed.length);

        chunkCount = lastItem;

        initalizeRecording();
      },
      function (err) {
        sendUploadingError(err);
        console.log("Listing Parts failed", err);
        // alert(
        //   "Looks like this class is already completed, please contact tech support"
        // );
        setShowTeacherRecordingPopUp(false);
      }
    );
  }
  const allPartDetails = (value, recording_id, lastPart) => {
    var uploadResultIndexed = [];

    value?.map((data) => {
      uploadResultIndexed.push({
        PartNumber: data.PartNumber,
        ETag: data.ETag,
      });
    });
    let uploadedParts = [...uploadResultIndexed];
    uploadedParts.sort((a, b) => a.PartNumber - b.PartNumber);
    let missingParts = [];
    if (lastPart) {
      if (uploadedParts?.length < chunkCount) {
        for (let i = 0; i < chunkCount; i++) {
          let isMissed = true;
          console.log(uploadedParts[i]?.PartNumber, i + 1);
          for (let item of uploadedParts) {
            if (item?.PartNumber === i + 1) {
              isMissed = false;
              break;
            }
          }
          if (isMissed) missingParts.push({ part: i + 1 });
        }
        sendUploadingError(JSON.stringify(missingParts), "", recording_id);
      } else {
        sendUploadingError("no errror", "", recording_id);
      }
    } else {
      for (let i = 0; i < uploadedParts.length; i++) {
        let isMissed = true;
        for (let item of uploadedParts) {
          if (item?.PartNumber === i + 1) {
            isMissed = false;
            break;
          }
        }
        if (isMissed) missingParts.push({ part: i + 1 });
      }
      if (missingParts.length)
        sendUploadingError(JSON.stringify(missingParts), "", recording_id);
    }

    return [...uploadResultIndexed];
  };
  async function listAndEndRecordingParts() {
    let uploadId = [];
    try {
      uploadId = await getAllRecordingUploadId(live_class_id);
      uploadId = uploadId?.data?.live_class_recording_details || [];
    } catch (e) {}

    console.log(uploadId);

    let i = 0;
    let promiseArr = [];
    for (let item of uploadId) {
      var params = {
        Bucket: bucketName,
        Key: item?.file_key,
        UploadId: item?.upload_id,
      };
      let s3ListParts = new Promise(function (resolve, reject) {
        s3.listParts(params, function (err, data) {
          if (err) {
            console.debug("Failed List params", err);
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
      promiseArr.push(s3ListParts);
    }

    for (let i = 0; i < promiseArr.length; i++) {
      try {
        let data = await promiseArr[i];
        let parts = data?.Parts || [];
        let uploadResultIndexed = allPartDetails(
          parts,
          uploadId[i]?.recording_id,
          i === uploadId.length - 1
        );
        //  let details= await recordEndingPart(
        //     uploadId[i]?.file_key,
        //     uploadId[i]?.upload_id,
        //     [...uploadResultIndexed]
        //   );
      } catch (e) {
        sendUploadingError(e, "", uploadId[i]?.recording_id);
      }
    }
  }

  const sendUploadingError = async (e, partsNumber = "", recording_id) => {
    try {
      let body = {
        live_class_id: live_class_id,
        error_info: e,
        recording_id: recordingID,
        part_no: partsNumber?.PartNumber ?? "",
      };
      let formData = new FormData();
      formData.append("error_info", e);
      formData.append("recording_id", recording_id ?? recordingID);
      formData.append("part_no", partsNumber?.PartNumber ?? "");

      let y = await recordingFailedError(formData);
    } catch (e) {
      console.log(e);
    }
  };

  const errorUpdationMultipartCreatingError = async (e, partsNumber = "") => {
    try {
      let body = {
        live_class_id: live_class_id,
        error_info: e,
        recording_id: "",
        part_no: partsNumber?.PartNumber ?? "",
      };

      let formData = new FormData();
      formData.append("error_info", e);
      formData.append("recording_id", "");
      formData.append("part_no", partsNumber?.PartNumber ?? "");
      formData.append("live_class_id", live_class_id);

      let y = await recordingFailedError(formData);
    } catch (e) {
      console.log(e);
    }
  };
  async function recordEndingPart(mFileKey, mUploadId, mUploadPart) {
    if (completeExecuted) return;

    var params = {
      Bucket: bucketName,
      Key: mFileKey,
      MultipartUpload: {
        Parts: mUploadPart,
      },
      UploadId: mUploadId,
    };

    var s3CompletePromise = new Promise(function (resolve, reject) {
      s3.completeMultipartUpload(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    return s3CompletePromise;

    // completeUploadResponse = await s3
    //   .completeMultipartUpload({
    //     Bucket: bucketName,
    //     Key: mFileKey,
    //     MultipartUpload: {
    //       Parts: mUploadPart,
    //     },
    //     UploadId: mUploadId,
    //   })
    //   .promise();
  }

  function doChangeUploadingProgress(uploadStat) {
    setIsUploading(uploadStat);
    if (uploadStat == "COMPLETED") setUploadQueue((prevValue) => prevValue - 1);
  }

  function onSuccessUploadCompletion() {
    setCompleteExecuted(false);
    recordingUpdateToServer(live_class_id, fileName, recordingID);
    setCompleteExecuted(true);
    chunkCount = 0;
  }

  async function stopRecording() {
    console.log("recording has stoped");
    if (!recorder) return;
    console.log(desktopStream);
    recorder.stop();
    if (desktopStream) {
      let tracks = desktopStream.getTracks();
      tracks.forEach((item) => item.stop());
    }
    setRunning(false);
    setTime(0);
    setStatus(false);
    onAllRecordingCompleted();

    //  clearInterval(recordingIntervalID)
  }

  function uploadToStorage(s3) {
    chunkCount++;
    let actucalChunksValue = chunkCount;
    setUploadQueue((prevValue) => prevValue + 1);

    var blob = new Blob(tempChunks, { type: tempChunks[0].type });
    console.log("Uploading started Part NUmber", chunkCount);
    console.log("Upload ID and File Key", multiPartFileKey, multipartUploadId);
    var params = {
      Body: blob,
      Bucket: bucketName,
      Key: multiPartFileKey,
      PartNumber: chunkCount,
      UploadId: multipartUploadId,
    };

    var s3UploadPromise = new Promise(function (resolve, reject) {
      console.log("IS Uploading", isUploading);
      doChangeUploadingProgress("PROGRESS");
      s3.uploadPart(params, function (err, data) {
        if (err) {
          sendUploadingError(err, params);
          console.log("dddderrr", err);
          reject(err);
        } else {
          console.log("Upload result", data);
          resolve(data.ETag);
        }
      });
    });

    s3UploadPromise.then(
      function (value) {
        doChangeUploadingProgress("COMPLETED");
        console.log("Success on uploading", value);
        uploadPartResults.push({
          PartNumber: chunkCount,
          ETag: value,
        });
        doPartUploadingStatus(recordingID, actucalChunksValue, value);

        console.log("Recorder button", status.toString());
        console.log("IS Uploading", isUploading);
        console.log("IS RECORDING DONE ", isRecordingDone.toString());
      },
      function (err) {
        doChangeUploadingProgress("COMPLETED");
        sendUploadingError(err, { PartNumber: chunkCount });
        console.error("Error on uploading", err);
      }
    );
  }
  function uploadLastPartToStorage(s3) {
    if (isFinalPartUploaded.current) return;
    isFinalPartUploaded.current = true;
    if (!tempChunks.length) return;
    chunkCount++;
    setUploadQueue((prevValue) => prevValue + 1);
    var blob = new Blob(tempChunks, { type: tempChunks[0].type });
    console.log("Uploading started Part NUmber", chunkCount);
    console.log("Upload ID and File Key", multiPartFileKey, multipartUploadId);
    var params = {
      Body: blob,
      Bucket: bucketName,
      Key: multiPartFileKey,
      PartNumber: chunkCount,
      UploadId: multipartUploadId,
    };

    var s3UploadPromise = new Promise(function (resolve, reject) {
      console.log("IS Uploading", isUploading);
      doChangeUploadingProgress("PROGRESS");
      s3.uploadPart(params, function (err, data) {
        if (err) {
          sendUploadingError(err, params);
          console.log("dddderrr", err);
          reject(err);
        } else {
          console.log("Upload result", data);
          resolve(data.ETag);
        }
      });
    });

    return s3UploadPromise;
  }

  function getCurrentTimer() {
    return (
      Math.floor((time / 60000) % 60) + ":" + Math.floor((time / 1000) % 60)
    );
  }
  const twilioAudioContext = () => {
    let participants = mapToArray(props.room.participants);
    console.log({ participants });
    let mediaStream = [];
    for (let part of participants) {
      let tracks = part?.tracks;
      tracks = mapToArray(tracks);
      tracks?.map((item) => {
        if (item?.track?.kind == "audio") {
          if (typeof item?.track?.attach === "function") {
            mediaStream.push(item.track.attach().srcObject);
          }
        }
      });
    }
    return mediaStream;
  };
  const twilioLocalParticipantTrack = () => {
    let localTwilioAudio = "";
    let localParticpant = props?.room?.localParticipant?.audioTracks;
    if (localParticpant?.constructor === Map) {
      let tracks = mapToArray(localParticpant);

      for (let item of tracks) {
        if (item?.track?.kind === "audio") {
          if (typeof item?.track?.attach === "function") {
            localTwilioAudio = item?.track?.attach()?.srcObject;
            break;
          }
        }
      }
    }
    if (
      localTwilioAudio &&
      typeof localTwilioAudio?.getAudioTracks == "function" &&
      localTwilioAudio.getAudioTracks().length > 0
    ) {
      return localTwilioAudio;
    }
    return false;
  };
  const handleParticipateConnected = (participant) => {
    let running = false;
    setRunning((prev) => {
      running = prev;
      return prev;
    });

    setTimeout(() => {
      if (!context) return;
      for (let item of source2) {
        typeof item?.disconnect === "function" && item.disconnect();
      }
      let mediaStream = twilioAudioContext() || [];
      console.log(mediaStream);
      for (let i = 0; i < mediaStream.length; i++) {
        if (mediaStream[i]) {
          source2[i] = context.createMediaStreamSource(mediaStream[i]);

          source2[i].connect(biquadFilter).connect(destination); //.connect(destination);
        }
      }
    }, 5000);
  };
  const localParticipantDeviceChanges = () => {
    if (!source1 || !context) return;
    if (typeof source1.disconnect === "function") {
      source1.disconnect();

      let twilioAudioTrack = twilioLocalParticipantTrack();
      if (twilioAudioTrack) {
        console.log("device has changed");
        source1 = context.createMediaStreamSource(twilioAudioTrack);
        source1.connect(biquadFilter);
      }
    }
  };
  const addDeviceChangeEventListner = (e) => {
    clearTimeout(localParticipantAudioChangeRef.current);
    let running = false;
    setRunning((prev) => {
      running = prev;
      return prev;
    });

    localParticipantAudioChangeRef.current = setTimeout(() => {
      localParticipantDeviceChanges();
    }, 5000);
  };

  useEffect(() => {
    handleParticipateConnected();
    // props?.room?.on("participantConnected", handleParticipateConnected);
  }, [props?.participantLength]);
  useEffect(() => {
    navigator.mediaDevices.addEventListener(
      "devicechange",
      addDeviceChangeEventListner
    );
  }, []);
  return (
    <>
      {recordingStepsModal && (
        <RecordingStepModal
          recordingStepsModal={recordingStepsModal}
          startRecording={startRecording}
          setShowTeacherRecordingPopUp={setShowTeacherRecordingPopUp}
        />
      )}
      <RecordingPermissionModal
        showteacherRecordingPopup={showteacherRecordingPopup}
        setShowTeacherRecordingPopUp={setShowTeacherRecordingPopUp}
        recordingSlogan={recordingSlogan}
        startRecording={startRecording}
      />
    </>
  );
});

export default ScreenRecording;
