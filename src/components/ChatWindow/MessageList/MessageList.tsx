import React, { useEffect } from "react";

import MessageListScrollContainer from "./MessageListScrollContainer/MessageListScrollContainer";
import TextMessage from "./TextMessage/TextMessage";

import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import useChatContext from "../../../hooks/useChatContext/useChatContext";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";

export default function MessageList() {
  const messagesFromStore = useSelector(
    (state: RootState) => state.dataTrackStore.ChatMessages
  );
  const { room } = useVideoContext();

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
              localParticipantIdentity={room?.localParticipant.identity || ""}
            />
          </React.Fragment>
        );
      })}
    </MessageListScrollContainer>
  );
}
