from gpt4all import GPT4All

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
