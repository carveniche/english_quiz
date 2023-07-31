import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import ChatWindowHeader from "./ChatWindowHeader/ChatWindowHeader";
import ChatInput from "./ChatInput/ChatInput";
import clsx from "clsx";
import MessageList from "./MessageList/MessageList";
import useChatContext from "../../hooks/useChatContext/useChatContext";
import { Drawer } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chatWindowContainer: {
      background: "#FFFFFF",
      zIndex: 9,
      display: "flex",
      flexDirection: "column",
      borderLeft: "1px solid #E4E7E9",
      [theme.breakpoints.down("sm")]: {
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
      },
    },
    hide: {
      display: "none",
    },
    drawer: {
      display: "flex",
      width: theme.rightDrawerWidth,
      height: `calc(100% - ${theme.footerHeight}px)`,
    },
  })
);

// In this component, we are toggling the visibility of the ChatWindow with CSS instead of
// conditionally rendering the component in the DOM. This is done so that the ChatWindow is
// not unmounted while a file upload is in progress.

export default function ChatWindow() {
  const classes = useStyles();
  const { isChatWindowOpen, messages } = useChatContext();

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={isChatWindowOpen}
      transitionDuration={0}
      classes={{
        paper: classes.drawer,
      }}
    >
      <aside
        className={clsx(classes.chatWindowContainer, {
          [classes.hide]: !isChatWindowOpen,
        })}
      >
        <ChatWindowHeader />
        <MessageList messages={messages} />
        <ChatInput isChatWindowOpen={isChatWindowOpen} />
      </aside>
    </Drawer>
  );
}
