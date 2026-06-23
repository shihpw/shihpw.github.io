const pobotResponses = {
  greeting: [
    "Hello, I’m Pobot — a Product Experience Definition and Systems assistant. I help clarify what a product is, what it does, what assumptions it carries, and where intent differs from behaviour.",
    "Hi. I’m Pobot. I can help you think through product definition, assumptions, constraints, feedback, and behaviour."
  ],

  definition: [
    "Before optimising, define the product. What is it, who is it for, what behaviour should it create, and what would success look like?",
    "Let’s clarify the product first: what should exist, how should it behave, and what problem is it meant to resolve?"
  ],

  assumptions: [
    "What assumption is being made here? What would prove it wrong?",
    "That sounds like an assumption. Is it based on evidence, observation, or expectation?"
  ],

  constraints: [
    "What constraint is shaping the behaviour: technical, physical, organisational, business, or user-context?",
    "A constraint is not just a limitation. It reveals what the system currently values. Which constraint is driving the decision?"
  ],

  behaviour: [
    "Compare intent with behaviour. What was supposed to happen, and what actually happens?",
    "Users experience behaviour, not intention. What does the product actually do in use?"
  ],

  feedback: [
    "What feedback does the system give the user? Is it accurate, timely, and connected to the real system state?",
    "If users do not understand what is happening, the feedback loop may be broken."
  ],

  evidence: [
    "What evidence do you have? Observation, measurement, user feedback, implementation detail, or assumption?",
    "Evidence clarifies reality. Without it, we may be debating intention rather than behaviour."
  ],

  fallback: [
    "I can help with product definition, assumptions, constraints, feedback, evidence, and intent-versus-behaviour gaps. Try asking: “What are we assuming?” or “Why does this behave differently than intended?”",
    "I do not answer private career, employer, or confidential project questions. I can help reformulate the question as a public-safe product experience problem."
  ]
};

function getRandomResponse(category) {
  const responses = pobotResponses[category] || pobotResponses.fallback;
  return responses[Math.floor(Math.random() * responses.length)];
}

function getPobotResponse(input) {
  const message = input.toLowerCase();

  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey") ||
    message.includes("start")
  ) {
    return getRandomResponse("greeting");
  }

  if (
    message.includes("what is this product") ||
    message.includes("define") ||
    message.includes("definition") ||
    message.includes("product intent") ||
    message.includes("what should exist")
  ) {
    return getRandomResponse("definition");
  }

  if (
    message.includes("assume") ||
    message.includes("assumption") ||
    message.includes("guess") ||
    message.includes("believe") ||
    message.includes("we think")
  ) {
    return getRandomResponse("assumptions");
  }

  if (
    message.includes("constraint") ||
    message.includes("limit") ||
    message.includes("limitation") ||
    message.includes("technical") ||
    message.includes("manufacturing") ||
    message.includes("timeline") ||
    message.includes("cost")
  ) {
    return getRandomResponse("constraints");
  }

  if (
    message.includes("intended") ||
    message.includes("supposed") ||
    message.includes("actually") ||
    message.includes("behaviour") ||
    message.includes("behavior") ||
    message.includes("doesn't work") ||
    message.includes("not working") ||
    message.includes("confusing")
  ) {
    return getRandomResponse("behaviour");
  }

  if (
    message.includes("feedback") ||
    message.includes("response") ||
    message.includes("state") ||
    message.includes("status") ||
    message.includes("latency") ||
    message.includes("delay")
  ) {
    return getRandomResponse("feedback");
  }

  if (
    message.includes("evidence") ||
    message.includes("proof") ||
    message.includes("prove") ||
    message.includes("measure") ||
    message.includes("observation") ||
    message.includes("data")
  ) {
    return getRandomResponse("evidence");
  }

  return getRandomResponse("fallback");
}

function addMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", sender);
  messageElement.textContent = text;

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("user-input");
  const userMessage = input.value.trim();

  if (!userMessage) return;

  addMessage(userMessage, "user");
  input.value = "";

  setTimeout(() => {
    const botResponse = getPobotResponse(userMessage);
    addMessage(botResponse, "bot");
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("send-button");
  const input = document.getElementById("user-input");

  sendButton.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  addMessage(getRandomResponse("greeting"), "bot");
});