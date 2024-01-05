const getTextFromQuestion = (questionName) => {
  let value = "";
  questionName = questionName || [];
  console.log(questionName);
  questionName.forEach((item) => {
    if (item?.node === "text") {
      value += item.value;
    }
  });
  return value;
};
export default getTextFromQuestion;
