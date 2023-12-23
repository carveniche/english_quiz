const objectParser = (item, index) => {
  let value = "";
  if (item?.node === "text") {
    value = <>{item?.value}</>;
  } else if (item?.node === "img") {
    value = (
      <div>
        <img src={item?.value} />
      </div>
    );
  } else if (item?.node === "audio") {
    value = <>Audio symbol</>;
  }
  if (item?.inNewLine) return <div>{value}</div>;
  return value;
};
export default objectParser;
