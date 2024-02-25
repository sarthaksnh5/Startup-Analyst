import helpers
from fastapi import FastAPI
from pydantic import BaseModel
import dbHelpers
from fastapi.middleware.cors import CORSMiddleware
import scrapperHelper
from helpers import assistant_id
from fastapi.responses import FileResponse

# import json
# assistant = helpers.retrieve_assistant("asst_ZJWptesPw3uiagzBR5AiqPLf")
# print(assistant)

# thread = helpers.create_thread()
# print(thread)

# message = helpers.create_message(
#     thread.id, "I want to generate powerpoint presentation on AI. This presentation is completely on AI. This includes data of AI, what is AI, How AI workds and what can you do with AI.")
# print(message)

# helpers.run_thread(thread.id, assistant.id)
# create or retrieve assistant, create or retrieve thread, create message, run the assistant and thread

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MessageItem(BaseModel):
    thread_id: str
    content: str


class AssistantItem(BaseModel):
    instructions: str
    name: str


class StartupItem(BaseModel):
    startup_name: str
    website: str
    num_co_founder: str
    num_employees: str
    date_created: str
    legal_status: str
    description: str
    current_status: str
    current_theme: str
    thread_id: str = None


class CreatePPTItem(BaseModel):
    thread_id: str


class fileItem(BaseModel):
    file_id: str


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/startup/list")
def get_startups():
    startups = dbHelpers.get_all_thread()
    return startups


@app.post("/startup/create")
def create_new_startup(item: StartupItem):
    item.thread_id = helpers.create_thread().id
    websites = item.website.split(";")
    websiteContent = ""
    for website in websites:
        websiteContent += scrapperHelper.scrapWebsite(website)
        websiteContent += "\n"

    message = f"""
        Analysis my startup based on the data I have provided below:
        Name: {item.startup_name}
        Websites: {item.website}
        Website Content: {websiteContent}
        Number of Co-Founders: {item.num_co_founder}
        Current Legal Status: {item.legal_status}
        Number of Employees: {item.num_employees}
        Date Created: {item.date_created}
        Description of Startup: {item.description}
        Current Status of Startup: {item.current_status}
        Current Theme of Startup: {item.current_theme}

        Use the content I have provided, I have also scrapped website content from the website,
        so you just go through all the data and give me things which I have given you as instructions.
    """

    helpers.create_message(item.thread_id, message)
    helpers.run_thread(item.thread_id, assistant_id)
    newStartupID = dbHelpers.insert_thread(item.dict())

    return newStartupID


@app.get("/startup/{startup_id}")
def get_startup(startup_id):
    return dbHelpers.find_one_thread(startup_id)


@app.post("/assistant/create")
def create_assistant(item: AssistantItem):    
    return helpers.create_assistant(item.instructions, item.name)


@app.get("/assistant/list")
def list_assistant():
    return helpers.list_assistant()

# retrieve assistant through assistant id


@app.post("/thread/create/ppt")
def create_ppt(item: CreatePPTItem):
    thread_id = item.thread_id
    return helpers.make_a_ppt(thread_id)


@app.post("/file/download")
def download_file(item: fileItem):
    file_path, file_id = helpers.download_file(item.file_id)
    return FileResponse(file_path, media_type="application/octet-stream", filename=file_id, headers={"Access-Control-Expose-Headers": 'Content-Disposition'})


@app.get("/assistant/retrieve/{assistant_id}")
def retrieve_assistant(assistant_id: str):
    return helpers.retrieve_assistant(assistant_id)

# create thread


@app.post("/thread/create")
def create_thread():
    return helpers.create_thread()

# retrieve thread


@app.get("/thread/retrieve/{thread_id}")
def get_thread_info(thread_id: str):
    return helpers.retrieve_thread(thread_id)


@app.get("/thread/{thread_id}/messages/list/")
def get_thread_messages(thread_id: str):
    return helpers.list_messages(thread_id)

# create message


@app.post("/message/create")
def chat(item: MessageItem):
    helpers.create_message(item.thread_id, item.content)
    return helpers.run_thread(item.thread_id, assistant_id)
