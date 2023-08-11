import { Alert } from "@mui/material"
import React from "react"
import styled from "styled-components"
export default function CustomAlertBoxMathZone({msg}){
return <AlertBox><Alert severity="error" style={{width:"100%",textAlign:'center'}}>{msg?msg:"Please choose the answer..."}</Alert></AlertBox>
}

const AlertBox=styled.div`
margin-bottom:0.7rem;
svg{
    display:none !important;
}
> div{
    color: rgb(95, 33, 32);;
    font-weight:normal !important;
}
div{
    font-weight:100 !important;
}

`