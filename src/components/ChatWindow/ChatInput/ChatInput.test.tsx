import { mount, shallow } from "enzyme";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import ChatInput from "../ChatInput/ChatInput";
import SendMessageIcon from "../../../icons//SendMessageIcon";

import * as utils from "../../../utils/devices";

jest.mock("@material-ui/core/useMediaQuery");

const mockHandleSendMessage = jest.fn<any, (string | FormData)[]>(() =>
  Promise.resolve()
);

describe("the ChatInput component", () => {
  beforeEach(() => {
    // @ts-ignore
    utils.isMobile = false;
  });

  afterEach(jest.clearAllMocks);

  it("should enable the send message button when user types a valid message", () => {
    const wrapper = shallow(<ChatInput isChatWindowOpen={true} />);
    expect(wrapper.find(SendMessageIcon).parent().prop("disabled")).toBe(true);
    wrapper
      .find(TextareaAutosize)
      .simulate("change", { target: { value: "I am a message!!!" } });
    expect(wrapper.find(SendMessageIcon).parent().prop("disabled")).toBe(false);
  });

  it("should disable the send message button when message only contains whitespace", () => {
    const wrapper = shallow(<ChatInput isChatWindowOpen={true} />);
    wrapper
      .find(TextareaAutosize)
      .simulate("change", { target: { value: "         " } });
    expect(wrapper.find(SendMessageIcon).parent().prop("disabled")).toBe(true);
  });

  it("should call the correct function when send message button is clicked", () => {
    const wrapper = shallow(<ChatInput isChatWindowOpen={true} />);
    wrapper
      .find(TextareaAutosize)
      .simulate("change", { target: { value: " I am a message!!! \n " } });
    wrapper.find(SendMessageIcon).parent().simulate("click");
    expect(mockHandleSendMessage).toHaveBeenCalledWith("I am a message!!!");
  });

  it("should only send a message and reset the textarea when Enter is pressed", () => {
    const wrapper = shallow(<ChatInput isChatWindowOpen={true} />);
    wrapper
      .find(TextareaAutosize)
      .simulate("change", { target: { value: " I am a message!!!" } });
    wrapper
      .find(TextareaAutosize)
      .simulate("keypress", { preventDefault() {}, key: "Enter" });
    expect(mockHandleSendMessage).toHaveBeenCalledWith("I am a message!!!");
    expect(wrapper.find(TextareaAutosize).prop("value")).toBe("");
  });

  it("should not send a message when Enter is pressed on mobile", () => {
    // @ts-ignore
    utils.isMobile = true;
    const wrapper = shallow(<ChatInput isChatWindowOpen={true} />);
    wrapper
      .find(TextareaAutosize)
      .simulate("change", { target: { value: "I am a message!!!" } });
    wrapper.find(TextareaAutosize).simulate("keypress", { key: "Enter" });
    expect(wrapper.find(TextareaAutosize).prop("value")).toBe(
      "I am a message!!!"
    );
    expect(mockHandleSendMessage).not.toHaveBeenCalled();
  });

  it("should not send a message when a user presses Enter+Shift", () => {
    const wrapper = shallow(<ChatInput isChatWindowOpen={true} />);
    wrapper
      .find(TextareaAutosize)
      .simulate("change", { target: { value: "I am a message!!!" } });
    wrapper
      .find(TextareaAutosize)
      .simulate("keypress", { key: "Enter", shiftKey: true });
    expect(mockHandleSendMessage).not.toHaveBeenCalled();
  });

  it("should send a media message when a user selects a file", () => {
    const wrapper = shallow(<ChatInput isChatWindowOpen={true} />);
    wrapper
      .find('input[type="file"]')
      .simulate("change", { target: { files: ["mockFile"] } });
    var formData = mockHandleSendMessage.mock.calls[0][0] as FormData;
    expect(formData).toEqual(expect.any(FormData));
    expect(formData.get("userfile")).toBe("mockFile");
  });

  it('should not send a media message when the "change" event is fired with no files', () => {
    const wrapper = shallow(<ChatInput isChatWindowOpen={true} />);
    wrapper
      .find('input[type="file"]')
      .simulate("change", { target: { files: [] } });
    expect(mockHandleSendMessage).not.toHaveBeenCalled();
  });

  it('should add the "isTextareaFocused" class to the parent of TextareaAutosize when the focus event is fired, and remove it when the blur event is fired', () => {
    const wrapper = mount(<ChatInput isChatWindowOpen={true} />);

    wrapper.find(TextareaAutosize).simulate("focus");

    expect(wrapper.find(TextareaAutosize).parent().prop("className")).toContain(
      "isTextareaFocused"
    );

    wrapper.find(TextareaAutosize).simulate("blur");

    expect(
      wrapper.find(TextareaAutosize).parent().prop("className")
    ).not.toContain("isTextareaFocused");
  });

  it("should focus on the textarea element when the chat window is opened", () => {
    const wrapper = mount(<ChatInput isChatWindowOpen={false} />);

    const textareaEl: HTMLTextAreaElement = wrapper
      .find("textarea")
      .at(0)
      .getDOMNode();

    jest.spyOn(textareaEl, "focus");
    expect(textareaEl.focus).toHaveBeenCalledTimes(0);
    wrapper.setProps({ isChatWindowOpen: true });
    expect(textareaEl.focus).toHaveBeenCalledTimes(1);
  });
});
