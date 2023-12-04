import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { getDemoStudentDetails } from "../../../../api";
import DisabledTeacherMainValueTableSelect from "../../../FeatureComponent/Mathzone/component/TeacherOnlineQuiz/component/AllDisabledQuestion/PlaceValueTableSelect/DisabledTeacherMainValueTableSelect";
const functionMathzoneLevelObject = (
  label: string,
  optionLabel: string,
  key: string,
  value: string,
  errorMsg: string
) => {
  return {
    label: label,
    type: "selectchoice",
    isMultiSelect: false,
    options: [{ value: value, selected: true, label: optionLabel }],
    isDisabled: true,
    key: key,
    showError: false,
    errorMsg: errorMsg,
    selectedIndex: 0,
  };
};
export default function CompletedDemoFeedback({
  student_id,
  liveClassId,
  handleSubmit,
  studentName,
  studentGrade,
  studentGender,
  last_student,
}: {
  student_id: string;
  liveClassId: string;
  handleSubmit: Function;
  studentName: string;
  studentGrade: string;
  studentGender: string;
  last_student: boolean;
}) {
  const studentInformation = useRef([
    {
      title: "STUDENT INFORMATION",
      key: "student_infromation",
      details: [
        {
          type: "keying",
          label: "Child's Name",
          errorMsg: "Please Enter Child's Name",
          showError: false,
          isDisabled: true,
          isEditable: true,
          key: "name",
          options: [
            {
              value: studentName,
              label: studentName,
              selected: true,
            },
          ],
        },
        {
          type: "selectchoice",
          label: "Child's Gender",
          showError: false,
          errorMsg: "Please Enter Child's Grade",
          isDisabled: true,
          isEditable: true,
          key: "gender",
          options: [
            {
              value: "boy",
              label: "Boy",
              selected: studentGender === "boy",
            },
            {
              value: "girl",
              label: "Girl",
              selected: studentGender === "girl",
            },
          ],
          selectedIndex: studentGender === "boy" ? 0 : 1,
        },
        {
          isDisabled: true,
          isEditable: false,
          type: "keying",
          label: "Child's Grade",

          options: [
            {
              value: studentGrade,
              label: studentGrade,
              selected: true,
            },
          ],
          key: "grade",
        },
      ],
    },
  ]);
  const feedbackDetails = useRef([
    {
      title: "Math Topic Covered",
      details: [
        {
          label: "Demo Topic",
          type: "selectchoice",
          isMultiSelect: true,
          options: [],

          isDisabled: true,
          key: "demo_topic",
        },
      ],
    },
    {
      title: "PERFORMANCE IN MATH ZONE",
      details: [
        {
          label: "Warm Up",
          type: "selectchoice",
          isMultiSelect: false,
          options: [{ value: 8 }],
          isDisabled: true,
          key: "",
          showError: false,
          errorMsg: "d",
        },
      ],
      key: "mathzone_performance",
    },
    {
      title: "Math Topic",
      details: [
        {
          label: "Understanding of Math Topic",
          type: "selectchoice",
          isMultiSelect: false,
          options: [
            {
              label: "Select one of the following",
              value: " ",
              selected: true,
            },
            { label: "Excellent", value: "Excellent", selected: false },
            { label: "Good", value: "Good", selected: false },
            { label: "Average", value: "Average", selected: false },
            {
              label: "Needs Improvement",
              value: "Needs Improvement",
              selected: false,
            },
          ],
          isDisabled: false,
          key: "understanding_math",
          isEditable: false,
          selectedIndex: 0,
          showError: false,
          errorMsg: "This field is required",
        },
      ],
    },
    {
      title: "Speed Math Game",
      details: [
        {
          label: "Highest Level Attempted",
          type: "selectchoice",
          isMultiSelect: false,
          options: [],
          isDisabled: true,
          key: "speed_math_level",
          isEditable: false,
        },
        {
          label: "Number of Correct Answers",
          type: "selectchoice",
          isMultiSelect: false,
          options: [
            {
              label: "Grasped the Concept Quickly",
              value: "Grasped the Concept Quickly",
              selected: false,
            },
          ],
          isDisabled: true,
          isEditable: false,
          key: "speed_math_correct",
        },
      ],
    },
    {
      title: "Coding Activity",
      details: [
        {
          label: "Engagement Level",
          type: "selectchoice",
          isMultiSelect: false,
          isDisabled: false,
          isEditable: false,
          options: [
            {
              label: "Select one of the following",
              value: " ",
              selected: true,
            },
            {
              label: "Grasped the Concept Quickly",
              value: "Grasped the Concept Quickly",
              selected: false,
            },
            {
              label: "Understood with Some Assistance",
              value: "Understood with Some Assistance",
              selected: false,
            },
            {
              label: "Needed Additional Explanation",
              value: "Needed Additional Explanation",
              selected: false,
            },
            {
              label: "Found it Challenging",
              value: "Found it Challenging  ",
              selected: false,
            },
          ],
          showError: false,
          errorMsg: "This field is required",
          key: "coding_engagement_level",
          selectedIndex: 0,
        },
      ],
    },
    {
      title: "GENERAL OBSERVATIONS",
      details: [
        {
          label: "Learning Attitude",
          type: "selectchoice",
          isMultiSelect: false,
          isDisabled: false,
          isEditable: false,
          options: [
            {
              label: "Select one of the following",
              value: " ",
              selected: true,
            },
            {
              label: "Enthusiastic",
              value: "Enthusiastic",
              selected: false,
            },
            {
              label: "Curious",
              value: "Curious",
              selected: false,
            },
            {
              label: "Hesitant",
              value: "Hesitant",
              selected: false,
            },
            {
              label: "Disinterested",
              value: "Disinterested",
              selected: false,
            },
          ],
          showError: false,
          errorMsg: "This field is required",
          key: "learing_attitude",
          selectedIndex: 0,
        },
        {
          label: "Interaction with Teacher",
          type: "selectchoice",
          isMultiSelect: false,
          isDisabled: false,
          isEditable: false,
          options: [
            {
              label: "Select one of the following",
              value: " ",
              selected: true,
            },
            {
              label: "Actively Engaged and Conversant",
              value: "Actively Engaged and Conversant",
              selected: false,
            },
            {
              label: "Actively Engaged and Conversant",
              value: "Actively Engaged and Conversant",
              selected: false,
            },
            {
              label: "Attentive Observer but Rarely Participative",
              value: "Attentive Observer but Rarely Participative",
              selected: false,
            },
            {
              label: "Disengaged and No Interest",
              value: "Disengaged and No Interest",
              selected: false,
            },
          ],
          showError: false,
          errorMsg: "This field is required",
          key: "interation_with_teacher",
          selectedIndex: 0,
        },
      ],
    },
  ]);
  const commentsDetails = useRef([
    {
      title: "Comments",
      details: [
        {
          type: "keying",
          label: "Input to sales",
          key: "internal_comments",
          isDisabled: false,
          isEditable: false,
          showError: false,
          options: [
            {
              value: "",
              selected: true,
              label: "",
            },
          ],
        },
        {
          type: "keying",
          label: "Key points to discuss with parent",
          key: "parent_discussion",
          isDisabled: false,
          isEditable: false,
          showError: false,
          options: [
            {
              value: "",
              label: "",
              selected: true,
            },
          ],
        },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(true);
  const manupulateFeedbackDetails = (data) => {
    let i;
    let j;
    for (i = 0; i < feedbackDetails.current.length; i++) {
      let { details } = feedbackDetails.current[i];
      let isBreak = false;
      for (j = 0; j < details.length; j++) {
        if (details[j].key === "demo_topic") {
          isBreak = true;
          break;
        }
      }
      if (isBreak) {
        break;
      }
    }
    let selectedObect = {};

    let { demo_topics_data } = data;
    demo_topics_data = demo_topics_data || [];
    let detailsTemp = [];
    j = 0;
    let selectedIndex = 0;
    for (let item of demo_topics_data) {
      item.label = item?.name || "";
      item.value = item?.name || "";
      if (item.selected === true) {
        selectedObect = item;
        selectedIndex = j;
      }
      j++;
      detailsTemp.push(item);
    }
    feedbackDetails.current[i].details[0].options = [...detailsTemp];
    feedbackDetails.current[i].details[0].isEditable = true;
    feedbackDetails.current[i].details[0].selectedIndex = selectedIndex;
    updateMathzoneData(selectedObect, i);
    feedbackDetails.current[3].details[0].options = [
      {
        label: data?.speed_math_level || "",
        value: data?.speed_math_level || "",
        selected: true,
      },
    ];
    feedbackDetails.current[3].details[0].selectedIndex = 0;
    feedbackDetails.current[3].details[1].options = [
      {
        label: data?.speed_math_correct || "",
        value: data?.speed_math_correct || "",
        selected: true,
      },
    ];
    feedbackDetails.current[3].details[1].selectedIndex = 0;
    setLoading(false);
    setUpdate(!update);
  };
  const fetchData = async (live_class_id: string, student_id: string) => {
    try {
      const { data } = await getDemoStudentDetails({
        live_class_id,
        student_id,
      });
      if (data.status) {
        manupulateFeedbackDetails(data);
      }
    } catch (e) {
      alert("Some thing went wrong please try again");
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData(liveClassId, student_id);
  }, []);
  const handleEnabledDisabledBtn = (row: number, col: number, from: string) => {
    if (from === "studentInformation") {
      studentInformation.current[row].details[col].isDisabled = false;
      studentInformation.current[row].details[col].isEditable = false;
    } else {
      feedbackDetails.current[row].details[col].isDisabled = false;
      feedbackDetails.current[row].details[col].isEditable = false;
    }

    setUpdate(!update);
  };
  const updateMathzoneData = (selectedObect, i) => {
    if (Object.keys(selectedObect).length) {
      let details = [];
      details[0] = functionMathzoneLevelObject(
        "Warm Up",
        `${selectedObect?.wramup_count || 0}`,
        "warmup_count",
        `${selectedObect?.wramup_count || 0}`,
        ""
      );
      details[1] = functionMathzoneLevelObject(
        "Wrap Up",
        `${selectedObect?.wrapup_count || 0}`,
        "wrapup_count",
        `${selectedObect?.wrapup_count || 0}`,
        ""
      );
      details[2] = functionMathzoneLevelObject(
        "Level 1",
        `${selectedObect?.level1_count || 0}`,
        "level1_count",
        `${selectedObect?.level1_count || 0}`,
        ""
      );
      details[3] = functionMathzoneLevelObject(
        "Level 2",
        `${selectedObect?.level2_count || 0}`,
        "level2_count",
        `${selectedObect?.level2_count || 0}`,
        ""
      );
      for (let item of details) {
        item.selectedIndex = 0;
      }

      feedbackDetails.current[i + 1].details = details;
    }
  };
  const handleChange = (e, row, col, from) => {
    if (from === "studentInformation") {
      if (
        studentInformation.current[row]?.details[col]?.type === "selectchoice"
      ) {
        let value = e.target.value || "";
        let options =
          studentInformation.current[row]?.details[col]?.options || [];
        for (let option of options) {
          option.selected = false;
        }
        let selectedIndex = -1;
        for (let option of options) {
          selectedIndex++;
          if (option.value == value) {
            option.selected = true;
            break;
          }
        }
        if (value.trim()) {
          studentInformation.current[row].details[col].showError = false;
        }
        studentInformation.current[row].details[col].selectedIndex =
          selectedIndex;
      } else if (
        studentInformation.current[row]?.details[col]?.type === "keying"
      ) {
        let value = e.target.value || "";
        studentInformation.current[row].details[col].options[0].value = value;
        studentInformation.current[row].details[col].options[0].label = value;
        if (value?.trim()) {
          studentInformation.current[row].details[col].showError = false;
        }
      }
    } else if (from === "commentDetails") {
      if (commentsDetails.current[row]?.details[col]?.type === "selectchoice") {
        let value = e.target.value || "";
        let options = commentsDetails.current[row]?.details[col]?.options || [];
        for (let option of options) {
          option.selected = false;
        }
        let selectedIndex = -1;
        for (let option of options) {
          selectedIndex++;
          if (option.value == value) {
            option.selected = true;
            break;
          }
        }
        if (value.trim()) {
          commentsDetails.current[row].details[col].showError = false;
        }
        commentsDetails.current[row].details[col].selectedIndex = selectedIndex;
      } else if (
        commentsDetails.current[row]?.details[col]?.type === "keying"
      ) {
        let value = e.target.value || "";
        commentsDetails.current[row].details[col].options[0].value = value;
        commentsDetails.current[row].details[col].options[0].label = value;
        if (value?.trim()) {
          commentsDetails.current[row].details[col].showError = false;
        }
      }
    } else {
      if (feedbackDetails.current[row]?.details[col]?.type === "selectchoice") {
        let value = e.target.value || "";
        let options = feedbackDetails.current[row]?.details[col]?.options || [];
        for (let option of options) {
          option.selected = false;
        }
        let selectedIndex = -1;
        let selectedObject = {};
        for (let option of options) {
          selectedIndex++;
          if (option.value == value) {
            option.selected = true;
            selectedObject = option;
            break;
          }
        }
        feedbackDetails.current[row].details[col].selectedIndex = selectedIndex;
        if (value.trim()) {
          feedbackDetails.current[row].details[col].showError = false;
        }
        if (feedbackDetails.current[row].details[col].key === "demo_topic")
          updateMathzoneData(selectedObject, row);
      }
    }
    setUpdate(!update);
  };
  const handleValidationAndSubmit = () => {
    let isValidated = true;
    for (let information of studentInformation.current) {
      for (let item of information?.details) {
        if (item.isDisabled === false) {
          if (item.type === "keying") {
            if (!item?.options[0]?.value.toString()?.trim()) {
              item.showError = true;
              isValidated = false;
            }
          } else if (item?.type === "selectchoice") {
            let checkForTrue = false;
            for (let option of item?.options) {
              if (option.selected) {
                checkForTrue = true;
                break;
              }
            }
            if (!checkForTrue) {
              item.showError = true;
              isValidated = false;
            }
          }
        }
      }
    }
    for (let information of feedbackDetails.current) {
      for (let item of information?.details) {
        console.log(item.isDisabled);
        if (item.isDisabled === false) {
          if (item.type === "keying") {
            if (!item?.options[0]?.value.toString()?.trim()) {
              item.showError = true;
              isValidated = false;
            }
          } else if (item?.type === "selectchoice") {
            let checkForTrue = false;
            for (let option of item?.options) {
              if (option.selected && option?.value?.toString()?.trim()) {
                checkForTrue = true;
                break;
              }
            }
            if (!checkForTrue) {
              item.showError = true;
              isValidated = false;
            }
          }
        }
      }
    }
    console.log(isValidated);
    if (isValidated) {
      setLoading(true);
      let commentDetailsTemp = [];
      if (last_student) commentDetailsTemp = commentsDetails.current;
      handleSubmit(
        [
          ...feedbackDetails.current,
          ...studentInformation.current,
          ...commentDetailsTemp,
        ],
        student_id
      );
    } else {
      setUpdate(!update);
    }
  };
  return (
    <>
      {loading ? (
        <>{<h3>Loading...</h3>}</>
      ) : (
        <>
          <>
            {studentInformation.current.map((item, key) => {
              return (
                <React.Fragment key={key}>
                  {item?.title && (
                    <div className="flex gap-2 flex-wrap justify-between">
                      <h3 className="feedbackformsubtitle">{item?.title}</h3>
                    </div>
                  )}
                  {item?.details?.length && (
                    <div className="flex gap-2 flex-wrap justify-between">
                      {item?.details?.map((subItem, subKey) => (
                        <React.Fragment key={subKey}>
                          {subItem?.type === "keying" ? (
                            <>
                              <div
                                className="flex flex-col justify-center gap-2"
                                style={{ flex: 1 / item?.details?.length }}
                              >
                                <div style={{ width: "100%" }}>
                                  <label>{subItem?.label}</label>
                                  {subItem?.isEditable && (
                                    <Button
                                      style={{
                                        paddingLeft: 4,
                                        minWidth: 20,
                                        boxSizing: "content-box",
                                      }}
                                      onClick={() =>
                                        handleEnabledDisabledBtn(
                                          key,
                                          subKey,
                                          "studentInformation"
                                        )
                                      }
                                    >
                                      <img src="/menu-icon/Whiteboard.svg" />
                                    </Button>
                                  )}
                                </div>
                                <div>
                                  <TextField
                                    type="text"
                                    required={true}
                                    variant="outlined"
                                    disabled={subItem?.isDisabled}
                                    name="name"
                                    value={
                                      Array.isArray(subItem?.options)
                                        ? subItem?.options[0]?.value || ""
                                        : ""
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        key,
                                        subKey,
                                        "studentInformation"
                                      )
                                    }
                                    sx={{ width: "fit-content" }}
                                  />
                                </div>
                                {subItem?.showError && (
                                  <p
                                    className="feedback_error_msg"
                                    style={{ color: "red" }}
                                  >
                                    {subItem?.errorMsg}
                                  </p>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                className="flex flex-col justify-center gap-2"
                                style={{ flex: 1 / item?.details?.length }}
                              >
                                <div>
                                  <div style={{ width: "100%" }}>
                                    <label>{subItem?.label}</label>
                                    {subItem?.isEditable && (
                                      <Button
                                        style={{
                                          paddingLeft: 4,
                                          minWidth: 20,
                                          boxSizing: "content-box",
                                        }}
                                        onClick={() =>
                                          handleEnabledDisabledBtn(
                                            key,
                                            subKey,
                                            "studentInformation"
                                          )
                                        }
                                      >
                                        <img src="/menu-icon/Whiteboard.svg" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                {subItem.options?.length ? (
                                  <Box sx={{ minWidth: 120 }}>
                                    <FormControl fullWidth>
                                      <Select
                                        id="demo-simple-select"
                                        required={true}
                                        value={
                                          subItem.options[
                                            subItem?.selectedIndex || 0
                                          ]?.value
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            key,
                                            subKey,
                                            "studentInformation"
                                          )
                                        }
                                        disabled={subItem?.isDisabled || false}
                                      >
                                        {subItem.options?.map(
                                          (item, optionKey) => (
                                            <MenuItem
                                              value={item?.value}
                                              key={optionKey}
                                            >
                                              {item?.label}
                                            </MenuItem>
                                          )
                                        )}
                                      </Select>
                                    </FormControl>
                                    {subItem?.showError && (
                                      <p
                                        className="feedback_error_msg"
                                        style={{ color: "red" }}
                                      >
                                        {subItem?.errorMsg}
                                      </p>
                                    )}
                                  </Box>
                                ) : (
                                  ""
                                )}
                              </div>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </>
          {feedbackDetails.current.map((item, key) => {
            return (
              <React.Fragment key={key}>
                {item?.title && (
                  <div className="flex gap-2 flex-wrap justify-between">
                    <h3 className="feedbackformsubtitle">{item?.title}</h3>
                  </div>
                )}
                {item?.details?.length && (
                  <div className="flex gap-2 flex-wrap justify-between">
                    {item?.details?.map((subItem, subKey) => (
                      <React.Fragment key={subKey}>
                        {subItem?.type === "keying" ? (
                          <>
                            <div
                              className="flex flex-col justify-center gap-2"
                              style={{ flex: 1 / item?.details?.length }}
                            >
                              <div style={{ width: "100%" }}>
                                <label>{subItem?.label}</label>
                                <Button
                                  style={{
                                    paddingLeft: 4,
                                    minWidth: 20,
                                    boxSizing: "content-box",
                                  }}
                                  onClick={() =>
                                    handleEnabledDisabledBtn(key, subKey)
                                  }
                                >
                                  <img src="/menu-icon/Whiteboard.svg" />
                                </Button>
                              </div>
                              <div>
                                <TextField
                                  type="text"
                                  required={true}
                                  variant="outlined"
                                  disabled={true}
                                  name="name"
                                  value={
                                    Array.isArray(subItem?.options)
                                      ? subItem?.options[0]?.value || ""
                                      : ""
                                  }
                                  sx={{ width: "fit-content" }}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className="flex flex-col justify-center gap-2"
                              style={{ flex: 1 / item?.details?.length }}
                            >
                              <div>
                                <div style={{ width: "100%" }}>
                                  <label>{subItem?.label}</label>
                                  {subItem?.isEditable && (
                                    <Button
                                      style={{
                                        paddingLeft: 4,
                                        minWidth: 20,
                                        boxSizing: "content-box",
                                      }}
                                      onClick={() =>
                                        handleEnabledDisabledBtn(key, subKey)
                                      }
                                    >
                                      <img src="/menu-icon/Whiteboard.svg" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              {subItem.options?.length ? (
                                <Box sx={{ minWidth: 120 }}>
                                  <FormControl fullWidth>
                                    <Select
                                      id="demo-simple-select"
                                      required={true}
                                      value={
                                        subItem.options[
                                          subItem?.selectedIndex || 0
                                        ]?.value
                                      }
                                      onChange={(e) => {
                                        handleChange(e, key, subKey);
                                      }}
                                      disabled={subItem?.isDisabled || false}
                                    >
                                      {subItem.options?.map(
                                        (item, optionKey) => (
                                          <MenuItem
                                            value={item?.value}
                                            key={optionKey}
                                          >
                                            {item?.label}
                                          </MenuItem>
                                        )
                                      )}
                                    </Select>
                                  </FormControl>
                                  {subItem?.showError && (
                                    <p
                                      className="feedback_error_msg"
                                      style={{ color: "red" }}
                                    >
                                      {subItem?.errorMsg}
                                    </p>
                                  )}
                                </Box>
                              ) : (
                                ""
                              )}
                            </div>
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
          {last_student && (
            <>
              {commentsDetails.current.map((item, key) => {
                return (
                  <React.Fragment key={key}>
                    {item?.title && (
                      <div className="flex gap-2 flex-wrap justify-between">
                        <h3 className="feedbackformsubtitle">{item?.title}</h3>
                      </div>
                    )}
                    {item?.details?.length && (
                      <div className="flex gap-2 flex-wrap justify-between">
                        {item?.details?.map((subItem, subKey) => (
                          <React.Fragment key={subKey}>
                            {subItem?.type === "keying" ? (
                              <>
                                <div
                                  className="flex flex-col justify-center gap-2"
                                  style={{ flex: 1 / item?.details?.length }}
                                >
                                  <div style={{ width: "100%" }}>
                                    <label>{subItem?.label}</label>
                                    {subItem?.isEditable && (
                                      <Button
                                        style={{
                                          paddingLeft: 4,
                                          minWidth: 20,
                                          boxSizing: "content-box",
                                        }}
                                        onClick={() =>
                                          handleEnabledDisabledBtn(
                                            key,
                                            subKey,
                                            "commentDetails"
                                          )
                                        }
                                      >
                                        <img src="/menu-icon/Whiteboard.svg" />
                                      </Button>
                                    )}
                                  </div>
                                  <div>
                                    <TextField
                                      type="text"
                                      required={true}
                                      variant="outlined"
                                      disabled={subItem?.isDisabled}
                                      name="name"
                                      value={
                                        Array.isArray(subItem?.options)
                                          ? subItem?.options[0]?.value || ""
                                          : ""
                                      }
                                      onChange={(e) =>
                                        handleChange(
                                          e,
                                          key,
                                          subKey,
                                          "commentDetails"
                                        )
                                      }
                                      sx={{ width: "fit-content" }}
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  className="flex flex-col justify-center gap-2"
                                  style={{ flex: 1 / item?.details?.length }}
                                >
                                  <div>
                                    <div style={{ width: "100%" }}>
                                      <label>{subItem?.label}</label>
                                      {subItem?.isEditable && (
                                        <Button
                                          style={{
                                            paddingLeft: 4,
                                            minWidth: 20,
                                            boxSizing: "content-box",
                                          }}
                                          onClick={() =>
                                            handleEnabledDisabledBtn(
                                              key,
                                              subKey,
                                              "commentDetails"
                                            )
                                          }
                                        >
                                          <img src="/menu-icon/Whiteboard.svg" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  {subItem.options?.length ? (
                                    <Box sx={{ minWidth: 120 }}>
                                      <FormControl fullWidth>
                                        <Select
                                          id="demo-simple-select"
                                          required={true}
                                          value={
                                            subItem.options[
                                              subItem?.selectedIndex || 0
                                            ]?.value
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              e,
                                              key,
                                              subKey,
                                              "commentDetails"
                                            )
                                          }
                                          disabled={
                                            subItem?.isDisabled || false
                                          }
                                        >
                                          {subItem.options?.map(
                                            (item, optionKey) => (
                                              <MenuItem
                                                value={item?.value}
                                                key={optionKey}
                                              >
                                                {item?.label}
                                              </MenuItem>
                                            )
                                          )}
                                        </Select>
                                      </FormControl>
                                      {subItem?.showError && (
                                        <p
                                          className="feedback_error_msg"
                                          style={{ color: "red" }}
                                        >
                                          {subItem?.errorMsg}
                                        </p>
                                      )}
                                    </Box>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </>
          )}
        </>
      )}
      <div style={{ textAlign: "center" }}>
        <Button variant="contained" onClick={handleValidationAndSubmit}>
          {last_student ? "Submit" : "Submit and Next"}
        </Button>
      </div>
    </>
  );
}
