export default function compareLatexData(val1, val2) {
  let str = '\\';
  val1 = String(val1);
  val2 = String(val2);
  val1 = val1.split(str);
  val2 = val2.split(str?.trim());
  //trim from begginning
  while (val1.length) {
    if (val1[0] === str || val1[0]?.trim() == "") val1.shift();
    else {
      break;
    }
  }

  while (val2.length) {
    if (val2[0] === str || val2[0]?.trim() == "") val2.shift();
    else {
      break;
    }
  }
  //trim from ending
  while (val1.length) {
    if (val1[val1.length - 1] === str || val1[val1.length - 1]?.trim() == "")
      val1.pop();
    else {
      break;
    }
  }

  while (val2.length) {
    if (val2[val2.length - 1] === str || val2[val2.length - 1]?.trim() == "")
      val2.pop();
    else {
      break;
    }
  }
 
  return val1.join(str)?.trim()===val2.join(str)?.trim()
}
