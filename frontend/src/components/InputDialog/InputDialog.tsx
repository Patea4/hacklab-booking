import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";

interface InputDialogProps {
    /** the current state of the dialog box */
    open: boolean;
    /** a function to set the state of the dialog box */
    setOpen: (open: boolean) => void;
    /** the label of the input */
    label: string;
    /** a function that is called when the user submits the dialog box, passing in the value of the input */
    onSubmit: (value: string) => void;
    /** the description of the dialog box */
    description: string;
    /** the title of the dialog box */
    title: string;
}

/**
 * A dialog that asks the user to input some text before proceeding
 * @param {boolean} open a react useState hook that controls if the dialog is open or not
 * @param {Function} setOpen a react useState hook that sets the open state of the dialog
 * @param {string} title the title of the dialog
 * @param {string} label the label of the input
 * @param {Function} onSubmit a function that is called when the user submits the dialog box, passing in the value of the input
 * @param {string} description the description of the dialog box
 *
 */
export const InputDialog = ({ open, setOpen, title, label, description, onSubmit }: InputDialogProps) => {
    /** value of the input */
    const [value, setValue] = useState('');
    /** mui theme context */
    const theme = useTheme();
    /** if the dialog should be full screen */
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            aria-labelledby="add-student-title"
        >
            <DialogTitle id="add-student-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {description}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id={label.toLowerCase().replace(' ', '-')}
                    label={label}
                    type="text"
                    fullWidth
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </DialogContent>
            <DialogActions
                sx={{
                    margin: '1em',
                }}
            >
                <Button
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        setOpen(false);
                        onSubmit(value);
                        setValue('');
                    }}
                    variant="contained"
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
}
