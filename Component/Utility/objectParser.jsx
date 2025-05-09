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

    value = <span style={styleObject}>{` ${item?.value} `}</span>;
  } else if (item?.node === "img") {
    value = (
       <>
        <img
          src={item?.value}
          alt=""
          style={{
            width: "100%",
            height: "100%" || "fit-content",
          }}
        />
        </>
      
    );
  } else if (item?.node === "audio") {
    value = <>Audio symbol</>;
  }else if (item?.node === "video"  || item?.node === "a") {

    value = getVideoType(item?.value)
  }

  // Handle new lines by wrapping content in a <div> with margin
  if (item?.inNewLine) {
    // return <div style={{ width: '100%',height:'18px' }}>{value}</div>;
    return <div style={{ width: "100%", height: "5px" }}>{value}</div>;
  }

  return value;
};

export default objectParser;

function getVideoType(url) {
  const youTubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i;

  if (youTubeRegex.test(url)) {
    return (

      <>
      <iframe
    width="100%"
    height="100%"
    src={url.replace("watch?v=", "embed/")}
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
      </>
    )
  }  else {
    return (

      <>
      <video width="100%" height="100%"  disablePictureInPicture controls controlsList="nodownload noplaybackrate">
    <source src={url} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
      </>
    )
  }
}
