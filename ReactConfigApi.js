const React_Base_Api =
  process.env.NODE_ENV === "development"
    ? "https://hometest.begalileo.com"
    : window?.location?.origin || "https://learn.begalileo.com";

export default React_Base_Api;