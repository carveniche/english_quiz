import React from "react";
import HtmlParser from "react-html-parser";
export default function HtmlParserComponent({ value }) {
  return <>{typeof value == "string" ? HtmlParser(value) : value}</>;
}
