import { useEffect, useRef, useState } from "react";
import useVideoContext from "../../../../hooks/useVideoContext/useVideoContext";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { getGGbResponse, savedGGbResponse } from "../../../../api";
import { GGB, ROUTERKEYCONST } from "../../../../constants";
import { isTutorTechBoth } from "../../../../utils/participantIdentity";
import { useDispatch } from "react-redux";
import { changeGGbStatus } from "../../../../redux/features/liveClassDetails";
import UserTab from "../UserTab";
import { getAppletDetails } from "./utility/GetGeogebraParameterValue";
const VIEWS = {
  is3D: 1,
  AV: 1,
  SV: 0,
  CV: 0,
  EV2: 0,
  CP: 0,
  PC: 0,
  DA: 0,
  FI: 0,
  macro: 0,
};
let PARAMETERS = {
  //"id": "ggbApplet1",
  // width: Math.floor(window.innerWidth*0.83),
  // height: 700,
  showMenuBar: false,
  showAlgebraInput: false,
  showToolBar: false,
  customToolBar:
    "0 39 73 62 | 1 501 67 , 5 19 , 72 75 76 | 2 15 45 , 18 65 , 7 37 | 4 3 8 9 , 13 44 , 58 , 47 | 16 51 64 , 70 | 10 34 53 11 , 24  20 22 , 21 23 | 55 56 57 , 12 | 36 46 , 38 49  50 , 71  14  68 | 30 29 54 32 31 33 | 25 17 26 60 52 61 | 40 41 42 , 27 28 35 , 6",
  showToolBarHelp: false,
  showResetIcon: false,
  enableLabelDrags: false,
  errorDialogsActive: false,
  useBrowserForJS: false,
  allowStyleBar: false,
  preventFocus: false,
  showZoomButtons: false,
  capturingThreshold: 3,
  // add code here to run when the applet starts
  //"appletOnLoad":function(api){ /* api.evalCommand('Segment((1,2),(3,4))');*/ },
  showFullscreenButton: true,
  scale: 1,
  disableAutoScale: false,
  allowUpscale: false,
  clickToLoad: false,
  appName: "classic",
  showSuggestionButtons: false,
  buttonRounding: 0.7,
  buttonShadows: false,
  language: "en",
  // use this instead of ggbBase64 to load a material from geogebra.org
  // "material_id":"RHYH3UQ8",
  // use this instead of ggbBase64 to load a .ggb file
  // "filename":"myfile.ggb",
  //material_id: "hahgnwqw",
  //material_id: "q2nqhqmx",
  // material_id:"wsecdt2v",
  //material_id:"ydasnczd"
  material_id: "",
  //material_id: "rbaprtt9",
  //material_id: "wvuwkwqx",
  ggbBase64: "",
};

export default function Geogebra() {
  const { room } = useVideoContext();
  const [loading, setLoading] = useState(true);
  const { liveClassId, userId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const dispatch = useDispatch();
  const [localDataTrackPublication] = [
    ...room!.localParticipant.dataTracks.values(),
  ];
  const appletRef = useRef<{ setBase64: null | undefined | Function }>();
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state: RootState) => state.activeTabReducer
  );
  let currentSelectedItem = activeTabArray[currentSelectedIndex] || {};
  const { extraParams } = currentSelectedItem;
  const { ggbLink, tagId } = extraParams;
  const [isEnabledWriting, setIsEnabledWriting] = useState(false);
  const elementRef = useRef<typeof Element>(null);
  let link = ggbLink?.split("/");
  if (link) link = link[link.length - 1];
  const [parameter, setParamter] = useState({
    ...PARAMETERS,
    material_id: link,
  });
  const { role_name, students } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { ggbData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const timerRef = useRef(null);
  const fetchTimerRef = useRef(null);
  const handleEnabledDisabledAction = (mode: string) => {
    let isTutor = isTutorTechBoth({ identity: role_name.toString() });
    let temp = false;
    if (isTutor) {
      if (mode === "tutor") temp = true;
    } else {
      if (mode !== "tutor") temp = true;
    }
    setIsEnabledWriting(temp);
  };
  const debounceFetchRequest = (fetchRequest: Function) => {
    clearTimeout(fetchTimerRef.current);
    fetchTimerRef.current = setTimeout(() => {
      fetchRequest();
    }, 200);
  };
  const debounceFn = (api) => {
    let temp = false;
    setIsEnabledWriting((prev) => {
      temp = prev;
      return prev;
    });
    if (!temp) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      let studentId = userId;

      let base64 = api.getBase64();
      if (isTutorTechBoth({ identity: role_name.toString() }))
        studentId = students[0]?.id || "";

      if (studentId && base64) {
        postData(studentId, base64);
      }
      // setBase64Data(base64);
    }, 200);
  };
  function clientListener(event, api) {
    switch (event[0]) {
      case "mouseDown":
        debounceFn(api);
        break;
      case "viewChanged3D":
        debounceFn(api);
        break;
      case "viewChanged2D":
        debounceFn(api);
        break;
      case "dragEnd":
        debounceFn(api);
        break;
    }
  }

  const calculateWidthAndHeight = (app, data) => {
    // var applet = new app("5.0", parameter, VIEWS);
    let appletWidth = data.width;
    let appletHeight = data.height;
    let containerWidth = elementRef.current.clientWidth;
    let containerHeight = elementRef.current.clientHeight;
    if (
      (students?.length || 0) > 1 &&
      isTutorTechBoth({ identity: role_name.toString() })
    ) {
      containerHeight = containerHeight - 40 - 16;
    }

    let heightWidthProportion = appletWidth / appletHeight;
    let actualWidth = containerWidth;
    let actualHeight = containerHeight;
    actualHeight = containerWidth / heightWidthProportion;
    if (actualHeight > containerHeight) {
      actualWidth = containerHeight * heightWidthProportion;
      actualHeight = containerHeight;
    }
    let scale = actualWidth / appletWidth;
    let newParmater = {
      ...PARAMETERS,
      scale,
      width: appletWidth,
      height: appletHeight,
      material_id: link,
    };
    var applet = new app("5.0", newParmater, VIEWS);
    newParmater.appletOnLoad = function (api) {
      // api.registerClickListener(clickListner);
      appletRef.current = api;

      api.registerClientListener((event) => {
        clientListener(event, api);
      });

      //   api.unregisterClientListener((event) => {
      //     console.log("unregister");
      //     clientListener(event, api);
      //   });
    };
    applet.inject("geogebra");
    setLoading(false);
  };
  const loadGeogebra = async (app: any) => {
    // var applet = new app("5.0", parameter, VIEWS);
    // // setTimeout(() => {
    // //   calculateWidthAndHeight(app, applet.getParameters());
    // // }, 1000);
    try {
      let parameterDetails = await getAppletDetails(parameter.material_id);
      parameterDetails = await parameterDetails.json();
      let response = parameterDetails?.responses?.response || [];
      response = response[1];
      calculateWidthAndHeight(app, response?.item);
    } catch {
      var applet = new app("5.0", parameter, VIEWS);
      setTimeout(() => {
        calculateWidthAndHeight(app, applet.getParameters());
        console.log(applet.getParameters());
      }, 1000);
    }
  };
  useEffect(() => {
    const app = window.GGBApplet;
    loadGeogebra(app);
    return () => {
      appletRef.current?.unregisterClientListener((event) => {
        clientListener(event, appletRef.current);
      });
    };
  }, []);
  const handleDataTrack = (identity: string, role: string) => {
    let DataTrackObj = {
      pathName: ROUTERKEYCONST.lesson,
      key: ROUTERKEYCONST.lesson,
      value: {
        identity: identity,
        role,
        datatrackName: GGB.dataTrackName,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };
  const postData = async (student_id: string, base64: string) => {
    var formData = new FormData();
    formData.append("project_data", base64);
    formData.append("live_class_id", `${liveClassId}`);
    formData.append("simulation_id", tagId);
    formData.append("student_id", student_id);
    try {
      let { data } = await savedGGbResponse(formData);
      data = data || {};
      if (data?.status) {
        handleDataTrack(`${userId}`, role_name.toString());
      } else {
      }
    } catch (e) {}
  };
  const updateGGbActivity = (base64Data: string) => {
    if (appletRef.current) {
      typeof appletRef.current?.setBase64 === "function" &&
        appletRef.current?.setBase64(base64Data, () => {});
    }
  };
  const getData = async (student_id: string) => {
    try {
      let { data } = await getGGbResponse({
        simulation_id: tagId,
        student_id,
        live_class_id: liveClassId,
      });
      if (data?.status) {
        let { project_data } = data;
        project_data = project_data || [];
        project_data = project_data[0]?.project_data || "";
        if (project_data) updateGGbActivity(project_data || "");
      }
    } catch (e) {}
  };
  useEffect(() => {
    if (!ggbData.currentCount) return;

    if (isTutorTechBoth({ identity: role_name.toString() })) {
      if (
        ggbData.currentSelectedStudentId == ggbData.currentIdentity &&
        ggbData.currentSelectedStudentId
      ) {
        debounceFetchRequest(() => getData(ggbData.currentSelectedStudentId));
      }
    } else {
      if (isTutorTechBoth({ identity: ggbData.currentRole })) {
        debounceFetchRequest(() => getData(`${userId}`));
      }
    }
  }, [ggbData.currentCount]);
  useEffect(() => {
    dispatch(changeGGbStatus(true));
    return () => {
      dispatch(changeGGbStatus(false));
    };
  }, []);
  useEffect(() => {
    handleEnabledDisabledAction(ggbData.currentMode);
  }, [ggbData.currentMode]);

  useEffect(() => {
    if (ggbData.currentSelectedStudentId) {
      if (isTutorTechBoth({ identity: role_name.toString() })) {
        debounceFetchRequest(() => getData(ggbData.currentSelectedStudentId));
      }
    }
  }, [ggbData.currentSelectedStudentId]);
  return (
    <div ref={elementRef} className="w-full h-full">
      <div className="w-fit m-auto">
        {isTutorTechBoth({ identity: role_name.toString() }) && (
          <UserTab students={students} />
        )}
        {loading && <h3>Loading...</h3>}
        <div
          id="geogebra"
          style={{
            margin: "auto",
            pointerEvents: isEnabledWriting ? "initial" : "none",
          }}
        ></div>
      </div>
    </div>
  );
}
