import React, { useEffect } from "react";

import MessageListScrollContainer from "./MessageListScrollContainer/MessageListScrollContainer";
import TextMessage from "./TextMessage/TextMessage";

import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import useChatContext from "../../../hooks/useChatContext/useChatContext";

export default function MessageList() {
  const messagesFromStore = useSelector(
    (state: RootState) => state.dataTrackStore.ChatMessages
  );

  const { isChatWindowOpen, setHasUnreadMessages } = useChatContext();

  useEffect(() => {
    if (!isChatWindowOpen && messagesFromStore.length) {
      setHasUnreadMessages(true);
    }
  }, [messagesFromStore]);

  return (
    <MessageListScrollContainer messages={messagesFromStore}>
      {messagesFromStore?.map((message, index) => {
        return (
          <React.Fragment key={index}>
            <TextMessage
              identity={message.identity}
              body={message.message!}
              isLocalParticipant={true}
            />
          </React.Fragment>
        );
      })}
    </MessageListScrollContainer>
  );
}
