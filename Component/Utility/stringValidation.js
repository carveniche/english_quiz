export const checkTwoString = (a, b) => {
  a = a || "";
  b = b || "";
  console.log({ a, b });
  a = a.toLowerCase();
  b = b.toLowerCase();
  a = a.trim();
  b = b.trim();
  return a == b;
};
