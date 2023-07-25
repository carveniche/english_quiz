import { allExcludedParticipants } from "./excludeParticipant";

interface identity {
  identity?: string;
}

export function isTutor({ identity }: identity) {
  if (identity === "tutor") {
    return true;
  } else {
    return false;
  }
}

export function isTech({ identity }: identity) {
  if (identity === "tech") {
    return true;
  } else {
    return false;
  }
}

export function isTutorTechBoth({ identity }: identity) {
  if (identity === "tutor" || identity === "tech") {
    return true;
  } else {
    return false;
  }
}

export function allExcludedParticipant({ identity }: identity) {
  if (allExcludedParticipants.includes(identity || "")) {
    return true;
  } else {
    return false;
  }
}
