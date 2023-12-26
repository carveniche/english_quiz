const objectParser = (item, index) => {
  let value = "";
  if (item?.node === "text") {
    let { styles } = item;
    styles = styles || item?.style || [];
    if (styles.length) {
      let cssStyle = {};
      for (let style of styles) {
        if (style.textDecoration) {
          cssStyle.textDecoration = style.textDecoration;
        } else if (style?.fontWeight) {
          cssStyle.fontWeight = style.fontWeight;
        } else if (style?.color) {
          cssStyle.color = style.color;
        } else if (style?.fontStyle) {
          cssStyle.fontStyle = style.fontStyle;
        }
      }
    }
    value = <>{item?.value}</>;
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
