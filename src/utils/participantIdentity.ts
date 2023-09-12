import { allExcludedParticipants } from "./excludeParticipant";

interface IdentityObject {
  identity: string;
}

export function isStudentName({ identity }: IdentityObject) {
  let studentName = identity?.split("-")[1];

  return studentName;
}

export function isTutor({ identity }: IdentityObject) {
  if (identity === "tutor") {
    return true;
  } else {
    return false;
  }
}

export function isTech({ identity }: IdentityObject) {
  if (identity === "tech") {
    return true;
  } else {
    return false;
  }
}

export function isTutorTechBoth({ identity }: IdentityObject) {
  if (identity === "tutor" || identity === "tech") {
    return true;
  } else {
    return false;
  }
}

export function allExcludedParticipant({ identity }: IdentityObject) {
  if (allExcludedParticipants.includes(identity || "")) {
    return true;
  } else {
    return false;
  }
}
