const objectParser = (item, index) => {
  let value = "";

  if (item?.node === "text") {
    let { style } = item;
    style = style || [];
    
    // Create a style object for React inline styles
    let styleObject = {};
    
    for (let styleItem of style) {
      if (styleItem) {
        const { type, value } = styleItem;
        switch (type) {
          case "fontWeight":
            styleObject.fontWeight = value;
            break;
          case "color":
            styleObject.color = value;
            break;
          case "fontStyle":
            styleObject.fontStyle = value;
            break;
          case "textDecoration":
            styleObject.textDecoration = value;
            break;
          case "backgroundColor":
            styleObject.backgroundColor = value;
            break;
          case "fontSize":
            styleObject.fontSize = value; // Ensure fontSize is handled as needed
            break;
          default:
            break;
        }
      }
    }
    
    value = <span style={styleObject}>{item?.value}</span>;
  } else if (item?.node === "img") {
    value = (
      <div>
        <img src={item?.value} alt="" style={{ width:item?.width||"fit-content",height:item?.height||"fit-content",float:item?.float||"" }} />
      </div>
    );
  } else if (item?.node === "audio") {
    value = <>Audio symbol</>;
  }

  // Handle new lines by wrapping content in a <div> with margin
  if (item?.inNewLine) {
    return <div style={{ width: '100%',height:'18px' }}>{value}</div>;
  }

  return value;
};

export default objectParser;

