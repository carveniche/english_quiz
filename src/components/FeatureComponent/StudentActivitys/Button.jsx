import React from 'react'

export default function Button({onClick,text}) {
  
  return (
    <button
    style={{
      padding: "16px 32px",
      background: "linear-gradient(90deg, #3E74FF 0%, #3E46FF 100%)",
      color: "#FFFFFF",
      display: "flex",
      minWidth: "260px",
      width: "260px",
      maxWidth: "260px",
      height: 47,
      float: "right",
      borderRadius: "26px",
      justifyContent:'center',
      alignItems:"center",
      textAlign:"center",
      boxShadow:"2px 4px 8px rgba(6, 50, 163, 0.2)",
      fontFamily: 'Montserrat',
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: "12px",
      lineHeight: "15px"
    }}
    onClick={onClick}
  >
    {text??"I am Done"}
  </button>
  )
}
