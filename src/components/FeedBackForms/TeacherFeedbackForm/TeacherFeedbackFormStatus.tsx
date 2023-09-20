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
  const videoCallTokenData = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
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
  const [completedClass, setCompletedClass] = useState({
    learningStyle: {
      value: " ",
      key1: "learning_style",
      errorMsg: "Please Enter above details",
      showError: false,
      key: "learningStyle",
    },
    communication: {
      value: " ",
      key1: "communication",
      errorMsg: "Please Enter above details",
      showError: false,
      key: "communication",
    },
    conceptualKnowledge: {
      value: " ",
      key1: "knowledge",
      errorMsg: "Please Enter above details",
      showError: false,
      key: "conceptualKnowledge",
    },
    mostLikedFeature: {
      value: " ",
      key1: "interest",
      errorMsg: "Please Enter above details",
      showError: false,
      key: "mostLikedFeature",
    },
    inClassBehaviour: {
      value: " ",
      key1: "behaviour",
      errorMsg: "Please Enter above details",
      showError: false,
      key: "inClassBehaviour",
    },
    childCurrentMathLevel: {
      value: " ",
      key1: " childCurrentMathLevel",
      errorMsg: "Please Enter above details",
      showError: false,
      key: "childCurrentMathLevel",
    },
    comments: {
      inputForSalesTeam: {
        key1: "internal_comments",
        value: "",
        errorMsg: "Please Enter above details",
        showError: false,
        key: "inputForSalesTeam",
      },
      pointDiscussed: {
        key1: "parent_discussion",
        value: "",
        errorMsg: "Please Enter above details",
        showError: false,
        key: "pointDiscussed",
      },
    },
  });
  const [demoStatus, setDemoStatus] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    if (name == "reason") {
      setSelectedReason(value);
    }
    console.log(completedClass[name]);
    if (completedClass[name]) {
      completedClass[name].value = value;
      completedClass[name].showError = false;
      setCompletedClass({ ...completedClass });
    } else if (
      name === completedClass.comments.inputForSalesTeam.key ||
      name === completedClass.comments.pointDiscussed.key
    ) {
      console.log("right");
      console.log(completedClass.comments[name], name);
      completedClass.comments[name].value = value;
      completedClass.comments[name].showError = false;
      setCompletedClass({ ...completedClass });
    } else if (childDetails[name]) {
      childDetails[name].value = value;
      childDetails[name].showError = false;
      setChildDetails({ ...childDetails });
    }
  };
  const handleEnabledDisabledBtn = (name) => {
    console.log(name);
    disabledField[name] = false;
    setDisabledField({ ...disabledField });
  };

  const handleSubmit = () => {
    let isValidated = true;
    for (let key in childDetails) {
      if (!childDetails[key].value.trim() && key !== "grade") {
        isValidated = false;
        childDetails[key].showError = true;
      }
    }
    for (let key in completedClass) {
      if (key === "comments") {
        for (let key1 in completedClass[key]) {
          if (!completedClass[key][key1].value.trim()) {
            completedClass[key][key1].showError = true;
            isValidated = false;
          }
        }
      } else {
        if (!completedClass[key].value.trim()) {
          completedClass[key].showError = true;
          isValidated = false;
        }
      }
    }
    if (!isValidated) {
      setChildDetails({ ...childDetails });
      setCompletedClass({ ...completedClass });
    } else {
      let paramsObj: any = {};
      for (let key in childDetails) {
        if (key != "grade") {
          // formData.append(childDetails[key].key, childDetails[key].value);
          paramsObj[childDetails[key].key1] = childDetails[key].value;
        }
      }
      for (let key in completedClass) {
        if (key === "comments") {
          for (let key1 in completedClass[key]) {
            // formData.append(
            //   completedClass[key][key1].key,
            //   completedClass[key][key1].value
            // );
            paramsObj[completedClass[key][key1].key1] =
              completedClass[key][key1].value;
          }
        } else {
          // formData.append(completedClass[key].key, completedClass[key].value);
          paramsObj[completedClass[key].key1] = completedClass[key].value;
        }
      }
      // formData.append("user_id", `${userId}`);
      // formData.append("live_class_id", `${liveClassId}`);
      paramsObj.user_id = userId;
      paramsObj.live_class_id = liveClassId;
      paramsObj.demo_status = "Completed";
      setLoading(true);
      submitStudentFeedbackForm(paramsObj);
    }
  };
  const handleSubmitIncompleteClass = () => {
    let isValidated = true;
    for (let key in childDetails) {
      if (!childDetails[key].value.trim()) {
        childDetails[key].showError = false;
        isValidated = false;
      }
    }
    if (isValidated)
      if (selectedReason) {
      } else {
        alert("Please choose the reason");
      }
    else {
      setChildDetails({ ...childDetails });
    }
  };
  return (
    <>
      <Modal open={true}>
        <div style={{ width: "100%", maxHeight: "100vh", overflow: "auto" }}>
          <Box sx={style}>
            <div className="flex flex-col gap-4 ">
              <div>
                <h3
                  style={{
                    color: "red",
                    fontSize: 28,
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  Please Select One
                </h3>
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
              <hr />
              <div>
                <h3 style={{ textAlign: "center" }}>Demo Status</h3>
              </div>
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
                        label="In Completed"
                      />
                    </RadioGroup>
                  </div>
                  {demoStatus && (
                    <div className="flex gap-2 flex-wrap justify-between">
                      <div className="flex flex-col justify-center gap-2">
                        <div>
                          <label>Child's Name</label>
                          <Button
                            sx={{
                              paddingLeft: 4,
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
                      <div className="flex flex-col justify-center gap-2">
                        <div>
                          <label>Child's Gender</label>
                          <Button
                            style={{
                              paddingLeft: 4,
                              minWidth: 20,
                              boxSizing: "content-box",
                            }}
                            disabled={!disabledField["gender"]}
                            onClick={() => handleEnabledDisabledBtn("gender")}
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
                      <div className="flex flex-col justify-center gap-2">
                        <div>
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
                  )}
                  {demoStatus === "completed" ? (
                    <>
                      <div className="flex gap-2 flex-wrap justify-between">
                        <div className="flex flex-col justify-center gap-2">
                          <div>
                            <label>Learning Style</label>
                          </div>
                          <Box sx={{ minWidth: 220 }}>
                            <FormControl fullWidth>
                              <Select
                                value={completedClass.learningStyle.value}
                                required={true}
                                name={completedClass.learningStyle.key}
                                onChange={handleChange}
                              >
                                <MenuItem value=" ">
                                  Select Learning Style
                                </MenuItem>
                                <MenuItem value={"Above Grade Level"}>
                                  Above Grade Level
                                </MenuItem>
                                <MenuItem value={"Grade Level"}>
                                  Grade Level
                                </MenuItem>
                                <MenuItem value={"Below Grade Level"}>
                                  Below Grade Level
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          {completedClass.learningStyle.showError && (
                            <p
                              className="feedback_error_msg"
                              style={{ color: "red" }}
                            >
                              {completedClass.learningStyle.errorMsg}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                          <div>
                            <label>Communication</label>
                          </div>
                          <Box sx={{ minWidth: 220 }}>
                            <FormControl fullWidth>
                              <Select
                                value={completedClass.communication.value}
                                name={completedClass.communication.key}
                                onChange={handleChange}
                              >
                                <MenuItem value=" ">
                                  Select Communication
                                </MenuItem>
                                <MenuItem value={"Above Grade Level"}>
                                  Above Grade Level
                                </MenuItem>
                                <MenuItem value={"Grade Level"}>
                                  Grade Level
                                </MenuItem>
                                <MenuItem value={"Below Grade Level"}>
                                  Below Grade Level
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          {completedClass.communication.showError && (
                            <p
                              className="feedback_error_msg"
                              style={{ color: "red" }}
                            >
                              {completedClass.communication.errorMsg}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                          <div>
                            <label>Conceptual Knowledge</label>
                          </div>
                          <Box sx={{ minWidth: 220 }}>
                            <FormControl fullWidth>
                              <Select
                                value={completedClass.conceptualKnowledge.value}
                                name={completedClass.conceptualKnowledge.key}
                                onChange={handleChange}
                              >
                                <MenuItem value=" ">
                                  Select Conceptual Knowledge
                                </MenuItem>
                                <MenuItem value={"Above Grade Level"}>
                                  Above Grade Level
                                </MenuItem>
                                <MenuItem value={"Grade Level"}>
                                  Grade Level
                                </MenuItem>
                                <MenuItem value={"Below Grade Level"}>
                                  Below Grade Level
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          {completedClass.conceptualKnowledge.showError && (
                            <p
                              className="feedback_error_msg"
                              style={{ color: "red" }}
                            >
                              {completedClass.conceptualKnowledge.errorMsg}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-between">
                        <div className="flex flex-col justify-center gap-2">
                          <div>
                            <label>Feature most liked by the child</label>
                          </div>
                          <Box sx={{ minWidth: 220 }}>
                            <FormControl fullWidth>
                              <Select
                                value={completedClass.mostLikedFeature.value}
                                name={completedClass.mostLikedFeature.key}
                                onChange={handleChange}
                              >
                                <MenuItem value=" ">
                                  Select Feature most liked by the child
                                </MenuItem>
                                <MenuItem value={"Above Grade Level"}>
                                  Above Grade Level
                                </MenuItem>
                                <MenuItem value={"Grade Level"}>
                                  Grade Level
                                </MenuItem>
                                <MenuItem value={"Below Grade Level"}>
                                  Below Grade Level
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          {completedClass.mostLikedFeature.showError && (
                            <p
                              className="feedback_error_msg"
                              style={{ color: "red" }}
                            >
                              {completedClass.mostLikedFeature.errorMsg}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                          <div>
                            <label>In class behaviour</label>
                          </div>
                          <Box sx={{ minWidth: 220 }}>
                            <FormControl fullWidth>
                              <Select
                                value={completedClass.inClassBehaviour.value}
                                name={completedClass.inClassBehaviour.key}
                                onChange={handleChange}
                              >
                                <MenuItem value=" ">
                                  Select In class behaviour
                                </MenuItem>
                                <MenuItem value={"Above Grade Level"}>
                                  Above Grade Level
                                </MenuItem>
                                <MenuItem value={"Grade Level"}>
                                  Grade Level
                                </MenuItem>
                                <MenuItem value={"Below Grade Level"}>
                                  Below Grade Level
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          {completedClass.inClassBehaviour.showError && (
                            <p
                              className="feedback_error_msg"
                              style={{ color: "red" }}
                            >
                              {completedClass.inClassBehaviour.errorMsg}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                          <div>
                            <label>Child’s current math level</label>
                          </div>
                          <Box sx={{ minWidth: 220 }}>
                            <FormControl fullWidth>
                              <Select
                                value={
                                  completedClass.childCurrentMathLevel.value
                                }
                                name={completedClass.childCurrentMathLevel.key}
                                onChange={handleChange}
                              >
                                <MenuItem value=" ">
                                  Select child’s current math level
                                </MenuItem>
                                <MenuItem value={"Above Grade Level"}>
                                  Above Grade Level
                                </MenuItem>
                                <MenuItem value={"Grade Level"}>
                                  Grade Level
                                </MenuItem>
                                <MenuItem value={"Below Grade Level"}>
                                  Below Grade Level
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          {completedClass.childCurrentMathLevel.showError && (
                            <p
                              className="feedback_error_msg"
                              style={{ color: "red" }}
                            >
                              {completedClass.childCurrentMathLevel.errorMsg}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Comments for Internal Team
                        </h5>
                      </div>
                      <div>
                        <div className="flex gap-2 items-center">
                          <div style={{ width: 190, minWidth: 190 }}>
                            <label>Points discussed with parents</label>
                          </div>
                          <div className="w-full">
                            <TextareaAutosize
                              minRows={3}
                              style={{
                                width: "100%",
                                border: "1px solid black",
                                padding: 5,
                                borderRadius: 5,
                                maxWidth: 350,
                              }}
                              placeholder="Your Comments"
                              name={completedClass.comments.pointDiscussed.key}
                              value={
                                completedClass.comments.pointDiscussed.value
                              }
                              onChange={handleChange}
                            />
                            {completedClass.comments.pointDiscussed
                              .showError && (
                              <p
                                className="feedback_error_msg"
                                style={{ color: "red" }}
                              >
                                {
                                  completedClass.comments.pointDiscussed
                                    .errorMsg
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex gap-2 items-center">
                          <div style={{ width: 190, minWidth: 190 }}>
                            <label>Any inputs for the sales team?</label>
                          </div>
                          <div className="w-full">
                            <TextareaAutosize
                              minRows={3}
                              style={{
                                width: "100%",
                                border: "1px solid black",
                                padding: 5,
                                borderRadius: 5,
                                maxWidth: 350,
                              }}
                              placeholder="Your Comments"
                              name={
                                completedClass.comments.inputForSalesTeam.key
                              }
                              value={
                                completedClass.comments.inputForSalesTeam.value
                              }
                              onChange={handleChange}
                            />
                            {completedClass.comments.inputForSalesTeam
                              .showError && (
                              <p
                                className="feedback_error_msg"
                                style={{ color: "red" }}
                              >
                                {
                                  completedClass.comments.inputForSalesTeam
                                    .errorMsg
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div style={{ textAlign: "center" }}>
                        <Button variant="contained" onClick={handleSubmit}>
                          Submit
                        </Button>
                      </div>
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
    </>
  );
}
