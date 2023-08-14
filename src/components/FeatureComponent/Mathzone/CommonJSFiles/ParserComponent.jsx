import React from "react";
import parse from "html-react-parser";
import { optionSelectStaticMathField } from "../component/HorizontalFillUpsEquationType/replaceDomeNode/ReplaceDomNode";
export default function ParserComponent({ value }) {
  return (
    <>
      {typeof value == "string"
        ? parse(value, optionSelectStaticMathField)
        : value}
    </>
  );
}
