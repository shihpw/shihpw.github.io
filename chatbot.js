const pobotState = {
  mode: null,
  step: 0,
  answers: {}
};

const workflows = {
  definition: {
    title: "Product Definition Canvas",
    steps: [
      { key: "product", question: "What is the product, feature, or experience you want to define?" },
      { key: "user", question: "Who is it for? Be specific about the user, context, or situation." },
      { key: "problem", question: "What problem, tension, or unmet need does it address?" },
      { key: "behaviour", question: "If it succeeds, what user behaviour or system behaviour should change?" },
      { key: "constraints", question: "What constraints matter most: technical, physical, organisational, cost, time, or user-context?" },
      { key: "success", question: "What would success look like? What evidence would show it is working?" }
    ]
  },

  audit: {
    title: "Intent vs Behaviour Audit",
    steps: [
      { key: "intent", question: "What was the product, feature, or interaction intended to do?" },
      { key: "observed", question: "What is actually happening in use?" },
      { key: "gap", question: "Where is the gap between intended behaviour and actual behaviour?" },
      { key: "evidence", question: "What evidence do you have: observation, user feedback, data, test result, or implementation detail?" },
      { key: "cause", question: "What might be causing the gap: unclear definition, wrong assumption, hidden constraint, weak feedback, or technical limitation?" }
    ]
  },

  assumption: {
    title: "Assumption Extractor",
    steps: [
      { key: "claim", question: "Write the belief or assumption you want to test. For example: “Users will understand this intuitively.”" },
      { key: "basis", question: "What is this based on: evidence, experience, stakeholder belief, user research, or guess?" },
      { key: "risk", question: "What breaks if this assumption is wrong?" },
      { key: "test", question: "What is the smallest way to test or observe whether this assumption is true?" },
      { key: "decision", question: "What decision depends on this assumption?" }
    ]
  }
};

const quickResponses = {
  greeting:
    "Hello, I’m Pobot. I help with product definition, assumptions, constraints, feedback, evidence, and intent-versus-behaviour gaps. Type “definition”, “audit”, or “assumption” to start.",

  help:
    "Choose one workflow:\n\n1. Type “definition” for Product Definition Canvas\n2. Type “audit” for Intent vs Behaviour Audit\n3. Type “assumption” for Assumption Extractor\n\nYou can type “reset” anytime to start again.",

  boundary:
    "I can’t discuss private career details, employer/client information, confidential projects, or unverified claims. I can help reformulate this as a public-safe product experience question.",

  fallback:
    "I work best as a guided tool. Type “definition”, “audit”, or “assumption” to start. Type “help” to see options."
};

function addMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", sender);
  messageElement.textContent = text;

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function resetPobot() {
  pobotState.mode = null;
  pobotState.step = 0;
  pobotState.answers = {};
}

function startWorkflow(mode) {
  resetPobot();
  pobotState.mode = mode;

  const workflow = workflows[mode];
  return `${workflow.title}\n\n${workflow.steps[0].question}`;
}

function continueWorkflow(userMessage) {
  const workflow = workflows[pobotState.mode];
  const currentStep = workflow.steps[pobotState.step];

  pobotState.answers[currentStep.key] = userMessage;
  pobotState.step += 1;

  if (pobotState.step < workflow.steps.length) {
    return workflow.steps[pobotState.step].question;
  }

  const summary = generateSummary(pobotState.mode, pobotState.answers);
  resetPobot();
  return summary;
}

function generateSummary(mode, answers) {
  if (mode === "definition") {
    return `PRODUCT DEFINITION CANVAS

Product:
${answers.product}

User / Context:
${answers.user}

Problem:
${answers.problem}

Desired Behaviour Change:
${answers.behaviour}

Key Constraints:
${answers.constraints}

Success Evidence:
${answers.success}

Pobot reflection:
Before optimising this product, check whether the definition is coherent: product, user, problem, intended behaviour, constraints, and evidence should point in the same direction.`;
  }

  if (mode === "audit") {
    return `INTENT VS BEHAVIOUR AUDIT

Intended Behaviour:
${answers.intent}

Observed Behaviour:
${answers.observed}

Gap:
${answers.gap}

Evidence:
${answers.evidence}

Possible Cause:
${answers.cause}

Pobot reflection:
Users experience behaviour, not intent. The next useful question is: what would need to change in definition, feedback, constraint, or implementation for observed behaviour to match intended behaviour?`;
  }

  if (mode === "assumption") {
    return `ASSUMPTION EXTRACTOR

Assumption:
${answers.claim}

Basis:
${answers.basis}

Risk if Wrong:
${answers.risk}

Smallest Test:
${answers.test}

Dependent Decision:
${answers.decision}

Pobot reflection:
This assumption should not remain invisible. If an important decision depends on it, test it before optimising around it.`;
  }

  return quickResponses.fallback;
}

function detectPrivateQuestion(message) {
  const privateTerms = [
    "employer",
    "client",
    "company",
    "career",
    "cv",
    "resume",
    "visa",
    "confidential",
    "mclaren",
    "philips",
    "bmw",
    "kiska",
    "kohler"
  ];

  return privateTerms.some((term) => message.includes(term));
}

function getPobotResponse(input) {
  const message = input.toLowerCase().trim();

  if (!message) return quickResponses.fallback;

  if (message === "reset" || message === "restart" || message === "clear") {
    resetPobot();
    return "Reset complete. Type “definition”, “audit”, or “assumption” to start again.";
  }

  if (message === "help" || message === "menu" || message === "options") {
    return quickResponses.help;
  }

  if (detectPrivateQuestion(message)) {
    return quickResponses.boundary;
  }

  if (pobotState.mode) {
    return continueWorkflow(input);
  }

  if (
    message.includes("definition") ||
    message.includes("define") ||
    message.includes("product canvas") ||
    message.includes("what is this product")
  ) {
    return startWorkflow("definition");
  }

  if (
    message.includes("audit") ||
    message.includes("intent") ||
    message.includes("behaviour") ||
    message.includes("behavior") ||
    message.includes("actual") ||
    message.includes("supposed")
  ) {
    return startWorkflow("audit");
  }

  if (
    message.includes("assumption") ||
    message.includes("assume") ||
    message.includes("we think") ||
    message.includes("belief") ||
    message.includes("guess")
  ) {
    return startWorkflow("assumption");
  }

  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey") ||
    message.includes("start")
  ) {
    return quickResponses.greeting;
  }

  return quickResponses.fallback;
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
  }, 250);
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

  addMessage(quickResponses.greeting, "bot");
});
