import { useEffect } from "react";

import useSpeakerViewParticipants from "../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import { useDispatch } from "react-redux";
import { addTechJoinedClass } from "../../redux/features/liveClassDetails";

import { isTech } from "../../utils/participantIdentity";

export default function TechJoinedClass() {
  const speakerViewParticipants = useSpeakerViewParticipants();

  const dispatch = useDispatch();

  useEffect(() => {
    if (speakerViewParticipants.length > 0) {
      techPresentInClass(speakerViewParticipants);
    }
  }, []);

  const techPresentInClass = (speakerViewParticipants: any) => {
    for (let i = 0; i < speakerViewParticipants.length; i++) {
      if (isTech({ identity: speakerViewParticipants[i].identity })) {
        dispatch(addTechJoinedClass(true));
        break;
      }
    }
  };
  return <></>;
}
