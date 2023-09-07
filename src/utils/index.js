export const mapToArray = (map) => Array.from(map.values());

export const isTutorCheck = (localParticipant) => {
  return localParticipant == "tutor" || localParticipant == "tech";
};

export const isParent = (localParticipant) => {
  return localParticipant == "parent";
};

export const studentName = (identity) => {
  if (identity == "tutor" || identity == "tech") {
    return identity;
  } else {
    const identityData = identity.split("-");
    return identityData[1];
  }
};

export const studentId = (identity) => {
  if (identity == "tutor" || identity == "tech") {
    return identity;
  } else {
    const identityData = identity.split("-");
    return identityData[0];
  }
};

export const studentID = ([...identity]) => {
  const identityData = identity;
  const change = identityData.toString();
  const x = change.split("-");
  return x[0];
};

export const studentIDfullname = ([...identity]) => {
  const identityData = identity;
  const change = identityData.toString();
  return change;
};

export const studentIDScratch = (identity) => {
  const identityData = identity;
  const change = identityData.split("-");
  console.log("Change", change);
  return change[0];
};
