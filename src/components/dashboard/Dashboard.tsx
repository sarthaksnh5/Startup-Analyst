import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { AddStartupButton, StartupList } from "./listItems";
import FormDialog from "../Singup/DialogComponent";
import {
  Button,
  CircularProgress,
  Fab,
  LinearProgress,
  TextField,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import { fetchHelper } from "../../helpers/FetchHelpers";
import {
  createPPTURL,
  listMessagesURL,
  sendMessageURL,
} from "../../constants/URLConstants";
import MessageItem from "./MessageItem";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "80vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
});

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const [showModal, setShowModal] = React.useState(false);
  const [selectedStartup, setSelectedStartup] = React.useState({
    startup_name: "",
    thread_id: "",
  });

  const messageRef = React.useRef();

  const [messagesLoading, setMessagesLoading] = React.useState(true);
  const [messages, setMessages] = React.useState([]);

  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [sendMessageLoading, setSendMessageLoading] = React.useState(false);
  const [userMessage, setUserMessage] = React.useState("");

  const [downloadPPTLoading, setDownloadPPTLoading] = React.useState(false);

  const downloadPPT = async () => {
    if (selectedStartup.thread_id === "") {
      toast.error("Please select startup first");
    } else {
      setDownloadPPTLoading(true);
      try {
        var response = await fetchHelper({
          url: createPPTURL,
          method: "POST",
          body: { thread_id: selectedStartup.thread_id },
        });

        if (response.error) {
          toast.error(response.message);
        } else {
          response.message.forEach((item: any) => {
            setMessages([
              ...messages,
              {
                message: item.content,
                who: item.role,
                when: new Date(item.created_at).toLocaleTimeString(),
              },
            ]);
          });
        }
      } catch (e: any) {
        console.log(e);
        toast.error(e.message());
      }
      setDownloadPPTLoading(false);
    }
  };

  const sendMessage = async () => {
    if (userMessage === "") {
      toast.error("Please add a message");
    } else if (selectedStartup.startup_name === "") {
      toast.error("Please select a startup");
    } else {
      try {
        setMessages([
          ...messages,
          {
            message: [{ text: { annotations: [], value: userMessage } }],
            who: "user",
            when: new Date().toLocaleTimeString(),
          },
        ]);

        setSendMessageLoading(true);
        var data = {
          thread_id: selectedStartup.thread_id,
          content: userMessage,
        };
        var response = await fetchHelper({
          url: sendMessageURL,
          method: "POST",
          body: data,
        });
        console.log("Response recieved");
        if (response.error) {
          toast.error("Error sending message");
          console.log(response.message);
        } else {
          setUserMessage("");
          console.log(messageRef.current);
          console.log(response.message);
          setMessages([
            ...messages,
            {
              message: response.message.content,
              who: response.message.role,
              when: new Date(response.message.created_at).toLocaleTimeString(),
            },
          ]);
        }
        setSendMessageLoading(false);
      } catch (e) {
        toast.error(e.message);
        var temp = messages.filter((item) => item.message !== userMessage);
        setMessages(temp);
      }
    }
  };

  const getMessages = async () => {
    setMessagesLoading(true);
    try {
      var response = await fetchHelper({
        url: `${listMessagesURL}/${selectedStartup.thread_id}/messages/list/`,
        method: "GET",
        body: {},
      });

      if (response.error) {
        toast.error(response.message);
      } else {
        var data = [];
        response.message.forEach((item: any) => {
          data.push({
            message: item.content,
            who: item.role,
            when: new Date(item.created_at).toLocaleTimeString(),
          });
        });
        setMessages(data);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
    setMessagesLoading(false);
  };

  React.useEffect(() => {
    if (selectedStartup.startup_name.length > 0) {
      getMessages();
    }

    return () => {};
  }, [selectedStartup]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <CssBaseline />
        {/* top bar         */}
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              3DEXPERIENCE Lab Startup Analysis
            </Typography>
            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
          </Toolbar>
        </AppBar>
        {/* left component  */}
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Startups List
              </Typography>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <AddStartupButton
              showModal={() => {
                setShowModal(true);
              }}
            />
            <Divider sx={{ my: 1 }} />
            <StartupList
              selectedStartup={selectedStartup}
              setSelectedStartup={setSelectedStartup}
            />
          </List>
        </Drawer>
        {/* right component  */}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            width: "100%",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {/* heading */}
                <Grid container spacing={3}>
                  <Grid item>
                    <Typography
                      component="h1"
                      variant="h6"
                      color="inherit"
                      noWrap
                      sx={{ flexGrow: 1 }}
                    >
                      {selectedStartup?.startup_name}
                    </Typography>
                  </Grid>
                </Grid>
                {/* details section */}

                <Grid item xs={12}>
                  <List className={classes.messageArea}>
                    {selectedStartup.startup_name ==
                    "" ? null : messagesLoading ? (
                      <CircularProgress />
                    ) : messages.length > 0 ? (
                      <>
                        {messages.map((item, index) => {
                          return (
                            <MessageItem
                              message={item.message}
                              key={index}
                              who={item.who}
                              when={item.when}
                            />
                          );
                        })}
                      </>
                    ) : (
                      "No Messages Yet"
                    )}
                  </List>
                  <Divider />
                  <Grid
                    container
                    spacing={2}
                    style={{ paddingLeft: "20px", marginTop: 2 }}
                  >
                    <Grid item lg={3}>
                      <Button
                        variant="outlined"
                        onClick={downloadPPT}
                        disabled={downloadPPTLoading}
                      >
                        {downloadPPTLoading ? (
                          <CircularProgress />
                        ) : (
                          "Make a PPT"
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container style={{ padding: "20px" }}>
                    <Grid item xs={10}>
                      <TextField
                        id="outlined-basic-email"
                        label="Type Something"
                        fullWidth
                        disabled={sendMessageLoading}
                        // value={userMessage}
                        ref={messageRef}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={(e: any) => {
                          if (e.key === "Enter") {
                            sendMessage();
                          }
                        }}
                      />
                      {sendMessageLoading && <LinearProgress />}
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid xs={1}>
                      <Fab
                        color="primary"
                        aria-label="add"
                        disabled={sendMessageLoading}
                        onClick={sendMessage}
                      >
                        <SendIcon />
                      </Fab>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <FormDialog open={showModal} setOpen={setShowModal} />
      </Box>
    </ThemeProvider>
  );
}
