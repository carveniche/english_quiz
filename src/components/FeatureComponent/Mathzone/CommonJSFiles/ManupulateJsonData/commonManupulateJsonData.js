import { student_answer } from "./oneDto2D";
export const commonClassNameEqn="mq-selectable"
export const manupulateQuestionContent = (arr, keys = "dropVal") => {
  let temp = [];
  arr?.map((rows) =>
    rows?.map((cols) => {
      let items = { ...cols, [student_answer]: cols[keys] };
      delete items[keys];
      delete items?.show;
      temp.push({ ...items });
    })
  );
  return [...temp];
};
export const manupulateQuestionContentHorizontal = (arr, keys = "dropVal") => {
  arr = arr?.map((rows) =>
    rows?.map((cols) => {
      let items = { ...cols, [student_answer]: cols[keys] };
      delete items[keys];
      delete items?.show;
      return items;
    })
  );
  return [...arr];
};
export const manupulateJsonData = (...data) => {
  let obj = data[0];
  let keyObj = data[1];
  for (let keys in keyObj) {
    delete obj[keys];
  }
  return obj;
};
export const manupulateDataSelectChoice = (arr, value) => {
  for (let i = 0; i < arr.length; i++)
    for (let j = 0; j < arr[i]?.length; j++) {
      if (arr[i][j]?.isMissed == "true") {
        console.log(value)
        arr[i][j][student_answer] = value;
      } else {
        arr[i][j][student_answer] = "";
      }
    }
  return [...arr];
};
export const findSelectedValue = (choices, keys = "value") => {
  for (let item of choices) {
    if (item?.show === true) return item[keys];
  }
};
export const insertDataOptionMultipleChoice = (arr, value,key="selected",keyValue="true") => {
 
  for (let i = 0; i < arr.length; i++)
    for (let j = 0; j < arr[i]?.length; j++) {
      if (arr[i][j][key] == keyValue) {
        arr[i][j][student_answer] = value;
      } else {
        arr[i][j][student_answer] = "";
      }
    }
  return [...arr];
};

export const manupulateEquationTypeQuestion1D = (
  arr,
  value,
  keys = "value"
) => {
  let n = arr?.length || 0;
  for (let i = 0; i < n; i++) {
    if (arr[i]?.isMissed === "true") {
      let str = `${arr[i]?.row}row${arr[i]?.col}col`;
      let values = String(arr[i][keys]);
      if (values?.includes(commonClassNameEqn))
        arr[i].dropVal = `<span class=${commonClassNameEqn}>${
          "$" + value[str] + "$"
        }</span>`;
      else arr[i].dropVal = value[str];
    } else {
      arr[i].dropVal = "";
    }
  }
  return [...arr];
};

export const manupulateQuestionContent1Darray = (arr) => {
  arr = arr?.map((item) => {
    let obj = { ...item, [student_answer]: item?.dropVal };
    return { ...obj };
  });
  return arr;
};
export const manupulateQuestionContentDnd2d = (arr, keys = "value") => {
  return arr?.map((rows) =>
    rows?.map((cols) => {
      if (cols?.isMissed == "true") {
        cols[student_answer] = cols?.dropVal;
      } else {
        cols[student_answer] = "";
      }
      return { ...cols };
    })
  );
};

export const deleteKeysFromArray = (arr, keys) => {
  if (typeof arr !== "object") return;
  if (!Array.isArray(arr)) {
    for (let key in keys) {
      delete arr[key];
    }
    return { ...arr };
  }
  for (let i = 0; i < arr?.length; i++) {
    arr[i] = deleteKeysFromArray(arr[i], keys);
  }
  return [...arr];
};

export const twoDto1DArray = (arr) => {
  let temp = [];
  arr?.map((item) =>
    item?.map((items) => {
      temp.push(items);
    })
  );
  return temp;
};
export const optionMultiplePictureQuestionContent = (arr) => {
  return arr?.map((item) => {
    if (item?.show === true) item[student_answer] = item?.value;
    else {
      item[student_answer] = "";
    }
    return { ...item };
  });
};
export default function oneDto2DStartWithSpecificRow(arr, index = 0) {
  let temp = [];
  for (let i = 0; i < arr?.length; i++) {
    let { row } = arr[i];
    let tempArr = temp[Number(row - index)] || [];
    tempArr.push({ ...arr[i] });
    temp[Number(row - index)] = [...tempArr];
  }
  return temp;
}

export const logicalTableKgQuestionContent = (arr, values) => {
  let n = arr?.length || 0;
  for (let i = 0; i < n; i++) {
    let m = arr[i]?.length || 0;
    for (let j = 0; j < m; j++) {
      const { row, col } = arr[i][j];
      let str = `${row}${col}`;
      arr[i][j][student_answer] = values[str] || false;
    }
  }
  return [...arr];
};
export const numberQuestionContentQuestionContent = (arr, value) => {
  return arr?.map((item) => {
    let { row, col } = item;
    let str = `${row} ${col}`;
    item[student_answer] = value[str] || "";
    return item;
  });
};
const iterateArr = (val) => {
  
    if (typeof val === "object"){
      if (Array.isArray(val)) {
        for (let item of val) {
          let result = iterateArr(item);
          if (result[0] === true) {
            return result;
          }
        }
      } else {
        if (val?.isMissed === "true"||val?.selected==="true"||val?.option==="true") {
          let result = val?.value||val?.image
          return [true, result];
        }
      }
  }

  return [];
};
export const findAnswerValue = (questionContent, choices) => {
  let val1;
  let val2;
  if (Array.isArray(questionContent)) {
    val1 = iterateArr(questionContent);
    
 
  }
  return val1[1];
};
