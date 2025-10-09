import { Box, Button, Modal } from '@mui/material';
import React from 'react'

export default function AlertModal({onClose, msg }) {
    const [open, setOpen] = React.useState(true);
    function handleGoHome() {
        setOpen(false)
        onClose(false)
    }
    return (
        <Modal
            open={open}
            container={document.body}
        >
            <Box sx={{ ...styleBox }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                    <p className='para_text center'>
                        {msg || ""}
                    </p>
                    <Button

                        variant="contained"
                        onClick={handleGoHome}

                    >

                        OK
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}

export const styleBox = {

    position: 'absolute',
    top: '50%',
    left: '50%',
    width: "400px",
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    outline: 'none',
    border: 'none',
    p: '23px',

};



