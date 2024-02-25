import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { FormControl } from "@mui/base";
import { fetchHelper } from "../../helpers/FetchHelpers";
import { addStartupURL } from "../../constants/URLConstants";
import { toast } from "react-toastify";

interface FormDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function FormDialog({ open, setOpen }: FormDialogProps) {
  const [submitLoading, setSubmitLoading] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            console.log(formJson);
            setSubmitLoading(true);
            // Simulate server response with a timeout
            var response = await fetchHelper({
              url: addStartupURL,
              method: "POST",
              body: formJson,
            });
            console.log(response);
            if (response.message == "1") {
              toast.success(
                `Added ${formJson.startup_name} to the database.` +
                  ` Please refresh the page to see changes.`
              );
              setTimeout(() => {
                handleClose();
                window.location.reload();
              }, 5000);
            } else {
              toast.error("Error adding startup");
            }

            setSubmitLoading(false);
            // handleClose();
          },
        }}
      >
        <DialogTitle>Add a Startup</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="startup_name"
            name="startup_name"
            label="Startup Name"
            type="text"
            fullWidth
            variant="standard"
          />

          <TextField
            autoFocus
            required
            margin="dense"
            id="website"
            name="website"
            label="Website"
            type="text"
            fullWidth
            variant="standard"
          />

          <TextField
            autoFocus
            required
            margin="dense"
            id="num_co_founder"
            name="num_co_founder"
            label="Number of Co-Founders"
            type="number"
            fullWidth
            variant="standard"
          />

          <TextField
            autoFocus
            required
            margin="dense"
            id="num_employees"
            name="num_employees"
            label="Number of Employees"
            type="number"
            fullWidth
            variant="standard"
          />
          <DialogContentText>Date Created</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="date_created"
            name="date_created"
            // label="Date Created"
            type="date"
            fullWidth
            variant="standard"
          />

          <TextField
            autoFocus
            required
            margin="dense"
            id="legal_status"
            name="legal_status"
            label="Legal Status of Startup"
            type="text"
            fullWidth
            variant="standard"
          />

          <TextField
            autoFocus
            required
            margin="dense"
            id="description"
            name="description"
            label="Description of the startup"
            type="text"
            fullWidth
            variant="standard"
          />

          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Project Status
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="current_status"
              id="current_status"
            >
              <FormControlLabel value="Idea" control={<Radio />} label="Idea" />
              <FormControlLabel
                value="Prototype"
                control={<Radio />}
                label="Prototype"
              />
              <FormControlLabel
                value="LifeStyle"
                control={<Radio />}
                label="LifeStyle"
              />
              <FormControlLabel
                value="Ideation"
                control={<Radio />}
                label="Ideation"
              />
              <FormControlLabel
                value="First Product"
                control={<Radio />}
                label="First Product"
              />
              <FormControlLabel
                value="Growth"
                control={<Radio />}
                label="Growth"
              />
              <FormControlLabel
                value="Other.."
                control={<Radio />}
                label="Other.."
              />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Project Theme
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="current_theme"
              id="current_theme"
            >
              <FormControlLabel value="City" control={<Radio />} label="City" />
              <FormControlLabel value="Life" control={<Radio />} label="Life" />
              <FormControlLabel
                value="LifeStyle"
                control={<Radio />}
                label="LifeStyle"
              />
              <FormControlLabel
                value="Ideation"
                control={<Radio />}
                label="Ideation"
              />
              <FormControlLabel
                value="Internet of things"
                control={<Radio />}
                label="Internet of things"
              />
              <FormControlLabel
                value="Other.."
                control={<Radio />}
                label="Other.."
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">
            {submitLoading ? (
              <>
                <CircularProgress />
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
