import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import BaseUrl from "../../../api/ApiConfig";

import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDispatch } from "react-redux";
import { openClosedUploadResourceWhiteBoard } from "../../../redux/features/ComponentLevelDataReducer";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { ROUTERKEYCONST } from "../../../constants";
import CustomAlert from "../../DisplayCustomAlert/CustomAlert";
import { openCloseUploadResourceModalTeacher } from "../../../redux/features/liveClassDetails";
import SelectFileIcon from "./UploadResourceIcons/SelectFileIcon";
import UploadResourceFileTextBigIcon from "./UploadResourceIcons/UploadResourceFileTextBigIcon";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  height: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function UploadResource() {
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);
  const { room } = useVideoContext();
  const { liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const [filesUpload, setFilesUpload] = useState([]);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [open, setClose] = useState(true);

  const [openAlertBox, setOpenAlertBox] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertWarningType, setAlertWarningType] = useState<
    "info" | "error" | "warning" | undefined
  >("info");

  function getExtension(filename: string) {
    return filename?.split(".").pop();
  }

  function bytesToMB(bytes) {
    return Number((bytes / (1024 * 1024)).toFixed(2));
  }

  const handleFileChange = (e: any) => {
    if (filesUpload.length > 0) {
      setAlertMessage("You can only upload one file at a time");
      setOpenAlertBox(true);
      return;
    }

    let verifyExtensionFirst = getExtension(e.target.files[0]?.name);

    console.log("verifyExtensionFirst", verifyExtensionFirst);

    let checkFileSize = bytesToMB(e.target.files[0]?.size);

    if (checkFileSize > 10) {
      setAlertMessage("Please upload files below 10 MB");
      setOpenAlertBox(true);
      return;
    }

    if (
      verifyExtensionFirst == "png" ||
      verifyExtensionFirst == "jpeg" ||
      verifyExtensionFirst == "jpg" ||
      verifyExtensionFirst == "pdf"
    ) {
      setFilesUpload([...filesUpload, e.target.files[0]]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setOpenAlertBox(true);
      setAlertMessage("Please upload only Images and Pdf");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }
  };

  const checkFilesBeforeUploading = () => {
    console.log("filesUpload", filesUpload.length);
    if (filesUpload.length == 0) {
      setOpenAlertBox(true);
      setAlertMessage("Please choose atleast one file to upload");
      return false;
    } else if (filesUpload.length > 1) {
      setOpenAlertBox(true);
      setAlertMessage("Please choose one file to upload");
      return false;
    } else {
      return true;
    }
  };

  const handleDataTrack = (images: []) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    let DataTrackObj = {
      pathName: ROUTERKEYCONST.whiteboard.path,
      key: ROUTERKEYCONST.whiteboard.key,
      value: {
        datatrackName: "UploadResource",
        images: images,
        id: 0,
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let verifyFirst = checkFilesBeforeUploading();

    if (verifyFirst) {
      setUploadInProgress(true);

      var formdata = new FormData();
      formdata.append("live_class_id", String(liveClassId));
      formdata.append("upload", filesUpload[0], filesUpload[0].name);

      axios({
        method: "post",
        url: `${BaseUrl}/app_teachers/upload_resource_new`,
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          console.log("response", response);
          if (response.data.status) {
            if (response.data.converted_status) {
              setUploadInProgress(false);
              setFilesUpload([]);
              dispatch(
                openClosedUploadResourceWhiteBoard({
                  images: response?.data?.uploaded_images,
                  id: 0,
                })
              );
              dispatch(openCloseUploadResourceModalTeacher(false));
              handleDataTrack(response?.data?.uploaded_images);
            } else {
              setUploadInProgress(false);
              setAlertMessage(
                "File are uploading please wait for sometime to get them uploaded"
              );
              setOpenAlertBox(true);
              setAlertWarningType("info");
              setFilesUpload([]);
            }
          } else {
            setAlertMessage(response.data.message);
            setFilesUpload([]);
            setAlertWarningType("error");
            setUploadInProgress(false);
            setOpenAlertBox(true);
            setFilesUpload([]);
          }
        })
        .catch(function () {
          setUploadInProgress(false);
          setFilesUpload([]);
          setOpenAlertBox(true);
          setAlertMessage("Please try again after some time");
          setAlertWarningType("error");
          setTimeout(() => {
            dispatch(openCloseUploadResourceModalTeacher(false));
          }, 1500);
        });
    }
  };

  const removeFileByName = (fileName) => {
    let filterData = filesUpload?.filter((item) => {
      if (item?.name == fileName) {
        return false;
      } else {
        return true;
      }
    });

    setFilesUpload(filterData);
  };

  useEffect(() => {
    if (
      alertMessage ===
      "File are uploading please wait for sometime to get them uploaded"
    ) {
      dispatch(openCloseUploadResourceModalTeacher(false));
    }
  }, [openAlertBox]);

  const closeModalFn = () => {
    setClose(false);
    dispatch(openCloseUploadResourceModalTeacher(false));
  };

  return (
    <div>
      <Modal
        open={open}
        // onClose={() => setClose(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-end">
            <IconButton
              size="medium"
              aria-label="close"
              color="inherit"
              onClick={() => closeModalFn()}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          <div className="flex flex-col">
            <div className="flex w-full h-full  justify-center items-center">
              <div className="bg-white p-8 rounded shadow-md w-96">
                {filesUpload.length > 0 ? (
                  <div className="flex flex-col justify-center items-center w-full h-full border border-[#ECEBEB] rounded p-5">
                    <div className="flex w-[60px] h-[60px] justify-center items-center border-[#ECEBEB] bg-[#ECEBEB] rounded">
                      <UploadResourceFileTextBigIcon />
                    </div>
                    <div className="flex justify-center items-center mt-5">
                      <p className="font-semibold leading-4 tracking-normal text-center">
                        {filesUpload[0]?.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="file"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-300"
                  >
                    <div className="text-center cursor-pointer">
                      <SelectFileIcon />
                      <p className="mt-1 text-sm text-gray-600">
                        Select a file
                      </p>
                    </div>
                  </label>
                )}

                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept=".pdf, .jpeg, .jpg, .png"
                />

                <div className="flex flex-col w-full h-[90px] mt-5">
                  {filesUpload && !uploadInProgress ? (
                    <div className="flex w-full h-full justify-center mt-3">
                      <button
                        disabled={uploadInProgress ? true : false}
                        onClick={handleSubmit}
                        className="flex justify-center items-center w-[153px] h-[26px] p-4 8 4 8 bg-[#3E49FF] rounded-full gap-4 "
                      >
                        <p className="font-semibold leading-4 tracking-normal text-[#F2F2F2] text-center">
                          Upload and open
                        </p>
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-full h-full justify-center mt-3">
                      <button className="flex flex-row justify-center items-center w-[153px] h-[36px] p-4 8 4 8 bg-[#3E49FF] rounded-full gap-4 ">
                        <div className="flex justify-center items-center">
                          <CircularProgress
                            style={{
                              color: "white",
                              width: "25px",
                              height: "25px",
                            }}
                            variant="indeterminate"
                          />
                        </div>
                        <p className="font-semibold leading-4 tracking-normal text-white text-center">
                          Uploading...
                        </p>
                      </button>
                    </div>
                  )}

                  <div className="flex w-full h-full justify-center">
                    {filesUpload.length > 0 && (
                      <button
                        onClick={() => removeFileByName(filesUpload[0]?.name)}
                      >
                        <p className="font-semibold text-base leading-6 ">
                          Remove File
                        </p>
                      </button>
                    )}
                  </div>
                </div>
                {/* )} */}
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {alertMessage !== "" && (
        <CustomAlert
          variant={alertWarningType}
          headline={alertMessage}
          open={openAlertBox}
          handleClose={() => setOpenAlertBox(false)}
        />
      )}
    </div>
  );
}
