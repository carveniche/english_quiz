import Toolbar from "./JSON/Toolbar.json";
import Colorbar from "./JSON/ColorPicker.json";
import PenStroke from "./JSON/PenStroke.json";
import EraserSize from "./JSON/EraserSize.json";
import { useEffect, useState } from "react";
import { isTutor, isTutorTechBoth } from "../../../utils/participantIdentity";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  openCloseUploadResourceModalTeacher,
  toggleUploadResourceDeleteModal,
} from "../../../redux/features/liveClassDetails";
import UploadResource from "../UploadResource/UploadResource";
import { getUploadResourcesList } from "../../../api";
import Button from "@mui/material/Button";
import {
  closeUploadResourceWhiteboard,
  openClosedScratchWhiteBoard,
  openClosedUploadResourceWhiteBoard,
} from "../../../redux/features/ComponentLevelDataReducer";
import { ROUTERKEYCONST, UPLOADRESOURCE } from "../../../constants";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import UploadFilesIcon from "../UploadResource/UploadResourceIcons/UploadFilesIcon";
import FilesChevronDown from "../UploadResource/UploadResourceIcons/FilesChevronDown";
import FilesUploadIcon from "../UploadResource/UploadResourceIcons/FilesUploadIcon";
import UploadResourceFileTextIcon from "../UploadResource/UploadResourceIcons/UploadResourceFileTextIcon";
import UploadResourceDelete from "../UploadResource/UploadResourceIcons/UploadResourceDelete";
import UploadResourceDeleteModal from "../UploadResource/UploadResourceDeleteModal";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { iPadDevice, isIpadDeviceChrome } from "../../../utils/devices";

export default function WhiteboardToolbar({
  handleClick,
  closeToolbarPopup,
  totalImageLength,
  currentPdfIndex,
  handleDataTrackPdfChange,
  removeClearAllBtn,
  handleScrollIpadUploadResource,
}: {
  handleClick: Function;
  closeToolbarPopup: boolean;
  totalImageLength: number;
  currentPdfIndex: number;
  removeClearAllBtn: boolean;
  handleDataTrackPdfChange: Function | undefined;
  handleScrollIpadUploadResource: Function;
}) {
  const { room } = useVideoContext();
  const [id, setId] = useState(0);
  const [key, setKey] = useState("");
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [openUploadResourcePopover, setOpenUploadResourcePopover] =
    useState(false);
  const [openPopup, setOpenPopup] = useState("");
  const [uploadResourceData, setUploadResourceData] = useState([]);
  const [uploadResourceDeleteItemDetails, setUploadResourceDeleteIdDetails] =
    useState({
      id: 0,
      name: "",
    });

  const { liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  const currentSelectedScreen = useSelector(
    (state: RootState) => state.activeTabReducer.currentSelectedRouter
  );

  const { openUploadResourceModal, uploadResourceDeleteModal } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const { isUploadResourceOpen } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );

  const { uploadResourceImages } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!closeToolbarPopup) {
      setPopoverVisible(false);
    }
  }, [closeToolbarPopup]);

  const checkUploadResourceList = async () => {
    await getUploadResourcesList(liveClassId)
      .then((res) => {
        if (res.data.status) {
          setUploadResourceData(res?.data?.resource_data);
        } else {
          setUploadResourceData([]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSelectedKey = (id: number, key: string) => {
    if (key === "FileUpload") {
      checkUploadResourceList();
      setOpenUploadResourcePopover(!openUploadResourcePopover);

      return;
    }

    setPopoverVisible(!isPopoverVisible);
    switch (id) {
      case 1: {
        setId(id);
        setKey(key);
        setOpenPopup("ColorPalette");
        break;
      }
      case 2: {
        setId(id);
        setKey(key);
        setOpenPopup("PencilStroke");
        break;
      }

      case 3: {
        setId(id);
        setKey(key);
        handleCommonClick(3, "Clear");
        break;
      }
      case 4: {
        setId(id);
        setKey(key);
        handleCommonClick(4, "Text");
        break;
      }
      case 5: {
        setId(id);
        setKey(key);
        handleCommonClick(5, "Line");
        break;
      }
      case 6: {
        setId(id);
        setKey(key);
        setOpenPopup("EraserSize");
        handleCommonClick(6, "Eraser");
        break;
      }
      case 8: {
        setId(id);
        setKey(key);
        handleCommonClick(8, "Graph");
        break;
      }
    }
  };

  const handleColorCode = (colorCode: string) => {
    let json = {
      id: id,
      value: colorCode,
      key: key,
    };
    handleClick(json);
  };

  const handlePenStroke = (penStroke: number) => {
    let json = {
      id: id,
      value: penStroke,
      key: key,
    };

    handleClick(json);
  };

  const handleEraserSize = (eraserSize: number) => {
    let json = {
      id: id,
      value: eraserSize,
      key: key,
    };

    handleClick(json);
  };

  const handleCommonClick = (id: number, key: string) => {
    let json = {
      id: id,
      key: key,
    };

    handleClick(json);
  };

  const handleDataTrack = (obj: { images: string[]; id: number }) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    let DataTrackObj = {
      pathName: ROUTERKEYCONST.whiteboard.path,
      key: ROUTERKEYCONST.whiteboard.key,
      value: {
        datatrackName: "UploadResource",
        images: obj.images,
        id: obj.id,
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const handleSelectPdf = (obj: { images: string[]; id: number }) => {
    dispatch(
      openClosedUploadResourceWhiteBoard({ images: obj.images, id: obj?.id })
    );
    handleDataTrack({ images: obj.images, id: obj.id });
  };

  const handleUploadDocumentModal = () => {
    setOpenUploadResourcePopover(!openUploadResourcePopover);
    dispatch(openCloseUploadResourceModalTeacher(!openUploadResourceModal));
  };

  const handleKeyPress = (e: any) => {
    if (Number(e.target.value) > totalImageLength) {
      return;
    }
    if (!isTutorTechBoth({ identity: String(role_name) })) {
      return;
    }
    if (Number(e.target.value) === 0) {
      return;
    }
    if (e.key === "Enter" && !isNaN(e.target.value)) {
      typeof handleDataTrackPdfChange === "function" &&
        handleDataTrackPdfChange({
          type: "pageChange",
          value: Number(e.target.value),
        });
    }
  };

  const goBackToWhiteboard = () => {
    dispatch(closeUploadResourceWhiteboard(false));
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    let DataTrackObj = {
      pathName: ROUTERKEYCONST.whiteboard.path,
      key: ROUTERKEYCONST.whiteboard.key,
      value: {
        datatrackName: UPLOADRESOURCE.closeUploadResource,
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const goBackToCoding = () => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    let DataTrackObj = {
      pathName: ROUTERKEYCONST.coding,
      key: ROUTERKEYCONST.coding,
      value: {
        status: false,
        datatrackName: "openCloseScratchWhiteBoard",
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
    dispatch(openClosedScratchWhiteBoard({ status: false }));
  };

  let newToolbar = Toolbar;
  if (removeClearAllBtn) {
    newToolbar = newToolbar.filter((item: { id: number }) => item.id !== 3);
  }

  // if (
  //   (uploadResourceImages.length > 1 && isUploadResourceOpen) ||
  //   currentSelectedScreen === "/lesson"
  // ) {
  //   newToolbar = newToolbar.filter((item: { id: number }) => item.id !== 3);
  // }

  if (
    currentSelectedScreen === "/lesson" ||
    isUploadResourceOpen ||
    !isTutorTechBoth({ identity: String(role_name) })
  ) {
    newToolbar = newToolbar.filter((item: { id: number }) => item.id !== 8);
  }

  const openUploadResourceDeleteModal = (obj: { id: number; name: string }) => {
    setUploadResourceDeleteIdDetails({
      id: obj.id,
      name: obj.name,
    });
    dispatch(toggleUploadResourceDeleteModal(!uploadResourceDeleteModal));
  };

  const handleUpdateUploadResourceApi = () => {
    checkUploadResourceList();
  };

  const scrollIpadUploadResources = (value: string) => {
    handleScrollIpadUploadResource(value);
  };

  return (
    <>
      <div className="relative z-[1]">
        <div className="flex w-full h-[40px] items-center gap-2 p-5 bg-white">
          {newToolbar.map((item, index) => (
            <button
              onClick={() => handleSelectedKey(item.id, item.key)}
              className="cursor-pointer"
              key={`whiteboardtoolbar-${index}`}
            >
              {item.key === "FileUpload" &&
              isTutor({ identity: String(role_name) }) &&
              !isUploadResourceOpen &&
              currentSelectedScreen === "/whiteboard" ? (
                <div className="flex w-[100px] justify-between items-center">
                  <UploadFilesIcon />
                  <p className="text-speedMathTextColor font-semibold text-lg">
                    Files
                  </p>
                  <FilesChevronDown />
                </div>
              ) : (
                <img src={item.image}></img>
              )}
            </button>
          ))}

          {(currentSelectedScreen === "/lesson" ||
            currentSelectedScreen === ROUTERKEYCONST.coding) && (
            <div className="flex flex-row w-[80px] justify-center items-center gap-2 ml-2">
              <input
                onKeyDown={handleKeyPress}
                type="text"
                className="border border-gray w-[35px]  pl-2
                "
                defaultValue={currentPdfIndex + 1}
              ></input>
              <p>OF</p>
              <div>{totalImageLength}</div>
            </div>
          )}

          {isUploadResourceOpen &&
            !isTutorTechBoth({ identity: String(role_name) }) &&
            currentSelectedScreen === ROUTERKEYCONST.whiteboard.path &&
            (iPadDevice || isIpadDeviceChrome) && (
              <div className="flex flex-row w-[80px] justify-center items-center gap-2 ml-2">
                <div>
                  <button onClick={() => scrollIpadUploadResources("UP")}>
                    <KeyboardDoubleArrowUpIcon
                      style={{
                        color: "blue",
                      }}
                    />
                  </button>
                </div>
                <div>
                  <button onClick={() => scrollIpadUploadResources("DOWN")}>
                    <KeyboardDoubleArrowDownIcon
                      style={{
                        color: "blue",
                      }}
                    />
                  </button>
                </div>
              </div>
            )}

          {isUploadResourceOpen &&
            isTutorTechBoth({ identity: String(role_name) }) &&
            currentSelectedScreen === ROUTERKEYCONST.whiteboard.path && (
              <div>
                <Button
                  onClick={goBackToWhiteboard}
                  variant="contained"
                  color="primary"
                  style={{ fontSize: "10px" }}
                >
                  Back to Whiteboard
                </Button>
              </div>
            )}

          {currentSelectedScreen === ROUTERKEYCONST.coding &&
            isTutorTechBoth({ identity: String(role_name) }) && (
              <div>
                <Button
                  onClick={goBackToCoding}
                  variant="contained"
                  color="primary"
                  style={{ fontSize: "10px" }}
                >
                  Back to Coding
                </Button>
              </div>
            )}
        </div>

        {isPopoverVisible &&
          !closeToolbarPopup &&
          (id === 1 || id === 2 || id === 6) && (
            <div
              className={`flex  ${
                id === 1 ? "w-[90px]" : "w-[130px]"
              }  flex-wrap absolute flex-row bg-white p-4 gap-4 shadow-md left-2`}
            >
              {id === 1 &&
                openPopup === "ColorPalette" &&
                Colorbar.map((item, index) => {
                  return (
                    <button
                      style={{ cursor: "pointer" }}
                      onClick={() => handleColorCode(item.code)}
                      key={`color-${index}`}
                    >
                      <img src={item.image}></img>
                    </button>
                  );
                })}

              {id === 2 &&
                openPopup === "PencilStroke" &&
                PenStroke.map((item, index) => {
                  return (
                    <button
                      style={{ cursor: "pointer" }}
                      onClick={() => handlePenStroke(item.strokeValue)}
                      className="flex flex-row items-center w-full p-1 gap-2"
                      key={`pencil-${index}`}
                    >
                      <div
                        style={{
                          border: "2px solid black",
                          width: "22px",
                          height:
                            item.strokeValue === 1
                              ? "0.5px"
                              : item.strokeValue === 3
                              ? "7px"
                              : "12px",
                          background: "black",
                        }}
                      ></div>
                      <p>{item.name}</p>
                    </button>
                  );
                })}

              {id === 6 &&
                openPopup === "EraserSize" &&
                EraserSize.map((item, index) => {
                  return (
                    <button
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEraserSize(item.strokeValue)}
                      className="flex flex-row items-center w-full p-1 gap-2"
                      key={`pencil-${index}`}
                    >
                      <div
                        style={{
                          border: "2px solid black",
                          width: "22px",
                          height:
                            item.strokeValue === 1
                              ? "0.5px"
                              : item.strokeValue === 3
                              ? "7px"
                              : "12px",
                          background: "black",
                        }}
                      ></div>
                      <p>{item.name}</p>
                    </button>
                  );
                })}
            </div>
          )}

        {openUploadResourcePopover && (
          <div
            className="flex flex-col
            flex-wrap w-[420px] absolute bg-white gap-4 shadow-md left-[220px]"
          >
            <div className="w-full border bg-[#E0E0E0] h-[40px] items-center justify-center">
              <button
                className="flex flex-row items-center p-2 gap-2"
                onClick={handleUploadDocumentModal}
              >
                <FilesUploadIcon />
                <p className="text-speedMathTextColor font-semibold text-sm">
                  Upload new file
                </p>
              </button>
            </div>

            {uploadResourceData?.length > 0 && (
              <div className="items-center justify-center pl-3">
                <p className="font-semibold text-base leading-6 ">
                  Previously uploaded files
                </p>
              </div>
            )}

            {uploadResourceData?.length > 0 &&
              uploadResourceData?.map(
                (
                  item: {
                    name: string;
                    id: number;
                    image_data: string[];
                    converted_status: boolean;
                  },
                  index
                ) => {
                  return (
                    <>
                      <div
                        key={`uploadresource-${index}`}
                        className="flex flex-row w-full h-full items-center pl-3 gap-2 hover:bg-[#ECEBEB] min-h-[40px] cursor-pointer"
                      >
                        <div className="flex w-[10%] h-full">
                          <div className="flex w-[28px] h-[28px] border border-[#ECEBEB] bg-[#ECEBEB] justify-center items-center">
                            <UploadResourceFileTextIcon />
                          </div>
                        </div>
                        <div className="flex w-[80%] h-full">
                          <p
                            onClick={
                              item.converted_status
                                ? () =>
                                    handleSelectPdf({
                                      images: item.image_data,
                                      id: item?.id,
                                    })
                                : undefined
                            }
                            className={`font-semibold leading-4 tracking-normal text-left ${
                              !item.converted_status ? "opacity-50" : ""
                            }`}
                          >
                            {item?.name}
                          </p>
                        </div>
                        {item.converted_status ? (
                          <div
                            onClick={() =>
                              openUploadResourceDeleteModal({
                                id: item.id,
                                name: item?.name,
                              })
                            }
                            className="flex w-[10%] h-full justify-center items-center cursor-pointer"
                          >
                            <UploadResourceDelete />
                          </div>
                        ) : (
                          <div className="flex w-[10%] h-full justify-center items-center cursor-pointer">
                            <CircularProgress
                              style={{
                                color: "blue",
                                width: "25px",
                                height: "25px",
                              }}
                              variant="indeterminate"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  );
                }
              )}
          </div>
        )}
      </div>

      {openUploadResourceModal && <UploadResource />}

      {uploadResourceDeleteModal && (
        <UploadResourceDeleteModal
          uploadItemsDetails={uploadResourceDeleteItemDetails}
          handleUpdateUploadResourceApi={handleUpdateUploadResourceApi}
        />
      )}
    </>
  );
}
