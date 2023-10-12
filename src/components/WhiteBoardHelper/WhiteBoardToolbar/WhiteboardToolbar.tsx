import Toolbar from "./JSON/Toolbar.json";
import Colorbar from "./JSON/ColorPicker.json";
import PenStroke from "./JSON/PenStroke.json";
import { useEffect, useState } from "react";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import { isTutor } from "../../../utils/participantIdentity";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { openCloseUploadResourceModalTeacher } from "../../../redux/features/liveClassDetails";
import UploadResource from "../UploadResource/UploadResource";
import UploadIcon from "./UploadIcon.png";
import { getUploadResourcesList } from "../../../api";
import Button from "@mui/material/Button";
import { openClosedUploadResourceWhiteBoard } from "../../../redux/features/ComponentLevelDataReducer";
import { ROUTERKEYCONST } from "../../../constants";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";

export default function WhiteboardToolbar({
  handleClick,
  closeToolbarPopup,
}: {
  handleClick: Function;
  closeToolbarPopup: boolean;
}) {
  const { room } = useVideoContext();

  const [id, setId] = useState(0);
  const [key, setKey] = useState("");
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [openUploadResourcePopover, setOpenUploadResourcePopover] =
    useState(false);
  const [openPopup, setOpenPopup] = useState("");
  const [uploadResourceData, setUploadResourceData] = useState([]);

  const { liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  const { openUploadResourceModal } = useSelector(
    (state: RootState) => state.liveClassDetails
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
        handleCommonClick(6, "Eraser");
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

  const handleCommonClick = (id: number, key: string) => {
    let json = {
      id: id,
      key: key,
    };

    handleClick(json);
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

  const handleSelectPdf = (images: []) => {
    dispatch(openClosedUploadResourceWhiteBoard(images));
    handleDataTrack(images);
  };

  const handleUploadDocumentModal = () => {
    setOpenUploadResourcePopover(!openUploadResourcePopover);
    dispatch(openCloseUploadResourceModalTeacher(!openUploadResourceModal));
  };

  return (
    <>
      <div className="relative z-[1]">
        <div className="flex w-full h-[40px] items-center gap-2 p-5 bg-white">
          {Toolbar.map((item, index) => (
            <button
              onClick={() => handleSelectedKey(item.id, item.key)}
              className="cursor-pointer"
              key={`whiteboardtoolbar-${index}`}
            >
              {item.key === "FileUpload" &&
              isTutor({ identity: String(role_name) }) ? (
                <img
                  style={{
                    width: "45px",
                    height: "45px",
                  }}
                  src={UploadIcon}
                />
              ) : (
                <img src={item.image}></img>
              )}
            </button>
          ))}
        </div>

        {isPopoverVisible && !closeToolbarPopup && (id === 1 || id === 2) && (
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
          </div>
        )}

        {openUploadResourcePopover && (
          <div
            className="flex flex-col
            flex-wrap absolute bg-white p-4 gap-4 shadow-md left-[220px]"
          >
            <div>
              <button
                className="flex flex-row items-center p-2 gap-2"
                onClick={handleUploadDocumentModal}
              >
                <FileUploadIcon
                  style={{
                    color: "blue",
                  }}
                />
                <p>Upload</p>
              </button>
            </div>
            <div className="w-full h-[2px] bg-blue-500"></div>

            {uploadResourceData?.map((item, index) => {
              return (
                <>
                  <div
                    key={`uploadresource-${index}`}
                    className="flex flex-row gap-2"
                  >
                    <p>{item?.name}</p>
                    <Button
                      onClick={() => handleSelectPdf(item.image_data)}
                      style={{
                        fontSize: "8px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Select
                    </Button>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>

      {openUploadResourceModal && <UploadResource />}
    </>
  );
}
