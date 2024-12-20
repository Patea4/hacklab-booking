import { ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Button,
    Card,
    CardContent,
    Checkbox,
    Collapse,
    Grid,
    Paper,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { TableVirtuoso } from 'react-virtuoso';
import axios, { catchAxiosError } from '../../../axios';
import { VirtuosoTableComponents } from '../../../components';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { SubPage } from '../../../layouts/SubPage';

interface TableRowData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    label: string;
    dataKey: string;
}

const userColumns: TableRowData[] = [
    { label: 'UTORid', dataKey: 'utorid' },
    { label: 'Email', dataKey: 'email' },
    { label: 'Role', dataKey: 'role' },
    { label: 'Unmark TCard Access', dataKey: 'revoke' },
];

const requestColumns: TableRowData[] = [
    { label: 'ID', dataKey: 'id' },
    { label: 'Group ID', dataKey: 'groupId' },
    { label: 'Author', dataKey: 'authorUtorid' },
    { label: 'Title', dataKey: 'title' },
    { label: 'Description', dataKey: 'description' },
    { label: 'Created At', dataKey: 'createdAt' },
    { label: 'Last Updated', dataKey: 'updatedAt' },
    { label: 'Status', dataKey: 'status' },
    { label: 'Start Time', dataKey: 'startDate' },
    { label: 'End Time', dataKey: 'endDate' },
    { label: 'Approval Reason', dataKey: 'reason' },
];

const approverColumns: TableRowData[] = [
    { label: 'UTORid', dataKey: 'utorid' },
    { label: 'Email', dataKey: 'email' },
    { label: 'Role', dataKey: 'role' },
    { label: "Can Approve this Room's Requests", dataKey: 'canApprove' },
];

/**
 * Table header for the table
 */
const fixedHeaderContent = (columns: TableRowData[]) => {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    variant="head"
                    sx={{
                        backgroundColor: 'background.paper',
                    }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );
};

/**
 * A button that allows a user to revoke access from a user
 * @property utorid the utorid of the user to revoke access from
 */
const RevokeButton = ({ utorid, onUpdate }: { utorid: string; onUpdate: () => void }) => {
    const { showSnackSev } = useContext(SnackbarContext);
    const { id: roomId } = useParams();
    const [loading, setLoading] = useState<boolean>(false);

    const revokeAccess = async () => {
        setLoading(true);
        await axios
            .put(`/rooms/${roomId}/revokeaccess`, {
                utorid,
            })
            .then(() => {
                showSnackSev(`${utorid} marked as having no access`, 'success');
            })
            .catch(catchAxiosError(`Unable to revoke access from ${utorid}`, showSnackSev))
            .finally(() => {
                setLoading(false);
                onUpdate();
            });
    };

    return (
        <Tooltip
            title={`Revoking access using this button does not affect ${utorid}'s TCard access. It only removes them from this system.`}
        >
            <Button onClick={revokeAccess} disabled={loading}>
                Revoke {utorid}
            </Button>
        </Tooltip>
    );
};

/**
 * A table that shoes a list of users given a list of users
 * @property rows a list of users
 */
const UserAccessTable = ({
    rows,
    columns,
    CellContent,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows: any[];
    columns: TableRowData[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CellContent?: ({ row, column }: { row: TableRowData; column: any }) => JSX.Element;
}) => {
    return (
        <Paper style={{ height: '90vh', width: '100%' }} elevation={0}>
            <TableVirtuoso
                data={rows}
                // @ts-expect-error - dataKey is not in the type definition
                components={VirtuosoTableComponents}
                fixedHeaderContent={() => {
                    return fixedHeaderContent(columns);
                }}
                itemContent={(_index, row: TableRowData) => (
                    <>
                        {columns.map((column, index) => {
                            if (CellContent) {
                                return (
                                    <TableCell key={index}>
                                        <CellContent row={row} column={column} />
                                    </TableCell>
                                );
                            } else {
                                return <TableCell key={index}>{row[column.dataKey]}</TableCell>;
                            }
                        })}
                    </>
                )}
            />
        </Paper>
    );
};

export const RoomViewer = () => {
    const { showSnackSev } = useContext(SnackbarContext);
    const { id: roomId } = useParams();
    const [name, setName] = useState<string>(roomId || '');
    const [room, setRoomData] = useState<FetchedRoom>({
        approvers: [],
        capacity: -1,
        friendlyName: 'Loading...',
        requests: [],
        roomName: 'Loading...',
        userAccess: [],
    });
    const [expanded, setExpanded] = useState<string | false>('history');
    const [approvers, setApproversBackend] = useState([]);

    useEffect(() => {
        (async () => {
            await axios
                .get('/accounts/approvers')
                .then(({ data }) => {
                    setApproversBackend(data);
                })
                .catch(catchAxiosError('Unable to get approvers', showSnackSev));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    const getRoomData = async () => {
        await axios
            .get(`/rooms/${roomId}`)
            .then((res) => {
                if (res.status === 200) {
                    setRoomData(res.data);
                    if (res.data.friendlyName && res.data.roomName) {
                        setName(`${res.data.friendlyName} (${res.data.roomName})`);
                    } else {
                        showSnackSev('Room name not found', 'error');
                        console.error('Room name not found', res.data);
                    }
                }
            })
            .catch(catchAxiosError('Unable to get room data', showSnackSev));
    };

    // get room data
    useEffect(() => {
        void getRoomData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    return (
        <SubPage name={name} maxWidth="xl">
            <Grid container spacing={2} sx={{ marginBottom: '1em' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            Capacity
                            <Typography variant="h2" component="div">
                                {room.capacity}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            Pending Requests
                            <Typography variant="h2" component="div">
                                {room.requests.filter((request) => request.status === 'pending').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            Requests that need TCard access
                            <Typography variant="h2" component="div">
                                {room.requests.filter((request) => request.status === 'needTCard').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            Unique people who have requested access
                            <Typography variant="h2" component="div">
                                {
                                    room.requests
                                        .map((request) => request.authorUtorid)
                                        .filter((value, index, self) => self.indexOf(value) === index).length
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <TransitionGroup>
                {room.approvers.length === 0 && (
                    <Collapse>
                        <Alert severity="warning" sx={{ my: '2em' }}>
                            This room has no approvers. This means that no one can approve requests for this room. To
                            make this room bookable, add approvers to this room.
                        </Alert>
                    </Collapse>
                )}
            </TransitionGroup>

            <Accordion
                expanded={expanded === 'approvers'}
                onChange={handleChange('approvers')}
                TransitionProps={{ unmountOnExit: true }}
            >
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Approvers for this room</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{room.approvers.length} approver(s) total</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <UserAccessTable
                        rows={approvers}
                        columns={approverColumns}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        CellContent={({ row, column }: { row: TableRowData; column: any }) => {
                            if (column.dataKey === 'canApprove') {
                                return (
                                    <Checkbox
                                        checked={room.approvers
                                            .map((approver) => approver.utorid)
                                            .includes(row['utorid'])}
                                        onChange={async (e) => {
                                            const apiRoute = (e.target as HTMLInputElement).checked
                                                ? 'addapprover'
                                                : 'removeapprover';
                                            await axios
                                                .put(`/rooms/${roomId}/${apiRoute}`, {
                                                    utorid: row['utorid'],
                                                })
                                                .then(() => {
                                                    showSnackSev(
                                                        `Approver ${row['utorid']} ${
                                                            apiRoute === 'addapprover' ? 'added' : 'removed'
                                                        }`,
                                                        'success',
                                                    );
                                                })
                                                .catch(catchAxiosError('Unable to update approvers', showSnackSev))
                                                .finally(getRoomData);
                                        }}
                                    />
                                );
                            } else {
                                return <>{row[column.dataKey]}</>;
                            }
                        }}
                    />
                </AccordionDetails>
            </Accordion>

            <Accordion
                expanded={expanded === 'access'}
                onChange={handleChange('access')}
                TransitionProps={{ unmountOnExit: true }}
            >
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Users with access to this room</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        {room.userAccess.length} user(s) with access total
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <UserAccessTable
                        rows={room.userAccess}
                        columns={userColumns}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        CellContent={({ row, column }: { row: TableRowData; column: any }) => {
                            if (column.dataKey === 'revoke') {
                                return <RevokeButton utorid={row['utorid']} onUpdate={getRoomData} />;
                            } else {
                                return <>{row[column.dataKey]}</>;
                            }
                        }}
                    />
                </AccordionDetails>
            </Accordion>

            <Accordion
                expanded={expanded === 'history'}
                onChange={handleChange('history')}
                TransitionProps={{ unmountOnExit: true }}
            >
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel2a-content" id="panel2a-header">
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>History of requests for this room</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{room.requests.length} request(s) total</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <UserAccessTable rows={room.requests} columns={requestColumns} />
                </AccordionDetails>
            </Accordion>
        </SubPage>
    );
};
