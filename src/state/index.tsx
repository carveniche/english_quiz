import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { RoomType } from "../types";
import { TwilioError } from "twilio-video";
import {
  settingsReducer,
  initialSettings,
  Settings,
  SettingsAction,
} from "./settings/settingsReducer";

import useActiveSinkId from "../hooks/useActiveSinkId/useActiveSinkId";

import { useLocalStorageState } from "../hooks/useLocalStorageState/useLocalStorageState";

export interface StateContextType {
  error: TwilioError | Error | null;
  setError(error: TwilioError | Error | null): void;
  isFetching: boolean;
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  roomType?: RoomType;
  isGalleryViewActive: boolean;
  setIsGalleryViewActive: React.Dispatch<React.SetStateAction<boolean>>;
  maxGalleryViewParticipants: number;
  setMaxGalleryViewParticipants: React.Dispatch<React.SetStateAction<number>>;
  isKrispEnabled: boolean;
  setIsKrispEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isKrispInstalled: boolean;
  setIsKrispInstalled: React.Dispatch<React.SetStateAction<boolean>>;
  getToken: (userId: Number, liveClassId: Number) => Promise<void>;
}

//connect: (token: string) => Promise<void>;

export const StateContext = createContext<StateContextType>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks from being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isGalleryViewActive, setIsGalleryViewActive] = useLocalStorageState(
    "gallery-view-active-key",
    true
  );
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [settings, dispatchSetting] = useReducer(
    settingsReducer,
    initialSettings
  );
  const [roomType, setRoomType] = useState<RoomType>();
  const [maxGalleryViewParticipants, setMaxGalleryViewParticipants] =
    useLocalStorageState("max-gallery-participants-key", 6);

  const [isKrispEnabled, setIsKrispEnabled] = useState(false);
  const [isKrispInstalled, setIsKrispInstalled] = useState(false);
  const [userId, setUserId] = useState(67259);
  const [liveClassId, setLiveClassId] = useState(227166);
  const [videoCallToken, setVideoCallToken] = useState("");

  useEffect(() => {
    getToken(userId, liveClassId);
  }, []);

  const getToken: StateContextType["getToken"] = async (
    userId,
    liveClassId
  ) => {
    let token = await videoCallToken(userId, liveClassId);
  };

  let contextValue = {
    error,
    setError,
    isFetching,
    activeSinkId,
    setActiveSinkId,
    settings,
    dispatchSetting,
    roomType,
    isGalleryViewActive,
    setIsGalleryViewActive,
    maxGalleryViewParticipants,
    setMaxGalleryViewParticipants,
    isKrispEnabled,
    setIsKrispEnabled,
    isKrispInstalled,
    setIsKrispInstalled,
    userId,
    liveClassId,
    getToken,
  } as StateContextType;

  contextValue = {
    ...contextValue,
    // Get token from Video Call Token Api
    // getToken: async (user_identity, room_name) => {
    //   const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';

    //   return fetch(endpoint, {
    //     method: 'POST',
    //     headers: {
    //       'content-type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       user_identity,
    //       room_name,
    //       create_conversation: process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true',
    //     }),
    //   }).then(res => res.json());
    // },
  };

  // const getToken: StateContextType['getToken'] = (name, room) => {
  //   setIsFetching(true);
  //   return contextValue
  //     .getToken(name, room)
  //     .then(res => {
  //       setRoomType(res.room_type);
  //       setIsFetching(false);
  //       return res;
  //     })
  //     .catch(err => {
  //       setError(err);
  //       setIsFetching(false);
  //       return Promise.reject(err);
  //     });
  // };

  return (
    <StateContext.Provider value={{ ...contextValue }}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within the AppStateProvider");
  }
  return context;
}
