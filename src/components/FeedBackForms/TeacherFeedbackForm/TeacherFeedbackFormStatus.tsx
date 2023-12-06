import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import "../index.css";
import { isValidElement, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { submitStudentFeedbackForm } from "../../../api";
import RegularFeedback from "./RegularFeedback";
import CompletedDemoFeedback from "./CompletedDemoFeedbackForm/CompletedDemoFeedback";
export default function TeacherFeedbackFormStatus() {
  const style = {
    width: "fit-content",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    minWidth: 600,
    height: "fit-content",
    margin: "10px auto",
    minHeight: 300,
    borderRadius: 5,
  };
  const [currentSelectedStudentIndex, setCurrentSelectedStudentIndex] =
    useState(0);
  const videoCallTokenData = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { demo } = videoCallTokenData;
  const { liveClassId, userId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const [childDetails, setChildDetails] = useState({
    name: {
      value: videoCallTokenData.students[0]?.name || "",
      errorMsg: "Please Enter Child's Name",
      showError: false,
      key: "name",
      key1: "first_name",
    },
    grade: {
      value: videoCallTokenData.grade || "",
      errorMsg: "Please Enter Child's Grade",
      showError: false,
    },
    gender: {
      value: videoCallTokenData.students[0]?.gender || "",
      errorMsg: "Please Enter Child's gender",
      showError: false,
      key: "gender",
      key1: "gender",
    },
  });
  const [disabledField, setDisabledField] = useState({
    gender: true,
    name: true,
    grade: true,
  });
  const [loading, setLoading] = useState(false);

  const [demoStatus, setDemoStatus] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "reason") {
      setSelectedReason(value);
    }
  };
  const handleEnabledDisabledBtn = (name) => {
    console.log(name);
    disabledField[name] = false;
    setDisabledField({ ...disabledField });
  };

  const handleSubmit = async (data, studentId) => {
    let obj = {};
    for (let information of data) {
      let details = information?.details || [];
      for (let item of details) {
        if (item?.type === "selectchoice") {
          let value = "";
          let option = item?.options[item?.selectedIndex || 0] || {};
          value = option?.value || "";
          if (item?.key === "demo_topic") obj["demo_topic_id"] = option?.id;
          obj[item.key] = value;
        } else if (item?.type === "keying") {
          if (item?.key === "speed_math_correct") {
            obj["speed_math_total"] = item?.options[0]?.total;
          }
          obj[item.key] = item?.options[0]?.value;
        }
      }
    }
    obj.user_id = userId;
    obj.live_class_id = liveClassId;
    obj.student_id = studentId;
    obj.last_student =
      currentSelectedStudentIndex + 1 < videoCallTokenData.students?.length
        ? "no"
        : "yes";
    if (demo) obj.demo_status = "Completed";

    await submitStudentFeedbackForm(obj);
    if (currentSelectedStudentIndex + 1 < videoCallTokenData.students?.length) {
      setCurrentSelectedStudentIndex(currentSelectedStudentIndex + 1);
    } else {
      window.close();
      window.location.href = "https://www.begalileo.com/online_teachers";
      setLoading(true);
    }
  };
  const handleSubmitIncompleteClass = async () => {
    let isValidated = true;
    for (let key in childDetails) {
      if (!childDetails[key].value.trim()) {
        childDetails[key].showError = false;
        isValidated = false;
      }
    }
    let obj = {};
    if (isValidated)
      if (selectedReason) {
        setLoading(true);
        obj.student_id = videoCallTokenData.students[0]?.id || "";
        obj.live_class_id = liveClassId;
        obj.user_id = userId;
        obj.demo_status = "incompleted";
        obj.reason = selectedReason;
        obj.last_student = "yes";
        await submitStudentFeedbackForm(obj);
        window.close();
        window.location.href = "https://www.begalileo.com/online_teachers";
      } else {
        alert("Please choose the reason");
      }
    else {
      setChildDetails({ ...childDetails });
    }
  };
  return (
    <>
      {demo ? (
        <Modal open={true}>
          <div style={{ width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <Box sx={style}>
              <div className="flex flex-col gap-4 ">
                <div>
                  <h3
                    style={{
                      color: "rgb(0, 105, 217)",
                      textAlign: "center",
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    Teacher Feedback
                  </h3>
                </div>

                <>
                  <hr />
                  <div>
                    <h3 style={{ textAlign: "center" }}>Demo Status</h3>
                  </div>
                </>

                {loading ? (
                  <h3 style={{ fontSize: 18, textAlign: "center" }}>
                    Loading...
                  </h3>
                ) : (
                  <>
                    <div>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={demoStatus}
                        name="radio-buttons-group"
                        style={{
                          flexDirection: "row",
                          width: "fit-content",
                          margin: "auto",
                        }}
                        onChange={(e) => setDemoStatus(e.target.value)}
                      >
                        <FormControlLabel
                          value="completed"
                          control={<Radio />}
                          label="Completed"
                        />
                        <FormControlLabel
                          value="incompleted"
                          control={<Radio />}
                          label="InComplete"
                        />
                      </RadioGroup>
                    </div>

                    {demoStatus === "incompleted" && (
                      <>
                        <div className="flex gap-2 flex-wrap justify-between">
                          <h3 className="feedbackformsubtitle">
                            STUDENT INFORMATION
                          </h3>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-between">
                          <div
                            className="flex flex-col justify-center gap-2"
                            style={{ flex: 0.33 }}
                          >
                            <div style={{ width: "100%" }}>
                              <label>Child's Name</label>
                              <Button
                                sx={{
                                  minWidth: 20,
                                  boxSizing: "content-box",
                                }}
                                disabled={!disabledField["name"]}
                                onClick={() => handleEnabledDisabledBtn("name")}
                              >
                                <img src="/menu-icon/Whiteboard.svg" />
                              </Button>
                            </div>
                            <div>
                              <TextField
                                type="text"
                                required={true}
                                variant="outlined"
                                disabled={disabledField["name"]}
                                name="name"
                                value={childDetails.name.value}
                                onChange={handleChange}
                                sx={{ width: "100%" }}
                              />
                            </div>
                            {childDetails.name.showError && (
                              <p
                                className="feedback_error_msg"
                                style={{ color: "red" }}
                              >
                                {childDetails.name.errorMsg}
                              </p>
                            )}
                          </div>
                          <div
                            className="flex flex-col justify-center gap-2"
                            style={{ flex: 0.33 }}
                          >
                            <div>
                              <label>Child's Gender</label>
                              <Button
                                style={{
                                  paddingLeft: 4,
                                  minWidth: 20,
                                  boxSizing: "content-box",
                                }}
                                disabled={!disabledField["gender"]}
                                onClick={() =>
                                  handleEnabledDisabledBtn("gender")
                                }
                              >
                                <img src="/menu-icon/Whiteboard.svg" />
                              </Button>
                            </div>
                            <Box sx={{ minWidth: 220 }}>
                              <FormControl fullWidth>
                                <InputLabel
                                  id="demo-simple-select-label"
                                  style={{ minWidth: 220 }}
                                  disabled={disabledField["name"]}
                                >
                                  Gender
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="Gender"
                                  required={true}
                                  value={childDetails.gender.value}
                                  disabled={disabledField["gender"]}
                                  name="gender"
                                  onChange={handleChange}
                                >
                                  <MenuItem value={"boy"}>Boy</MenuItem>
                                  <MenuItem value={"girl"}>Girl</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                            {childDetails.gender.showError && (
                              <p
                                className="feedback_error_msg"
                                style={{ color: "red" }}
                              >
                                {childDetails.gender.errorMsg}
                              </p>
                            )}
                          </div>
                          <div
                            className="flex flex-col justify-center gap-2"
                            style={{ flex: 0.33 }}
                          >
                            <div
                              style={{
                                minHeight: 32,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <label>Child's Grade</label>
                            </div>
                            <Box sx={{ minWidth: 220 }}>
                              <FormControl fullWidth>
                                <TextField
                                  type="text"
                                  variant="outlined"
                                  label="Grade"
                                  disabled={disabledField["grade"]}
                                  name="grade"
                                  onChange={handleChange}
                                  value={childDetails.grade.value}
                                />
                              </FormControl>
                            </Box>
                            {childDetails.grade.showError && (
                              <p
                                className="feedback_error_msg"
                                style={{ color: "red" }}
                              >
                                {childDetails.grade.errorMsg}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    {demoStatus === "completed" ? (
                      <>
                        <CompletedDemoFeedback
                          key={`${videoCallTokenData.students[currentSelectedStudentIndex]?.id}`}
                          student_id={`${
                            videoCallTokenData.students[
                              currentSelectedStudentIndex
                            ]?.id || ""
                          }`}
                          liveClassId={`${liveClassId}`}
                          handleSubmit={handleSubmit}
                          studentGrade={videoCallTokenData.grade}
                          studentGender={`${
                            videoCallTokenData.students[
                              currentSelectedStudentIndex
                            ]?.gender || ""
                          }`}
                          studentName={`${videoCallTokenData.students[currentSelectedStudentIndex]?.name}`}
                          last_student={
                            currentSelectedStudentIndex + 1 ===
                            videoCallTokenData.students?.length
                              ? true
                              : false
                          }
                        />
                      </>
                    ) : demoStatus === "incompleted" ? (
                      <>
                        <div className="flex flex-col justify-center gap-2">
                          <div>
                            <label>Select Reason</label>
                          </div>
                          <Box sx={{ minWidth: 220 }}>
                            <FormControl fullWidth>
                              <InputLabel
                                id="demo-simple-select-label"
                                style={{ minWidth: 220 }}
                              >
                                Reason
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="reason"
                                required={true}
                                name="reason"
                                onChange={handleChange}
                                value={selectedReason}
                              >
                                <MenuItem value={"Student did not join"}>
                                  Student did not join
                                </MenuItem>
                                <MenuItem value={"Tech issues for Student"}>
                                  Tech issues for Student
                                </MenuItem>
                                <MenuItem
                                  value={"Student joined but did not continue"}
                                >
                                  Student joined but did not continue
                                </MenuItem>
                                <MenuItem value={"Tech Issues for Teacher"}>
                                  Tech Issues for Teacher
                                </MenuItem>
                                <MenuItem value={"Others"}>Others</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          <hr />
                          <div style={{ textAlign: "center" }}>
                            <Button
                              variant="contained"
                              onClick={handleSubmitIncompleteClass}
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <hr />
                    )}
                  </>
                )}
              </div>
            </Box>
          </div>
        </Modal>
      ) : (
        <RegularFeedback userId={`${userId}`} liveClassId={`${liveClassId}`} />
      )}
    </>
  );
}
