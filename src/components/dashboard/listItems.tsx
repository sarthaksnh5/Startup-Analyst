import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import { fetchHelper } from "../../helpers/FetchHelpers";
import { listStartupURL } from "../../constants/URLConstants";
import { toast } from "react-toastify";
import { CircularProgress, ListSubheader } from "@mui/material";

interface AddStartupButtonProps {
  showModal: (value: boolean) => void;
}

export const AddStartupButton = ({ showModal }: AddStartupButtonProps) => {
  return (
    <React.Fragment>
      <ListItemButton onClick={showModal}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Add a Startup" />
      </ListItemButton>
    </React.Fragment>
  );
};

interface StartupListProps {
  selectedStartup: boolean;
  setSelectedStartup: (value: object) => void;
}

export const StartupList = ({
  selectedStartup,
  setSelectedStartup,
}: StartupListProps) => {
  const [loading, setLoading] = React.useState(false);
  const [startups, setStartups] = React.useState([]);

  const getAllStartups = async () => {
    setLoading(true);
    try {
      console.log(listStartupURL);
      var response = await fetchHelper({
        url: listStartupURL,
        method: "GET",
        body: {},
      });
      if (response.error) {
        toast.error(response.message);
      } else {
        setStartups(response.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast("Error fetching startups");
      // toast.error(error.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getAllStartups();

    return () => {};
  }, []);

  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Saved Startups
      </ListSubheader>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {startups.length > 0 ? (
            <>
              {startups.map((item, index) => {
                return (
                  <ListItemButton
                    key={index}
                    onClick={() => setSelectedStartup(item)}
                    divider={true}
                    selected={
                      selectedStartup.startup_name === item.startup_name
                    }
                  >
                    <ListItemText primary={item.startup_name} />
                  </ListItemButton>
                );
              })}
            </>
          ) : (
            "No Startups Yet"
          )}
        </>
      )}
    </React.Fragment>
  );
};
