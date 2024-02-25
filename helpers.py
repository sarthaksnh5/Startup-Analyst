from openai import OpenAI

my_api_key = ""
oizom_api_key = ""

client = OpenAI(api_key=oizom_api_key)
# client = OpenAI(api_key=my_api_key)

# assistant_id = "asst_kzai13rar1acPaaYN70u8822" #my assistnat
assistant_id = "" #oizom assistnat


def create_assistant(instructions, name):
    my_assistant = client.beta.assistants.create(
        instructions=instructions,
        name=name,
        tools=[{"type": "code_interpreter"}],
        model="gpt-3.5-turbo-16k",
    )
    return my_assistant


def retrieve_assistant(assistant_id):
    my_assistant = client.beta.assistants.retrieve(assistant_id)
    return my_assistant


def list_assistant():
    try:
        my_assistants = client.beta.assistants.list(order="desc", limit="20")
        return my_assistants.data
    except Exception as e:
        return {'error': e}


def create_thread():
    thread = client.beta.threads.create()
    return thread


def retrieve_thread(thread_id):
    return client.beta.threads.retrieve(thread_id)


def create_message(thread_id, content):
    thread_message = client.beta.threads.messages.create(
        thread_id,
        role="user",
        content=content
    )

    return thread_message


def list_messages(thread_id):
    messages = client.beta.threads.messages.list(thread_id, order="asc")
    return messages.data


def make_a_ppt(thread_id):
    messages = client.beta.threads.messages.list(thread_id, order="asc")
    data = []

    for message in messages.data:
        data.append(message.content[0].text.value)

    content = "\n".join(data)
    prompt = f"""        
        I have provided content below regarding a startup. Here is the content
        {content}
        Now I want to generate code using python pptx library to generate the ppt save the ppt file name using startup name.        
    """

    create_message(thread_id, prompt)
    run_thread(thread_id, assistant_id)

    messages = client.beta.threads.messages.list(
        thread_id, order="asc").data[-2:]

    return messages


def download_file(file_id):
    content = client.files.content(file_id).content
    filename = client.files.retrieve(file_id).filename.split("/")[-1]
    filepath = 'Download/' + filename
    f = open(filepath, "wb")
    f.write(content)
    f.close()

    return (filepath, filename)


def run_thread(thread_id, assistant_id):
    run = client.beta.threads.runs.create(
        thread_id=thread_id, assistant_id=assistant_id)

    steps = client.beta.threads.runs.retrieve(
        thread_id=thread_id,
        run_id=run.id
    )

    while steps.status != "completed":
        steps = client.beta.threads.runs.retrieve(
            thread_id=thread_id,
            run_id=run.id
        )

    return client.beta.threads.messages.list(thread_id).data[0]
