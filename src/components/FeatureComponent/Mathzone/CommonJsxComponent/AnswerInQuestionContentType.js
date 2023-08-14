export default function AnswerInQuestionContentType(val) {
  let arr = [
    "horizontal_fill_ups",
    "horizontal",
    "vertical",
    "place_value_chart",
    "comparison_of_images",
    "options_multiple_pictures",
    "horizontalpicture",
    "place_value_table_select",
    "long_multiplication",
    "questiontextimages",
    "number_bond",
    "horizontal_fill_ups_multi_row",
  ];
  let specailType=["place_value_table_select","questiontextimages"]
  let keys=specailType.includes(String(val)?.trim())?"choices":arr.includes(String(val)?.trim())?"questionContent":false
  return keys
}
