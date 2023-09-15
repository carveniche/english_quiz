import { isPlainObject } from "is-plain-object";
import { excludeParticipantTechSmParent } from "./excludeParticipant";
// Recursively removes any object keys with a value of undefined
export default function removeUndefineds(obj) {
  if (!isPlainObject(obj)) return obj;

  const target = {};

  for (const key in obj) {
    const val = obj[key];
    if (typeof val !== "undefined") {
      target[key] = removeUndefineds(val);
    }
  }

  return target;
}

export const finalRemoteParticipantCount = (
  speakerViewParticipants,
  localParticipantIdentity
) => {
  let count = 0;

  if (speakerViewParticipants.length > 0) {
    for (let i = 0; i < speakerViewParticipants.length; i++) {
      if (
        !excludeParticipantTechSmParent.includes(
          speakerViewParticipants[i].identity
        )
      ) {
        count++;
      }
    }
  }

  if (excludeParticipantTechSmParent.includes(localParticipantIdentity)) {
    return count - 1;
  }

  return count;
};
