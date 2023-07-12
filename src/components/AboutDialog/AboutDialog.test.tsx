import AboutDialog from "./AboutDialog";
import { render } from "@testing-library/react";
import { useAppState } from "../../state";

jest.mock("twilio-video", () => ({ version: "1.2", isSupported: true }));
jest.mock("../../state");
jest.mock("../../../package.json", () => ({ version: "1.3" }));

const mockUseAppState = useAppState as jest.Mock<any>;
mockUseAppState.mockImplementation(() => ({ roomType: undefined }));

describe("the AboutDialog component", () => {
  it("should display Video.isSupported", () => {
    const { getByText } = render(
      <AboutDialog open={true} onClose={() => {}} />
    );
    expect(getByText("Browser supported: true")).toBeTruthy();
  });

  it("should display the SDK version", () => {
    const { getByText } = render(
      <AboutDialog open={true} onClose={() => {}} />
    );
    expect(getByText("SDK Version: 1.2")).toBeTruthy();
  });

  it("should display the package.json version", () => {
    process.env.REACT_APP_VERSION = "1.3";
    const { getByText } = render(
      <AboutDialog open={true} onClose={() => {}} />
    );
    expect(getByText("App Version: 1.3")).toBeTruthy();
  });

  it("should not display the room type when it is unknown", () => {
    const { queryByText } = render(
      <AboutDialog open={true} onClose={() => {}} />
    );
    expect(queryByText("Room Type:")).not.toBeTruthy();
  });

  it("should display the room type", () => {
    mockUseAppState.mockImplementationOnce(() => ({ roomType: "group" }));
    const { getByText } = render(
      <AboutDialog open={true} onClose={() => {}} />
    );
    expect(getByText("Room Type: group")).toBeTruthy();
  });
});
