import {
    Select,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    MenuItem,
    DialogContent,
    DialogContentText,
} from '@mui/material';
import React, { useState } from 'react';

import { SnackbarContext } from '../../contexts/SnackbarContext';

import axios, { catchAxiosError } from '../../axios';

interface RoleChangerProps {
    /** the utorid of the user whose role is being changed */
    utorid: string;
    /** the current role of the user */
    userRole: string;
    /** a react function that will be called updating the role */
    setUpdate: (update: number) => void;
}

/**
 * a button that opens a menu with the options
 * to change the role of a user to student, approver, tcard, or admin
 *
 * @property {string} utorid - the utorid of the user whose role is being changed
 * @property {string} userRole - the current role of the user
 * @property {function} setUpdate - a react function that will be called updating the role
 *
 * @returns {JSX.Element} - the rendered button
 */
export const RoleChanger = ({ utorid, userRole, setUpdate }: RoleChangerProps): JSX.Element => {
    const [role, setRole] = useState<string>(userRole);
    const [open, setOpen] = useState<boolean>(false);

    const { showSnack, showSnackSev } = React.useContext(SnackbarContext);

    const handleRoleChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setRole(event.target.value);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        await axios
            .put(`/accounts/${utorid}/changerole`, { role: role })
            .then(() => {
                showSnack(`Changed ${utorid}'s role to ${role}`);
                setUpdate(Math.random());
            })
            .catch(catchAxiosError(`Failed to change ${utorid}'s role`, showSnackSev))
            .finally(() => {
                setOpen(false);
            });
    };

    return (
        <>
            <Button onClick={handleOpen}>Change Role</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change Role</DialogTitle>
                <DialogContent>
                    <DialogContentText>Change the role of {utorid} to:</DialogContentText>
                    <Select value={role} onChange={handleRoleChange} label="Role">
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="approver">Approver</MenuItem>
                        <MenuItem value="tcard">TCard</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
