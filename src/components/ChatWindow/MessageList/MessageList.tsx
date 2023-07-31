import React, { useEffect } from "react";

import MessageListScrollContainer from "./MessageListScrollContainer/MessageListScrollContainer";
import TextMessage from "./TextMessage/TextMessage";

import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

interface MessageStructure {
  identity: string;
  message: string;
}

export default function MessageList(messages) {
  const messagesFromStore = useSelector(
    (state: RootState) => state.dataTrackStore.ChatMessages
  );

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
