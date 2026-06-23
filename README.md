# Pobot Chatbot

A simple, rule-based chatbot embedded in a GitHub Pages site.

## Features

- 💬 Rule-based conversational chatbot
- 🎨 Beautiful, responsive UI
- 🚀 Embedded directly in the page
- 📱 Mobile-friendly design
- ⚡ Instant responses

## What Pobot Can Do

- Greet you with a friendly hello
- Tell you about itself
- Share jokes
- Respond to common questions
- Have a casual conversation

## Try It Out

Visit [hellopowen.github.io](https://hellopowen.github.io) to chat with Pobot!

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `chatbot.js` - Chatbot logic and responses
- `README.md` - This file

## How to Customize

### Add New Responses

Edit `chatbot.js` and add new categories to the `responses` object:

```javascript
yourCategory: {
    keywords: ['keyword1', 'keyword2', 'keyword3'],
    responses: [
        "Response 1",
        "Response 2",
        "Response 3"
    ]
}
```

### Change the Appearance

Modify colors and styles in `styles.css`. The current color scheme uses purple gradients, but you can easily customize it!

### Update the Title

Change the title in `index.html` under the `<title>` tag and the chatbot header.

## Future Enhancements

- Add more conversation categories
- Integrate with an API
- Add user statistics
- Save conversation history
- Add more personality/emojis

Enjoy! 🎉