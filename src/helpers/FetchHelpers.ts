interface fetchHelperProps {
  url: string;
  method: string;
  body: object;
}

export const fetchHelper = async ({ url, method, body }: fetchHelperProps) => {
  var data = {
    error: false,
    message: "",
  };

  try {
    var response;
    if (method === "GET") {
      response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    if (response.status === 200) {
      if (response.headers.get("content-type") !== "application/octet-stream") {
        try {
          let jsonData = await response.json();
          data.message = jsonData || "";
        } catch (e) {
          console.log("Error parsing JSON");
          data.error = true;
          data.message = "An error occurred while processing your request.";
        }
      } else {
        var filename = response.headers
          .get("content-disposition")
          ?.split(";")[1]
          .split("=")[1];
        response.blob().then((blob) => {
          const link = document.createElement("a");
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.download = filename;
          link.click();
        });
      }
    } else {
      // If the status is not 200, it means there was an error of some
      // sort and we can pull out the specifics from the response.
      data.error = true;
      data.message = `HTTP Error ${response.status}: ${response.statusText}`;
    }
  } catch (e: any) {
    console.log("Error in Fetch Helper", e);
    data.message = `Error in Fetch Helper ${e.message}`;
    data.error = true;
  }
  return data;
};
