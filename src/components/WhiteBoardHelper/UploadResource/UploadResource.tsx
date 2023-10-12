import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useState } from "react";

import axios from "axios";

import BaseUrl from "../../../api/ApiConfig";

import UploadFileIcon from "@mui/icons-material/UploadFile";

import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDispatch } from "react-redux";
import { openClosedUploadResourceWhiteBoard } from "../../../redux/features/ComponentLevelDataReducer";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { ROUTERKEYCONST } from "../../../constants";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function UploadResource() {
  const dispatch = useDispatch();
  const { room } = useVideoContext();
  const { liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const [filesUpload, setFilesUpload] = useState([]);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [open, setClose] = useState(true);

  function getExtension(filename: string) {
    return filename?.split(".").pop();
  }

  const handleFileChange = (e: any) => {
    if (filesUpload.length > 0) {
      alert("You can only upload one file at a time");
      return;
    }

    let verifyExtensionFirst = getExtension(e.target.files[0]?.name);

    if (
      verifyExtensionFirst == "png" ||
      verifyExtensionFirst == "jpeg" ||
      verifyExtensionFirst == "jpg" ||
      verifyExtensionFirst == "pdf"
    ) {
      setFilesUpload([...filesUpload, e.target.files[0]]);
    } else {
      alert("Please upload only Images and Pdf");
      return;
    }
  };

  const checkFilesBeforeUploading = () => {
    if (filesUpload.length == 0) {
      alert("Please choose atleast one file to upload");
      return false;
    } else if (filesUpload.length > 1) {
      alert("Please choose one file to upload");
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
        url: `${BaseUrl}/app_teachers/upload_resource`,
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          if (response.data.status) {
            console.log("response.data", response.data);
            setUploadInProgress(false);
            setFilesUpload([]);
            dispatch(
              openClosedUploadResourceWhiteBoard(
                response?.data?.uploaded_images
              )
            );
            handleDataTrack(response?.data?.uploaded_images);
            //   callUploadResourceApiAgain();
          } else {
            alert(response.data.message);
            setUploadInProgress(false);
            setFilesUpload([]);
          }

          console.log("response", response);
        })
        .catch(function (error) {
          console.log("error response", error);
        });
    }

    console.log("hehh");
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
  return (
    <div>
      <Modal
        open={open}
        onClose={() => setClose(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-center items-center">
            <p className="text-speedMathTextColor font-semibold text-lg text-center">
              Upload Files
            </p>
          </div>
          <div className="flex w-full h-full justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md w-96">
              <label
                htmlFor="file"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-500 focus:outline-none focus:border-blue-500 transition duration-300"
              >
                <div className="text-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      width="20"
                      height="20"
                      x="2"
                      y="2"
                      rx="5"
                      ry="5"
                    ></rect>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">Select a file</p>
                </div>
              </label>

              <input
                id="file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />

              {filesUpload && (
                <div className="mt-4 text-sm text-gray-600">
                  Selected file: {filesUpload[0]?.name}
                  {filesUpload.length > 0 && (
                    <button
                      onClick={() => removeFileByName(filesUpload[0]?.name)}
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              )}

              {uploadInProgress && (
                <div className="flex justify-center items-center">
                  <CircularProgress variant="indeterminate" />
                </div>
              )}
              {filesUpload && !uploadInProgress && (
                <div className="flex justify-center items-center">
                  <button
                    disabled={uploadInProgress ? true : false}
                    onClick={handleSubmit}
                  >
                    <UploadFileIcon
                      style={{
                        color: "green",
                        fontSize: 40,
                      }}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
