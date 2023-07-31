import React from "react";

import MessageListScrollContainer from "./MessageListScrollContainer/MessageListScrollContainer";
import TextMessage from "./TextMessage/TextMessage";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";

interface MessageStructure {
  identity: string;
  message: string;
}

export default function MessageList(messages) {
  console.log("Messages in message List", messages.messages);
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant.identity;

  return (
    <MessageListScrollContainer messages={messages.messages}>
      {messages?.messages?.map((message) => {
        return (
          <React.Fragment key={message}>
            <TextMessage body={message.message!} isLocalParticipant={true} />
          </React.Fragment>
        );
      })}
    </MessageListScrollContainer>
  );
}
