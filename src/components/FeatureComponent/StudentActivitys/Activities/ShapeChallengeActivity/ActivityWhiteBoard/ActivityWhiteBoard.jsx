import React, {
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
} from "react";

import {
  Stage,
  Layer,
  FastLayer,
  Line,
  Text,
  Circle,
  Image,
} from "react-konva";
import { Button, Row, Col } from "react-bootstrap";
import { deadlineForActvity } from "../ShapeChallengeCheckInActivity";
import html2canvas from "html2canvas";
import { white } from "material-ui/styles/colors";
import RocketLottie from "../../../../components/LottieTransformation/RocketLottie";
const WHITE_BOARD_POINTS = "WhiteBoardPoints";
const LAST_INDEX_WHITE_BOARD = "LastIndexWhiteBoard";
let CANVAS_WIDTH = 1100;
let CANVAS_HEIGHT = 550;
var sceneWidth = 1000;
var sceneHeight = 500;

// var konvaElementProperties = {
//   listening: false,
//   perfectDrawEnabled: false,
// };

const initialValue = { id: 0, value: " --- Select a State ---" };
//PDFjs worker from an external cdn

//const sampleUrl = "https://cors-anywhere.herokuapp.com/http://www.pdf995.com/samples/pdf.pdf";

const pdf_url =
  "https://d1cmu5xuigiv8s.cloudfront.net/online-classes/Grade%201/T1_I_MAT0201/01_I_MAT0201.pdf?Expires=1608615558&Signature=Xzs11OXsEWuvSy4-9M1pzxdPXnpKlp7-HH-RbCmHk0c20L6Jhlt6MSKzhGBcaqHBzjlBIMEC~FQGTOI0XUHCKFW1Nj08KZVB6RC~O1-9-jR0xPT5LxilTLZItWIcI-6-cYpnIC5BmzCaO7sveNaHFF09qW1F9cRlhmPqqR1irOCn9aNcedtrCEvY0a7XQyHSoP9p7REa~-DkKdM9d-2FE1wMEfOASRW8AKCiLIj8cK1g834vJQp-KwfYv8O~m8QW2YB5vfleCUh0xS73YT2DiKdXA-FFXYRk6SeVTfEPURqoySwH565pfWT~ROSQHqpTtFE00FmeB3kmwqr2EFx19A__&Key-Pair-Id=APKAICORD66RPKDMHT4Q";

const url = "https://cors-anywhere.herokuapp.com/";
let shapes = {
  circle: "/static/media/Shapes/Circle_1.png",
  triangle: "/static/media/Shapes/Triangle_1.png",
  square: "/static/media/Shapes/Square_1.png",
  rectangle: "/static/media/Shapes/Rectangle_1.png",
};
const ActivityWhiteBoard = forwardRef((props, ref) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [activeToolbar, setActiveToolbar] = useState(false);
  const [showColorpicker, setColorpicker] = useState(false);
  const [pagenumber, setPagenumber] = useState(1);
  const [penStroke, setPenStroke] = useState(5);
  let CANVAS_WIDTH = props.identity != "tutor" ? 1080 : 1100;
  let CANVAS_HEIGHT = props.identity != "tutor" ? 540 : 550;
  const [colorPickerValue, setColorpickerValue] = useState("red");
  const [pdfLoadUrl, setPdfLoadUrl] = useState("");

  const [cursor, setCursor] = useState("crosshair");
  const ipad =
    /Macintosh/.test(navigator.userAgent) && "ontouchend" in document;
  if (ipad) {
    CANVAS_WIDTH = 700;
    CANVAS_HEIGHT = 350;
  }
  CANVAS_HEIGHT = CANVAS_HEIGHT - Math.floor((props?.deltaHeight || 0) * 0.85);
  CANVAS_WIDTH = CANVAS_WIDTH - (props?.deltaHeight || 0) * 1.7;

  const initialTextAreaValue = "";
  let scaleX = CANVAS_WIDTH / sceneWidth;
  let scaleY = CANVAS_HEIGHT / sceneHeight;
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [mouse, setMouse] = useState("Mouse Status");
  const [pdfImage, setPdfImage] = useState([]);
  const [showGrpahImage, setGraphImage] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  let [stageLines, setStageLines] = useState([]);
  const [stageTextLines, setStageTextLines] = useState([]);
  const [stageWidth, setStageWidth] = useState(700);
  const [showNextButton, setShowNextButton] = useState(true);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [showInputText, setShowInputText] = useState(false);
  const [activeTextToolbar, setActiveTextToolbar] = useState(false);
  const [screenX, setScreenX] = useState(0);
  const [screenY, setScreenY] = useState(0);
  const [textareaInput, setTextAreaInput] = useState(initialTextAreaValue);
  const [showPencilSize, setShowPencilSize] = useState(false);
  const [showEraserSize, setShowEraserSize] = useState(false);
  const [show, setShow] = useState(true);

  const [pencilValue, setPencilValue] = useState("");
  const [eraserValue, setEraserValue] = useState("");
  const [isTutorIpad, setIsTutorIpad] = useState(false);
  const [isStudentIpad, setIsStudentIpad] = useState(props.isStudentIpad);
  const [count, setCount] = useState(0);
  const isDrawing = useRef(false);
  const isResponsive = useRef(null);
  let search = window.location.search;
  let urlParams = new URLSearchParams(search);
  let liveClassID = urlParams.get("liveClassID");
  liveClassID = liveClassID?.trim();
  let keys =
    "activityWhiteboard" +
    (props?.checkIn ? "check-in" : "check-out") +
    liveClassID;
  const [shapesDraw, setShapesDraw] = useState([]);
  /*To Prevent right click on screen*/
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  const toolbar = [
    {
      id: "1",
      name: "Palette",
      image: "/static/media/Toolbar/Colour-palette.svg",
      active: false,
    },

    {
      id: "3",
      name: "Pencil",
      image: "/static/media/Toolbar/Pencil.svg",
      active: false,
    },
    {
      id: "4",
      name: "Eraser",
      image: "/static/media/Toolbar/Eraser.svg",
      active: false,
    },

    // {
    // id : "6",
    // name : "Line",
    // image: "/static/media/Toolbar/Line.svg",
    // active : false
    // },

    {
      id: "8",
      name: "Clear All",
      image: "/static/media/Toolbar/Clear-board.svg",
      active: false,
    },

    {
      id: "10",
      name: "Line",
      image: "/static/media/Toolbar/Line.svg",
      active: false,
    },
  ];

  const colorPickers = [
    {
      id: "1",
      name: "Black",
      image: "/static/media/Colors/Black.svg",
      code: "#000000",
      active: false,
    },
    {
      id: "2",
      name: "Red",
      image: "/static/media/Colors/Red.svg",
      code: "#FF533A",
      active: false,
    },
    {
      id: "3",
      name: "Green",
      image: "/static/media/Colors/Green.svg",
      code: "#6BC25C",
      active: false,
    },
    {
      id: "4",
      name: "Blue",
      image: "/static/media/Colors/Blue.svg",
      code: "#419AFD",
      active: false,
    },
    {
      id: "5",
      name: "Yellow",
      image: "/static/media/Colors/Yellow.svg",
      code: "#FFC73C",
      active: false,
    },
    {
      id: "6",
      name: "Purple",
      image: "/static/media/Colors/Purple.svg",
      code: "#AE38D0",
      active: false,
    },
    {
      id: "7",
      name: "Rose",
      image: "/static/media/Colors/Pink.svg",
      code: "#DD3A67",
      active: false,
    },
    {
      id: "8",
      name: "Brown",
      image: "/static/media/Colors/Brown.svg",
      code: "#745749",
      active: false,
    },
  ];

  const pencilSizes = [
    {
      id: "1",
      name: "Black",
      image: "/static/media/Colors/Black.svg",
      size: "5",
    },
    {
      id: "2",
      name: "Red",
      image: "/static/media/Colors/Black.svg",
      size: "10",
    },
    {
      id: "3",
      name: "Green",
      image: "/static/media/Colors/Black.svg",
      size: "15",
    },
  ];

  const eraserSizes = [
    {
      id: "1",
      name: "Black",
      image: "/static/media/Colors/Black.svg",
      size: "5",
    },
    {
      id: "2",
      name: "Red",
      image: "/static/media/Colors/Black.svg",
      size: "10",
    },
    {
      id: "3",
      name: "Green",
      image: "/static/media/Colors/Black.svg",
      size: "15",
    },
  ];

  function isOdd(num) {
    return num % 2;
  }

  function getOffsetValue(number, percentToGet) {
    return (percentToGet / 100) * number;
  }

  function getXNewValue(xOld) {
    var widthNew = 700;
    var widthOld = 1100;
    if (ipad) {
      widthNew = 700;
      widthOld = 1100;
    } else {
      widthNew = 1100;
      widthOld = 700;
    }

    var newValue = (xOld * widthNew) / widthOld;
    var offsetValue = getOffsetValue(newValue, 18);

    if (ipad) newValue += offsetValue;
    else newValue -= offsetValue;
    return newValue;
  }

  function getYNewValue(yOld) {
    var heightNew = 450;
    var heightOld = 600;
    if (ipad) {
      heightNew = 450;
      heightOld = 600;
    } else {
      heightNew = 600;
      heightOld = 450;
    }
    var newValue = (yOld * heightNew) / heightOld;
    var offsetValue = getOffsetValue(newValue, 18);
    if (ipad) newValue -= offsetValue;
    else newValue += offsetValue;
    return newValue;
  }
  useImperativeHandle(ref, () => ({
    async takeScreenShots() {
      // let y = await html2canvas(document.querySelector("#responsive"), {
      //   scale: 1,
      // });
      return ref2.current.toDataURL();
    },
  }));

  /*When document gets loaded successfully*/
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function checkAndUpdateWriting(whiteBoardLines) {
    if (whiteBoardLines.tool == "text") {
      writeTextOnBoard(whiteBoardLines);
    }

    //temp comment  // setStageLines(newStageLines);
    else return whiteBoardLines;
    //  var x = JSON.parse(localStorage.getItem("WhiteBoardPoints"));
  }

  function changePage() {
    // props.changeLessonPageNumber(currentIndex);
    // var currentPageNumber = pageNumber + offset;
    // setPageNumber(currentPageNumber);
    // props.changeLessonPageNumber(currentPageNumber);
    // setLines([]);
  }

  function resetCurrentLine() {
    if (stageLines[currentIndex] != undefined) {
      setLines(stageLines[currentIndex]);
    } else {
      setLines([]);
    }
  }

  function delayNextPrevButton() {
    setShowNextButton(false);
    setShowPageNumbers(false);
    setTimeout(() => {
      setShowNextButton(true);
      setShowPageNumbers(true);
    }, 3000);
  }

  function nextPage() {
    // var indexTemp = parseInt(currentIndex) + 1;  //Previous code
    // console.log("Next Page Number :", indexTemp);
    // setPagenumber(indexTemp);
    // setCurrentIndex(indexTemp);
    // delayNextPrevButton();
    var indexTemp = parseInt(currentIndex) + 1;
    if (count != 1) {
      setPagenumber(indexTemp + 1);
      setCount(1);
      setCurrentIndex(indexTemp);
    }
    setPagenumber(indexTemp + 1);
    setCurrentIndex(indexTemp);
    delayNextPrevButton();
  }

  function previousPage() {
    // var indexTemp = parseInt(currentIndex) - 1; //Previous code
    // console.log("Prev Page Number :", indexTemp);
    // setPagenumber(indexTemp);
    // setCurrentIndex(indexTemp);
    // delayNextPrevButton();
    var indexTemp = parseInt(currentIndex);
    setPagenumber(indexTemp);
    setCurrentIndex(indexTemp - 1);
    delayNextPrevButton();
  }

  const handleInputChange = (e) => {
    console.log("e", e);
    if (e.key === "Enter") {
      setPagenumber(parseInt(e.target.value));
      goToPage(e.target.value);
    }
  };

  function handleChange(event) {
    console.log("event", event.target.value);
    setPagenumber(event.target.value);
  }

  function goToPage(pnum) {
    setCurrentIndex(pnum - 1);
    delayNextPrevButton();
  }

  function remoteChangePageNumber(index) {
    setCurrentIndex(parseInt(index));
    resetCurrentLine();
    // setLines([]);
  }

  const onGrpahIconClicked = () => {
    props.openGraphImage(!showGrpahImage);
    setGraphImage(!showGrpahImage);
  };

  function selectToolbar(id) {
    setActiveTextToolbar(false);
    if (id === "2") {
      setCursor("default");
      setTool("select");
    } else if (id === "4") {
      setToolBarEraser();
      handleEraserValue(5);
    } else if (id === "5") {
      onGrpahIconClicked();
    } else if (id === "8") {
      clearBoard();
    } else if (id === "9") {
      setCursor("text");
      setTool("text");
      setActiveTextToolbar(true);
    } else if (id === "10") {
      setTool("line");
      setCursor("crosshair");
    } else {
      setToolBarPen();
      handlePencilValue(5);
    }
  }

  function setToolBarPen() {
    setCursor("crosshair");
    setTool("pen");
    setActiveTextToolbar(false);
  }

  function setToolBarEraser() {
    //setCursor("default");
    setTool("eraser");
    setCursor("url('/static/media/Toolbar/Eraser.svg') 2 30, auto");
  }

  const checkSize = () => {
    const width = isResponsive.current.offsetWidth;

    setStageWidth(width);
  };

  const handleMouseLeave = (e) => {
    isDrawing.current = false;
  };

  const handleMouseDown = (e) => {
    if (!props.toolBox) {
      return;
    }
    console.log("mouseDown");
    if (tool == "text") {
      showTextArea(e);
      return;
    }
    setMouse("down");
    isDrawing.current = true;

    const pos = e.target.getStage().getPointerPosition();
    pos.x = pos.x / scaleX;
    pos.y = pos.y / scaleY;
    var stageCurrentLine = stageLines[currentIndex];
    if (stageCurrentLine == undefined) {
      stageCurrentLine = [];
    }

    var allLines = [
      ...stageCurrentLine,
      {
        tool,
        penStroke,
        colorPickerValue,
        // points: [ipad ? pos.x + getOffsetValue(pos.x, 15) : pos.x, pos.y],
        points: [pos.x, pos.y],
      },
    ];
    setLines(allLines);

    let newStageLines = [...stageLines];

    newStageLines[currentIndex] = allLines;

    setStageLines(newStageLines);
  };

  const handleMouseMove = (e) => {
    if (!props.toolBox) {
      return;
    }
    if (tool == "text") return;
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    point.x = point.x / scaleX;
    point.y = point.y / scaleX;
    let lastLine = lines[lines.length - 1];

    if (tool == "line")
      lastLine.points = [
        lastLine.points[0],
        lastLine.points[1],
        point.x,
        point.y,
      ];
    // lastLine.points = lastLine.points.concat([
    //   ipad ? point.x + getOffsetValue(point.x, 15) : point.x,
    //   point.y,
    // ]);
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    setMouse("Mouse Move X Offset: " + point.x + " -- " + " Y : " + point.y);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
    // props.changepenstrokesforchild(lines.concat());
  };

  const handleMouseUp = () => {
    if (!props.toolBox) {
      return;
    }
    if (tool == "text") return;
    setMouse("up");
    console.log("Final Lines", stageLines);
    // if (!isDrawing.current) {
    //   return;
    // }

    let newStageLines = [...stageLines];
    newStageLines[currentIndex] = lines;

    setStageLines(newStageLines);

    const lastUpdatedLine = newStageLines[currentIndex];

    props.remoteSendData(newStageLines);

    isDrawing.current = false;

    localStorage.setItem(
      keys,
      JSON.stringify({ value: newStageLines, startTime: props.currentTime })
    );
  };

  const setPenEraser = (value) => {
    setTool(value);
  };

  const clearBoard = () => {
    var stageLineCopy = [...stageLines];
    stageLineCopy[currentIndex] = [];
    setStageLines(stageLineCopy);

    var stageTextLineCopy = [...stageTextLines];
    stageTextLineCopy[currentIndex] = [];
    setStageTextLines(stageTextLineCopy);

    props.remoteSendData(stageTextLineCopy);
    localStorage.setItem(
      keys,
      JSON.stringify({ value: stageLineCopy, startTime: props.currentTime })
    );
  };

  const remoteClearBoard = (clearPage) => {
    var stageLineCopy = [...stageLines];
    stageLineCopy[clearPage] = [];
    setStageLines(stageLineCopy);

    var stageTextLineCopy = [...stageTextLines];
    stageTextLineCopy[currentIndex] = [];
    setStageTextLines(stageTextLineCopy);
  };

  const showColorPicker = (id) => {
    if (id === "1") {
      setColorpicker(true);
      setShowPencilSize(false);
      setShowEraserSize(false);
    } else if (id === "3") {
      setColorpicker(false);
      setShowPencilSize(true);
      setShowEraserSize(false);
    } else if (id === "4") {
      setColorpicker(false);
      setShowPencilSize(false);
      setShowEraserSize(true);
    } else {
      setColorpicker(false);
      setShowPencilSize(false);
      setShowEraserSize(false);
    }
  };

  const handleColorPicker = (value) => {
    setColorpickerValue(value);
  };

  const handlePencilValue = (value) => {
    setPenStroke(value);
    setToolBarPen();
  };

  const handleEraserValue = (value) => {
    setPenStroke(value);
    setToolBarEraser();
  };

  const hideColorPicker = () => {
    setColorpicker(false);
    setShowPencilSize(false);
    setShowEraserSize(false);
  };

  const showTextArea = (e) => {
    if (e.type == "touchstart") {
      const canvas = document.getElementsByTagName("canvas")[1];
      setScreenX(e.evt.changedTouches[0].clientX - 200);
      setScreenY(e.evt.changedTouches[0].clientY - 100);
      setShowInputText(true);
      setTextAreaInput(initialTextAreaValue);
    }
    setScreenX(e.evt.offsetX);
    setScreenY(e.evt.offsetY);
    setShowInputText(true);
    setTextAreaInput(initialTextAreaValue);
  };

  const editTextArea = (points) => {
    setScreenX(points.x);
    setScreenY(points.y);
    setShowInputText(true);
    setTextAreaInput(points.value);
  };

  const handleTextArea = (e) => {
    setTextAreaInput(e.target.value);
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      setShowInputText(false);

      var item = {
        tool: "text",
        value: textareaInput,
        x: screenX,
        y: screenY,
      };

      writeTextOnBoard(item);

      // props.onSendWhiteBoardLines(item);
      //setToolBarPen();
    }
  };
  const onRemoteLineUpdate = (whiteBoardLines) => {
    console.log("White board incoming remote line");
    if (whiteBoardLines?.tool == "text") {
      console.log("Tool is text do nothing");
    } else if (!isTutorIpad && !isStudentIpad) {
      console.log("None is Ipad");
    } else if (isTutorIpad || isStudentIpad) {
      console.log("One is Ipad");
      if (ipad) {
        console.log("Ipad", ipad);
        var elevatedLines = [];
        whiteBoardLines.points.forEach((element, index) => {
          var pointManipulation = 0;
          if (isOdd(index)) pointManipulation = getXNewValue(element);
          else pointManipulation = getYNewValue(element);
          elevatedLines.push(pointManipulation);
        });
        whiteBoardLines.points = elevatedLines;
        stageLines = [...stageLines, elevatedLines];
        // setStageLines(whiteBoardLines) temp comment
        return whiteBoardLines;
      } else {
        var elevatedLines = [];
        whiteBoardLines.points.forEach((element, index) => {
          var pointManipulation = 0;
          if (isOdd(index)) pointManipulation = getXNewValue(element);
          else pointManipulation = getYNewValue(element);
          elevatedLines.push(pointManipulation);
        });
        whiteBoardLines.points = elevatedLines;
        stageLines = [...stageLines, elevatedLines];
        // setStageLines(whiteBoardLines) temp comment
        return whiteBoardLines;
      }
    }
    return checkAndUpdateWriting(whiteBoardLines);
  };
  const ref2 = useRef();
  function writeTextOnBoard(item) {
    let newStageTextLines = [...stageTextLines];

    if (newStageTextLines[currentIndex] == undefined) {
      var wbArray = [];
      wbArray = [...wbArray, item];

      newStageTextLines[currentIndex] = wbArray;
    } else {
      var oldLines = newStageTextLines[currentIndex];
      oldLines = [...oldLines, item];
      newStageTextLines[currentIndex] = oldLines;
    }

    setStageTextLines(newStageTextLines);
  }

  // useEffect(() => {
  //   if (props.selPdfUrl != undefined) {
  //     setPdfImage(props.selPdfUrl);
  //   }
  //   setCurrentIndex(props.selPdfIndex);
  //   var storedLine = JSON.parse(localStorage.getItem(WHITE_BOARD_POINTS));

  //   if (storedLine != undefined) {
  //     if (storedLine.length > 0) {
  //       setStageLines(storedLine);
  //     }
  //   }
  //   return () => {
  //     storeVideoLog(props.classId, props.subItemId, "");
  //   };
  // }, []);

  useEffect(() => {
    resetCurrentLine();

    if (props.identity == "tutor") {
      // props.changeLessonPageNumber(currentIndex);
      // props.changechildlessonpdf(currentIndex);
    }
  }, [currentIndex]);

  const inputRef = useRef();
  let second = props?.identity != "tutor" ? true : false;

  useEffect(() => {
    setStageLines([]);
  }, [showGrpahImage]);

  let toolFlex, maxToolFlex, boardFlex, maxBoardFlex;

  if (ipad) {
    toolFlex = "0 0 10%";
    maxToolFlex = "10%";
    boardFlex = "0 0 90%";
    maxBoardFlex = "90%";
  } else {
    toolFlex = "0 0 6%";
    maxToolFlex = "6%";
    boardFlex = "0 0 94%";
    maxBoardFlex = "94%";
  }

  useEffect(() => {
    if (props?.toolBox) return;
    if (!props?.whiteBoardPoints?.length) return;
    setStageLines(props.whiteBoardPoints);
    localStorage.setItem(
      keys,
      JSON.stringify({
        value: props.whiteBoardPoints,
        startTime: props.currentTime,
      })
    );
  }, [props.renderShapeChallenge]);

  useEffect(() => {
    let activityData = props?.apiData?.activity_data || [];
    let temp = [];
    activityData?.forEach((item) => {
      let count = item?.count || 0;
      let name = item?.name || "";
      for (let i = 0; i < count; i++) {
        let obj = {
          name,
          path: item?.image || "",
        };
        temp.push(obj);
      }
    });
    setShapesDraw([...temp]);
  }, []);

  useEffect(() => {
    let storedLine = [];
    try {
      let obj = JSON.parse(localStorage.getItem(keys));

      if (obj) {
        let startTime = Number(obj?.startTime) || 0;

        let diff = Date.now() - startTime;
        if (diff >= deadlineForActvity) {
          localStorage.removeItem(keys);
        } else {
          storedLine = obj?.value || [];
          console.log(storedLine, typeof storedLine, Array.isArray(storedLine));
          setStageLines([...storedLine]);
        }
      }
    } catch (e) {
      console.log(e, "error in whiteboard");
    }
  }, []);
  // let arr=props.whiteBoardPoints||[]
  // stageLines=props.toolBox?stageLines:[undefined,arr]
  // console.log(JSON.stringify(stageLines))

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          justifyContent: !props.toolBox ? "center" : "initial",
        }}
      >
        <div className="className" style={{ position: "relative" }}>
          {showColorpicker === true ? (
            <div className="sketch-picker" style={{ left: "60px" }}>
              {colorPickers.map((obj) => {
                return (
                  <a
                    onClick={() => handleColorPicker(obj.code)}
                    className="rounded-color"
                  >
                    <img src={obj.image} />
                  </a>
                );
              })}
            </div>
          ) : null}

          {showPencilSize === true ? (
            <div className="pencil-size" style={{ left: "60px" }}>
              {pencilSizes.map((obj) => {
                return (
                  <a
                    onClick={() => handlePencilValue(obj.size)}
                    className="rounded-color"
                  >
                    <img width={obj.size} src={obj.image} />
                  </a>
                );
              })}
            </div>
          ) : null}

          {showEraserSize === true ? (
            <div className="eraser-size" style={{ left: "60px" }}>
              {pencilSizes.map((obj) => {
                return (
                  <a
                    onClick={() => handleEraserValue(obj.size)}
                    className="rounded-color"
                  >
                    <img width={obj.size} src={obj.image} />
                  </a>
                );
              })}
            </div>
          ) : null}

          {props?.toolBox && (
            <div
              className="toolbar"
              style={{
                display: props.identity == "parent" ? "none" : "",
                height: "260px",
                minWidth: "55px",
              }}
            >
              {toolbar.map((obj) => {
                if (
                  obj.id == 5 &&
                  (props.identity != "tutor" || pdfImage.length > 0)
                )
                  return;
                return (
                  <a
                    onMouseEnter={() => showColorPicker(obj.id)}
                    title={obj.name}
                    onTouchStart={() => showColorPicker(obj.id)}
                    onClick={() => selectToolbar(obj.id)}
                    key={obj.id}
                  >
                    <img src={obj.image} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <div
          ref={isResponsive}
          id="responsive"
          style={{
            position: "relative",
            cursor: props.toolBox ? cursor : "initial",
            border: "5px solid darkblue",
          }}
        >
          {showInputText && activeTextToolbar ? (
            <div
              className="draggable-input"
              draggable
              style={{
                position: "absolute",
                padding: "5px",
                backgroundColor: "transparent",
                top: screenY + `px`,
                left: screenX + `px`,
                zIndex: 9,
              }}
            >
              <textarea
                disabled={screenX > 950}
                style={{
                  border: "none",
                  padding: "5px",
                  backgroundColor: "transparent",
                }}
                placeholder="Enter your text...."
                rows={3}
                cols={20}
                value={textareaInput}
                onChange={(e) => handleTextArea(e)}
                onKeyDown={(e) => onEnterPress(e)}
                autoFocus
              />
            </div>
          ) : null}

          <Stage
            ref={ref2}
            width={sceneWidth * scaleX}
            height={sceneHeight * scaleY}
            onMouseEnter={() => hideColorPicker()}
            onClick={(e) => showTextArea(e)}
            scale={{ x: scaleX, y: scaleY }}
            style={{
              backgroundColor: "transparent",
              zIndex: "0",
              top: "0",
              margin: "0 auto",
              display: "flex",

              width: "100%",
            }}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <Layer listening={false} hitGraphEnabled={false}>
              {shapesDraw?.map((item, i) => {
                let row = i % 3;
                let col = Math.floor(i / 3);
                let width = 150;
                let height = 150;
                let url = item.path;
                let xAxis = (sceneWidth - 450 - 120) / 2;
                let x0 = xAxis + (width + 60) * row;
                let yAxis = 60 + (height + 60) * col;
                return (
                  <URLImage
                    x={x0}
                    width={width}
                    height={height}
                    y={yAxis}
                    src={url}
                    key={i}
                  />
                );
              })}
            </Layer>

            {showGrpahImage && (
              <Layer listening={false} hitGraphEnabled={false}>
                <URLImage
                  src={"/static/media/GRAPH_PAPER.png"}
                  x={0}
                  scaleX={scaleX}
                  scaleY={scaleY}
                />
              </Layer>
            )}
            <Layer listening={false} hitGraphEnabled={false}>
              {stageLines[currentIndex] &&
                stageLines[currentIndex].length > 0 &&
                stageLines[currentIndex].map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke={line.colorPickerValue}
                    strokeWidth={line.penStroke}
                    perfectDrawEnabled={false}
                    tension={0.5}
                    lineCap="round"
                    globalCompositeOperation={
                      line.tool === "eraser" ? "destination-out" : "source-over"
                    }
                  />
                ))}
              {stageTextLines[currentIndex] &&
                stageTextLines[currentIndex].length > 0 &&
                stageTextLines[currentIndex].map((item, index) => (
                  <Text
                    text={item.value}
                    fontSize={30}
                    x={item.x}
                    y={item.y}
                    onClick={() => editTextArea(item)}
                  />
                ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </React.Fragment>
  );
});

export default ActivityWhiteBoard;

class URLImage extends React.Component {
  state = {
    image: null,
  };
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener("load", this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.crossOrigin = "annonyms";
    this.image.src = this.props.src;
    this.image.addEventListener("load", this.handleLoad);
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed

    this.setState({
      image: this.image,
    });
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };
  render() {
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        image={this.state.image}
      />
    );
  }
}
