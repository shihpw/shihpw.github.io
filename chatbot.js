// Simple rule-based chatbot responses
const responses = {
    greetings: {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'howdy'],
        responses: [
            "Hello! Nice to meet you! 👋",
            "Hi there! How can I help you?",
            "Hey! What's up?",
            "Greetings! What can I do for you?"
        ]
    },
    name: {
        keywords: ['what is your name', "what's your name", 'who are you', 'your name'],
        responses: [
            "I'm Pobot, your friendly chatbot! 🤖",
            "My name is Pobot. Nice to meet you!",
            "I go by Pobot. What's your name?"
        ]
    },
    howAreYou: {
        keywords: ['how are you', "how're you", 'how are you doing', 'how are you feeling'],
        responses: [
            "I'm doing great, thanks for asking! 😊",
            "I'm fantastic! Ready to chat with you!",
            "Feeling wonderful! How about you?",
            "All good here! How can I help?"
        ]
    },
    joke: {
        keywords: ['joke', 'tell me a joke', 'make me laugh', 'funny'],
        responses: [
            "Why don't scientists trust atoms? Because they make up everything! 😄",
            "What do you call a fake noodle? An impasta! 🍝",
            "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
            "What do you call a bear with no teeth? A gummy bear! 🐻"
        ]
    },
    thankYou: {
        keywords: ['thank you', 'thanks', 'appreciate', 'thank', 'thx'],
        responses: [
            "You're welcome! Happy to help! 😊",
            "Anytime! That's what I'm here for!",
            "No problem at all!",
            "My pleasure!"
        ]
    },
    help: {
        keywords: ['help', 'what can you do', 'commands', 'features'],
        responses: [
            "I can chat with you! Try asking me:\n- How are you?\n- What's your name?\n- Tell me a joke!\n- How did you get here?\nOr just have a casual conversation! 💬",
            "You can ask me questions about myself or request a joke! I'm here to chat and have fun!",
            "I'm a simple chatbot that loves to chat! Ask me anything about myself or ask for a joke! 🤖"
        ]
    },
    origin: {
        keywords: ['where did you come from', 'how did you get here', 'who created you', 'made you'],
        responses: [
            "I was created on GitHub Pages! I'm a simple rule-based chatbot built with HTML, CSS, and JavaScript. 🎉",
            "I was built by Powen using web technologies! I live on GitHub Pages. 🚀",
            "I'm a chatbot created for hellopowen.github.io!"
        ]
    },
    goodbye: {
        keywords: ['bye', 'goodbye', 'see you', 'farewell', 'exit', 'quit'],
        responses: [
            "Goodbye! Come back soon! 👋",
            "See you later! It was nice chatting with you!",
            "Catch you later! Have a great day!",
            "Farewell! Thanks for chatting with me!"
        ]
    }
};

// Function to get a random response
function getRandomResponse(responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

// Function to find a matching response
function findResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase().trim();

    for (const category in responses) {
        const category_data = responses[category];
        for (const keyword of category_data.keywords) {
            if (lowerMessage.includes(keyword)) {
                return getRandomResponse(category_data.responses);
            }
        }
    }

    // Default response if no match found
    const defaultResponses = [
        "That's interesting! Tell me more! 🤔",
        "I'm not sure I understood that. Can you rephrase?",
        "Hmm, interesting thought! What else would you like to talk about?",
        "I'm still learning! Can you ask me something else? 😊",
        "That's cool! Do you have any other questions for me?"
    ];

    return getRandomResponse(defaultResponses);
}

// Function to add a message to the chat
function addMessage(message, sender) {
    const chatWindow = document.getElementById('chatWindow');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;
    
    messageDiv.appendChild(messageParagraph);
    chatWindow.appendChild(messageDiv);
    
    // Scroll to the bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to send a message
function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (message === '') return;

    // Add user message to chat
    addMessage(message, 'user');

    // Clear input field
    userInput.value = '';

    // Get bot response
    const botResponse = findResponse(message);

    // Simulate a small delay for typing effect
    setTimeout(() => {
        addMessage(botResponse, 'bot');
    }, 300);
}

// Event listeners
document.getElementById('sendBtn').addEventListener('click', sendMessage);

document.getElementById('userInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Focus on input field when page loads
document.getElementById('userInput').focus();