import { useEffect } from "react";

import useSpeakerViewParticipants from "../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import { useDispatch } from "react-redux";
import { addParentJoinedClass } from "../../redux/features/liveClassDetails";

import { isParent } from "../../utils/participantIdentity";

export default function ParentJoinedClass() {
  const speakerViewParticipants = useSpeakerViewParticipants();

  const dispatch = useDispatch();

  useEffect(() => {
    if (speakerViewParticipants.length > 0) {
      parentPresentInClass(speakerViewParticipants);
    }
  }, []);

  const parentPresentInClass = (speakerViewParticipants: any) => {
    for (let i = 0; i < speakerViewParticipants.length; i++) {
      if (isParent({ identity: speakerViewParticipants[i].identity })) {
        dispatch(addParentJoinedClass(true));
        break;
      }
    }
  };
  return <></>;
}
