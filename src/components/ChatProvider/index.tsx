import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface MessageStructure {
  identity: string;
  message: string;
}

type ChatContextType = {
  isChatWindowOpen: boolean;
  setIsChatWindowOpen: (isChatWindowOpen: boolean) => void;
  hasUnreadMessages: boolean;
  messages: MessageStructure[];
  setMessages: Dispatch<SetStateAction<MessageStructure[]>>;
  setHasUnreadMessages: Dispatch<SetStateAction<boolean>>;
};

export const ChatContext = createContext<ChatContextType>(null!);

interface Props {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<Props> = ({ children }) => {
  const isChatWindowOpenRef = useRef(false);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [messages, setMessages] = useState<MessageStructure[]>([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    // If the chat window is closed and there are new messages, set hasUnreadMessages to true
    if (!isChatWindowOpenRef.current && messages.length) {
      setHasUnreadMessages(true);
    }
  }, [messages]);

  useEffect(() => {
    isChatWindowOpenRef.current = isChatWindowOpen;
    if (isChatWindowOpen) setHasUnreadMessages(false);
  }, [isChatWindowOpen]);

  return (
    <ChatContext.Provider
      value={{
        isChatWindowOpen,
        setIsChatWindowOpen,
        hasUnreadMessages,
        messages,
        setMessages,
        setHasUnreadMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
