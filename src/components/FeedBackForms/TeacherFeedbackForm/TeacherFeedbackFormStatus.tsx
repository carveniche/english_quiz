import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import "../index.css";
import { useState } from "react";
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
  const [currentGender, setCurrentGender] = useState("");
  const [disabledField, setDisabledField] = useState({
    gender: false,
    name: false,
  });
  return (
    <>
      <Modal open={true}>
        <div style={{ width: "100%", maxHeight: "100vh", overflow: "auto" }}>
          <Box sx={style}>
            <div className="flex flex-col gap-4 ">
              <div className="flex gap-2 flex-wrap justify-between">
                <div className="flex flex-col justify-center gap-2">
                  <div>
                    <label>Child's Name</label>
                  </div>
                  <div>
                    <TextField
                      type="text"
                      required={true}
                      variant="outlined"
                      disabled={disabledField["name"]}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <div>
                    <label>Child's Gender</label>
                  </div>
                  <Box sx={{ minWidth: 220 }}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="demo-simple-select-label"
                        sx={{ minWidth: 220 }}
                      >
                        Gender
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Gender"
                        value={currentGender}
                        disabled={disabledField["gender"]}
                      >
                        <MenuItem value={"m"}>Boy</MenuItem>
                        <MenuItem value={"f"}>Girl</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <div>
                    <label>Child's Grade</label>
                  </div>
                  <Box sx={{ minWidth: 220 }}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="demo-simple-select-label"
                        sx={{ minWidth: 220 }}
                      >
                        Grade
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Gender"
                        value={"1"}
                        disabled={false}
                      >
                        <MenuItem value={"1"}>Grade-1</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-between">
                <div className="flex flex-col justify-center gap-2">
                  <div>
                    <label>Learning Style</label>
                  </div>
                  <Box sx={{ minWidth: 220 }}>
                    <FormControl fullWidth>
                      <Select value={currentGender}>
                        <MenuItem value="">Select Learning Style</MenuItem>
                        <MenuItem value={"Above Grade Label"}>
                          Above Grade Label
                        </MenuItem>
                        <MenuItem value={"Grade Level"}>Grade Level</MenuItem>
                        <MenuItem value={"Below Grade Level"}>
                          Below Grade Level
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <div>
                    <label>Communication</label>
                  </div>
                  <Box sx={{ minWidth: 220 }}>
                    <FormControl fullWidth>
                      <Select value={currentGender}>
                        <MenuItem value="">Select Communication</MenuItem>
                        <MenuItem value={"Above Grade Label"}>
                          Above Grade Label
                        </MenuItem>
                        <MenuItem value={"Grade Level"}>Grade Level</MenuItem>
                        <MenuItem value={"Below Grade Level"}>
                          Below Grade Level
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <div>
                    <label>Conceptual Knowledge</label>
                  </div>
                  <Box sx={{ minWidth: 220 }}>
                    <FormControl fullWidth>
                      <Select value={currentGender}>
                        <MenuItem value="">
                          Select Conceptual Knowledge
                        </MenuItem>
                        <MenuItem value={"Above Grade Label"}>
                          Above Grade Label
                        </MenuItem>
                        <MenuItem value={"Grade Level"}>Grade Level</MenuItem>
                        <MenuItem value={"Below Grade Level"}>
                          Below Grade Level
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-between">
                <div className="flex flex-col justify-center gap-2">
                  <div>
                    <label>Feature most liked by the child</label>
                  </div>
                  <Box sx={{ minWidth: 220 }}>
                    <FormControl fullWidth>
                      <Select value={currentGender}>
                        <MenuItem value="">
                          Select Feature most liked by the child
                        </MenuItem>
                        <MenuItem value={"Above Grade Label"}>
                          Above Grade Label
                        </MenuItem>
                        <MenuItem value={"Grade Level"}>Grade Level</MenuItem>
                        <MenuItem value={"Below Grade Level"}>
                          Below Grade Level
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <div>
                    <label>In class behaviour</label>
                  </div>
                  <Box sx={{ minWidth: 220 }}>
                    <FormControl fullWidth>
                      <Select value={currentGender}>
                        <MenuItem value="">Select In class behaviour</MenuItem>
                        <MenuItem value={"Above Grade Label"}>
                          Above Grade Label
                        </MenuItem>
                        <MenuItem value={"Grade Level"}>Grade Level</MenuItem>
                        <MenuItem value={"Below Grade Level"}>
                          Below Grade Level
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <div>
                    <label>Child’s current math level</label>
                  </div>
                  <Box sx={{ minWidth: 220 }}>
                    <FormControl fullWidth>
                      <Select value="1">
                        <MenuItem value="1">
                          Select child’s current math level
                        </MenuItem>
                        <MenuItem value={"Above Grade Label"}>
                          Above Grade Label
                        </MenuItem>
                        <MenuItem value={"Grade Level"}>Grade Level</MenuItem>
                        <MenuItem value={"Below Grade Level"}>
                          Below Grade Level
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
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
                  />
                </div>
              </div>
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
                  />
                </div>
              </div>
              <div>
                <Button variant="contained">Saved</Button>
              </div>
            </div>
          </Box>
        </div>
      </Modal>
    </>
  );
}
