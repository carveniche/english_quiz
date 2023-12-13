import { excludeParticipantTechSmParent } from "./excludeParticipant";

interface IdentityObject {
  identity: string;
}

export function isStudentName({ identity }: IdentityObject) {
  let studentName = "";

  if (identity) {
    const splitIdentity = identity.split("-");
    if (splitIdentity.length > 1) {
      studentName = splitIdentity[1].split(" ").slice(0, 2).join(" ");
    } else {
      // Handle the case when there is no hyphen in the identity
      studentName = "Nil";
    }
  } else {
    // Handle the case when identity is undefined
    studentName = "Nil";
  }

  return studentName;
}

export function isStudentId({ identity }: IdentityObject) {
  let studentName = identity?.split("-")[0];

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

export function isParent({ identity }: IdentityObject) {
  if (identity === "parent") {
    return true;
  } else {
    return false;
  }
}

export function isParentOrSM({ identity }: IdentityObject) {
  if (
    identity === "sm" ||
    identity === "smmanger" ||
    identity === "audit" ||
    identity === "parent"
  ) {
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
  if (excludeParticipantTechSmParent.includes(identity || "")) {
    return true;
  } else {
    return false;
  }
}
