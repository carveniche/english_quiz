import { useState } from "react";

import ChatIcon from "@material-ui/icons/CommentOutlined";
import Tooltip from "@material-ui/core/Tooltip";

import ChatInput from "./ChatInput";
import { Button, ClickAwayListener, withStyles } from "@material-ui/core";

const LightTooltip = withStyles({
  tooltip: {
    backgroundColor: "white",
  },
  arrow: {
    color: "white",
  },
})(Tooltip);

export default function ChatSnackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <LightTooltip
        title={<ChatInput />}
        interactive
        placement="top"
        arrow={true}
        open={isOpen}
      >
        <Button
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          startIcon={<ChatIcon />}
        >
          Snack Chat
        </Button>
      </LightTooltip>
    </ClickAwayListener>
  );
}
