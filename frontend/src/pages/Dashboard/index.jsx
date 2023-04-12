import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  CalendarToday as CalendarTodayIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

import {
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  ActiveRequestCard,
  EditBooking,
  InitialsAvatar,
  LabelledIconButton,
  Link,
  NoRequestsPlaceholder,
  PendingRequestCard,
} from "../../components";
import { UserContext } from "../../contexts/UserContext";

export const Dashboard = () => {
  const userInfo = useContext(UserContext);
  const [pending_requests, setPendingRequests] = useState([]);
  const [active_requests, setActiveRequests] = useState([]);
  const [editRequestID, setEditRequestID] = useState(null);
  const [openEditRequest, setOpenEditRequest] = useState(false);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/requests/myRequests")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("data");
        console.log(data);
        setActiveRequests(data);
        setPendingRequests([]);
      });
  }, []);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/requests/allRequests")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data, "all requests");
        setPendingRequests(
          data.filter((request) => request.status === "pending")
        );
      });
  }, []);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const editThisRequest = (reqID) => {
    console.log(reqID, "edit this request");
    setEditRequestID(reqID);
    setOpenEditRequest(true);
  };

  const cancelThisRequest = (reqID) => {
    console.log(reqID, "cancel this request");
    // TODO: if request is completed, remove from calendar events
    fetch(process.env.REACT_APP_API_URL + "/requests/cancelRequest/" + reqID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setActiveRequests(
      active_requests.filter((request) => request._id !== reqID)
    );
  };

  const theme = useTheme();

  return (
    <Container sx={{ py: 8 }} maxWidth="md" component="main">
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          marginTop: {
            xs: "-2em",
            sm: "-1em",
            md: "0em",
            lg: "1em",
            xl: "2em",
          },
          marginBottom: "2em",
        }}
      >
        <Box>
          <>
            <Typography component="p" variant="h5" sx={{ color: theme.palette.text.secondary }}>
              Welcome,{" "}
              {userInfo["role"] === "admin"
                ? "Administrator"
                : userInfo["role"] === "prof"
                  ? "Professor"
                  : null}
            </Typography>
            <Typography variant="h2">
              <strong>{userInfo["name"]}</strong>
            </Typography>
            {active_requests &&
              userInfo["role"] === "student" &&
              active_requests.length > 0 && (
                <Typography component="p" variant="h5">
                  You have {active_requests.length} active requests
                </Typography>
              )}
            {pending_requests &&
              (userInfo["role"] === "admin" || userInfo["role"] === "prof") &&
              pending_requests.length > 0 && (
                <Typography component="p" variant="h5" sx={{ color: theme.palette.text.secondary }}>
                  You have {pending_requests.length} pending requests
                </Typography>
              )}
          </>
        </Box>

        <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <InitialsAvatar name={userInfo["name"]} />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <Link
              href="https://hacklabbooking.utm.utoronto.ca/Shibboleth.sso/Logout?return=https://cssc.utm.utoronto.ca/"
              sx={{ textDecoration: "none", color: theme.palette.text.primary }}
            >
              <MenuItem onClick={() => { handleCloseUserMenu(); }}>
                <LogoutIcon fontSize="small" />
                <Typography>&nbsp;Logout</Typography>
              </MenuItem>
            </Link>
          </Menu>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "left",
          alignItems: "center",
          marginTop: "2em",
          marginBottom: "2em",
          flexWrap: "no-wrap",
          overflowX: "auto",
        }}
      >
        <Tooltip title="View the Hacklab Calendar" arrow placement="top">
          <Link href="/calendar" isInternalLink>
            <LabelledIconButton
              icon={<InventoryIcon />}
              color={theme.palette.app_colors.red}
              label="View Events"
            />
          </Link>
        </Tooltip>

        <Tooltip
          title="Create a booking for Professors to review"
          arrow
          placement="top"
        >
          <Link href="/book" isInternalLink>
            <LabelledIconButton
              icon={<CalendarTodayIcon />}
              color={theme.palette.app_colors.green}
              label="Book"
            />
          </Link>
        </Tooltip>

        <Tooltip
          title="View the student group you're associated with"
          arrow
          placement="top"
        >
          <Link href="/group" isInternalLink>
            <LabelledIconButton
              icon={<PeopleIcon />}
              color={theme.palette.app_colors.blue}
              label="Your Group"
            />
          </Link>
        </Tooltip>

        <Tooltip title="Access your settings" arrow placement="top">
          <Link href="/settings" isInternalLink>
            <LabelledIconButton
              icon={<SettingsIcon />}
              color={theme.palette.app_colors.yellow}
              label="Settings"
            />
          </Link>
        </Tooltip>

        {userInfo["role"] === "admin" && (
          <Tooltip
            title="Manage people who have Hacklab Access"
            arrow
            placement="top"
          >
            <Link href="/admin" isInternalLink>
              <LabelledIconButton
                icon={<AdminPanelSettingsIcon />}
                color={theme.palette.app_colors.purple}
                label="Admin"
              />
            </Link>
          </Tooltip>
        )}
      </Box>
      <Typography variant="h2" gutterBottom>
        Your Active Requests
      </Typography>
      {active_requests.length === 0 && (
        <NoRequestsPlaceholder
          text={
            "You have no active requests. Create one using the 'Book' button above."
          }
        />
      )}
      {active_requests.map((request) => {
        console.log(request);
        return (
          <ActiveRequestCard
            key={request["_id"]}
            reqID={request["_id"]}
            title={request["title"]}
            description={request["description"]}
            date={request["start_date"]}
            end={request["end_date"]}
            location={request["room"]["friendlyName"]}
            teamName={request["group"]["name"]}
            status={request["status"]}
            owner={request["owner"]["name"]}
            ownerHasTCard={request["owner"]["accessGranted"]}
            approver={request["approver"]["name"]}
            edit={editThisRequest}
            cancel={cancelThisRequest}
          />
        );
      })}

      {openEditRequest && (
        <EditBooking
          isOpen={openEditRequest}
          reqID={editRequestID}
          setOpenEditRequest={setOpenEditRequest}
        />
      )}

      {userInfo["role"] === "admin" && (
        <>
          <Typography variant="h2" gutterBottom>
            Your{" "}
            <acronym title="Booking requests that demand your attention">
              Pending Requests
            </acronym>
          </Typography>
          {pending_requests && pending_requests.length === 0 && (
            <NoRequestsPlaceholder
              text={"No requests demand your attention. Horray!"}
            />
          )}
          {pending_requests &&
            pending_requests.length > 0 &&
            pending_requests.map((request) => {
              console.log(request);
              return (
                <PendingRequestCard
                  key={request["_id"]}
                  title={request["title"]}
                  description={request["description"]}
                  date={request["start_date"]}
                  end={request["end_date"]}
                  name={request["title"]}
                  ownerID={request["owner"]}
                  groupID={request["group"]}
                  locationID={request["room"]}
                  //utorid={request["owner"]["utorid"]}
                  //location={request["room"]["friendlyName"]}
                  //teamName={request["group"]["name"]}
                  reqID={request["_id"]}
                />
              );
            })}
        </>
      )}
    </Container>
  );
};
