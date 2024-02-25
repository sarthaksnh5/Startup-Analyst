import { ListItem, ListItemText } from "@material-ui/core";
import { Button, ButtonGroup, CircularProgress, Grid } from "@mui/material";
import Markdown from "react-markdown";
import { toast } from "react-toastify";
import { fetchHelper } from "../../helpers/FetchHelpers";
import { downloadFileURL } from "../../constants/URLConstants";
import { useState } from "react";

interface MessageItemProps {
  message: Array<{}>;
  who: "user" | "assistant";
  when: string;
}

function MessageItem({ message, who, when }: MessageItemProps) {
  var alignI = who === "user" ? "right" : "left";

  const [buttonLoading, setButtonLoading] = useState(false);

  const downloadFile = async (file_id: string) => {
    setButtonLoading(true);
    try {
      let response = await fetchHelper({
        url: downloadFileURL,
        method: "POST",
        body: { file_id: file_id },
      });

      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success("Downloading File");
        // console.log(response.message);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
    setButtonLoading(false);
  };  

  return (
    <ListItem key="1">
      <Grid container>
        <Grid item xs={12}>
          <ListItemText
            align={alignI}
            secondary={who === "user" ? "3DEXPERIENCE Lab" : who.toUpperCase()}
          ></ListItemText>
        </Grid>
        <Grid item xs={12}>
          <ListItemText align={alignI}>
            {message.map((item: any, index) => {
              var buttons = [];

              if (item.text.annotations.length > 0) {
                item.text.annotations.forEach((annotation: any) => {
                  buttons.push({
                    file_path: annotation.file_path.file_id,
                    content: `Download ${
                      annotation.text.split("/")[
                        annotation.text.split("/").length - 1
                      ]
                    }`,
                  });

                  // [Download Pocket_FM_Analysis.pptx](sandbox:/mnt/data/Pocket_FM_Analysis.pptx)

                  item.text.value = item.text.value.replace(
                    `[Download ${
                      annotation.text.split("/")[
                        annotation.text.split("/").length - 1
                      ]
                    }](${annotation.text})`,
                    ""
                  );
                });
              }

              return (
                <>
                  <Markdown>{item.text.value}</Markdown>
                  {buttons.length > 0 && (
                    <ButtonGroup
                      variant="contained"
                      color="primary"
                      aria-label="contained primary button group"
                    >
                      {buttons.map(
                        (
                          buttonId: { file_path: string; content: string },
                          index
                        ) => (
                          <Button
                            key={index}
                            onClick={() => downloadFile(buttonId.file_path)}
                            disabled={buttonLoading}
                          >
                            {buttonLoading ? (
                              <CircularProgress />
                            ) : (
                              `${buttonId.content}`
                            )}
                          </Button>
                        )
                      )}
                    </ButtonGroup>
                  )}
                </>
              );
            })}
          </ListItemText>
        </Grid>
        <Grid item xs={12}>
          <ListItemText align={alignI} secondary={when}></ListItemText>
        </Grid>
      </Grid>
    </ListItem>
  );
}

export default MessageItem;
