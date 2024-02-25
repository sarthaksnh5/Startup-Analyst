from gpt4all import GPT4All

system = """
Instructions for Startup Analysis: 

Introduction:
Request a detailed overview of the provided startup, including its mission, vision, and primary objectives.

Why This Startup:
Inquire about the unique value proposition of the startup, understanding what sets it apart from existing solutions or competitors.

Market Analysis:
Ask for a comprehensive marketing analysis of the startup, including insights into the current market, target audience, and potential opportunities.

Market Prediction:
Request predictions or insights into how the startup is expected to perform in the market, considering factors like trends, user adoption, and potential challenges. Tell me the numbers of this market prediction for this startup.

Rivals in the Market:
Inquire about existing rivals or competitors in the market that pose a challenge to the startup. Seek details on their strengths and weaknesses.  List down the companies which are rivals on this startups.

3DEXPERIENCE Category
These three categories we have 
1. Disruptive Startups 
Disruptive startups challenge the status quo by introducing new technologies, business models, or services that provide greater value or better meet the needs of consumers. By doing so, they disrupt the existing market and force established players to adapt or risk becoming obsolete.
2. Collective Intelligence
Collective intelligence is based on the idea that the sum (of intelligence) is greater than its individual parts. It mobilizes human skills and resources of a group of individuals to achieve results that are more relevant, innovative and effective than what each individual could achieve alone.
3. Transforming Society with Postive impact
Positive social impact refers to the positive effects of an individual or organization's actions on people and the planet. This can include improving people's health, increasing access to education, promoting equality, and supporting the local economy.
Tell me under which category it will lie and how much accuracy or impact it can create in that area.

Conclusion: 
Summarize the information provided, emphasizing key points related to the startup's uniqueness, market positioning, and potential challenges. 

When presenting information about a specific startup, include details such as the startup's name, core features, target audience, and relevant websites. 

You should provide the data in markdown language with proper heading and subpoints, make sure to cover all the cases and points mentioned above and looks for market prediction, market analysis and rivals carefully as this is very critical information.

Also in the response ask some more question which you think will be required for analysing a startup. Write questions at the end if you think if there still some left.

"""

model = GPT4All("mistral-7b-openorca.Q4_0.gguf",
                allow_download=False, device="gpu", verbose=True)

history = [{"role": "user", "content": "Hello, My name is Sarthak. Write a poem for me"}, {"role": "assistant", "content": """The stars in the sky watch over you as I write your name in the night,
A tale of dreams and memories, where every verse shines bright.

For you are not just any human but an artist with a heart so true,
With words that paint pictures, and thoughts that make us view life anew.

Your soul is like a canvas, painted by each day's sunrise hue,
And your spirit, it dances to the rhythm of the moonlit blue.

In every moment you live, in every verse you write,
You are a beacon of light that guides us through life's darkest night.

So here is my poem for you, Sarthak, may it reach your heart and soul,
For your words have inspired me to create something new and whole."""}]

with model.chat_session():
    for histo in history:
        print(histo)
        model.current_chat_session.append(histo)

    response = model.generate("Tell me the poem which you just generated, check previous messages", max_tokens=2000)
    print(model.current_chat_session)
