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
      { key: "claim", question: "Write the belief or assumption you want to test. Example: “Users will understand this intuitively.”" },
      { key: "basis", question: "What is this based on: evidence, experience, stakeholder belief, user research, or guess?" },
      { key: "risk", question: "What breaks if this assumption is wrong?" },
      { key: "test", question: "What is the smallest way to test or observe whether this assumption is true?" },
      { key: "decision", question: "What decision depends on this assumption?" }
    ]
  }
};

const quickResponses = {
  greeting:
    "Hello, I’m Pobot. I’m a guided product-thinking tool. Type “definition”, “audit”, or “assumption” to start.",

  help:
    "Choose a workflow:\n\n• definition — clarify what the product is before optimising\n• audit — compare intended behaviour with actual behaviour\n• assumption — test a belief before building around it\n\nYou can type “reset” anytime.",

  boundary:
    "I can’t discuss private career details, employer/client information, confidential projects, or unverified claims. Try reframing it as a product experience question.",

  fallback:
    "I work best through guided workflows. Type “definition”, “audit”, or “assumption”."
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

function isWorkflowCommand(message) {
  return ["definition", "define", "audit", "assumption", "assume", "help", "menu", "reset", "restart", "clear"].includes(message);
}

function handleCommand(message) {
  if (message === "reset" || message === "restart" || message === "clear") {
    resetPobot();
    return "Reset complete. Type “definition”, “audit”, or “assumption” to start again.";
  }

  if (message === "help" || message === "menu") {
    return quickResponses.help;
  }

  if (message === "definition" || message === "define") {
    return startWorkflow("definition");
  }

  if (message === "audit") {
    return startWorkflow("audit");
  }

  if (message === "assumption" || message === "assume") {
    return startWorkflow("assumption");
  }

  return null;
}

function continueWorkflow(userMessage) {
  const workflow = workflows[pobotState.mode];
  const currentStep = workflow.steps[pobotState.step];

  pobotState.answers[currentStep.key] = userMessage;
  pobotState.step += 1;

  if (pobotState.step < workflow.steps.length) {
    const nextNumber = pobotState.step + 1;
    const total = workflow.steps.length;
    return `Step ${nextNumber}/${total}\n\n${workflow.steps[pobotState.step].question}`;
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
Before optimising, check whether product, user, problem, intended behaviour, constraints, and evidence point in the same direction.`;
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
Users experience behaviour, not intent. The next question is what needs to change so observed behaviour matches intended behaviour.`;
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
If an important decision depends on this assumption, test it before optimising around it.`;
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

  const commandResponse = handleCommand(message);
  if (commandResponse) return commandResponse;

  if (detectPrivateQuestion(message)) {
    return quickResponses.boundary;
  }

  if (pobotState.mode) {
    if (isWorkflowCommand(message)) {
      return "You are already in a workflow. Type “reset” to stop, or answer the current question.";
    }
    return continueWorkflow(input);
  }

  if (
    message.includes("what can you do") ||
    message.includes("help") ||
    message.includes("options")
  ) {
    return quickResponses.help;
  }

  if (
    message.includes("what is this product") ||
    message.includes("define this") ||
    message.includes("product definition")
  ) {
    return startWorkflow("definition");
  }

  if (
    message.includes("intended") ||
    message.includes("actually") ||
    message.includes("behaviour") ||
    message.includes("behavior") ||
    message.includes("not working") ||
    message.includes("confusing")
  ) {
    return startWorkflow("audit");
  }

  if (
    message.includes("assumption") ||
    message.includes("assume") ||
    message.includes("we think") ||
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
