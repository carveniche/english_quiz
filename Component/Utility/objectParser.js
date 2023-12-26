const objectParser = (item, index) => {
  let value = "";
  if (item?.node === "text") {
    let { styles } = item;
    styles = styles || item?.style || [];
    if (styles.length) {
      let selectedValue = {};
      for (let style of styles) {
        if (style) {
          const { type, value } = style;
          if (type === "fontWeight") {
            selectedValue[type] = value;
            selectedValue["color"] = "black";
          } else if (type === "color") {
            selectedValue[type] = value;
          } else if (type === "fontStyle") {
            selectedValue[type] = value;
          } else if (type === "textDecoration") {
            selectedValue[type] = value;
          }
        }
      }
      console.log(selectedValue);

      value = <span style={selectedValue}>{item?.value}</span>;
    } else value = <>{item?.value}</>;
  } else if (item?.node === "img") {
    value = (
      <div>
        <img src={item?.value} style={{ textDecoration: "under" }} />
      </div>
    );
  } else if (item?.node === "audio") {
    value = <>Audio symbol</>;
  }
  if (item?.inNewLine) return <div style={{ marginTop: 4 }}>{value}</div>;
  return value;
};
export default objectParser;
