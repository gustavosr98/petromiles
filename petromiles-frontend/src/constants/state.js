export const states = Object.freeze({
  VERIFYING: {
    name: "verifying",
    state: "Verifying",
    color: "blue",
  },
  ACTIVE: {
    name: "active",
    state: "Active",
    color: "green",
  },
  BLOCKED: {
    name: "blocked",
    state: "Blocked",
    color: "red",
  },
  CANCELLED: {
    name: "cancelled",
    state: "Cancelled",
    color: "red",
  },
  VALID: {
    name: "valid",
    state: "Valid",
    color: "green",
  },
  INVALID: {
    name: "invalid",
    state: "Invalid",
    color: "red",
  },
});

export const statesArray = Object.keys(states).map(s => states[s]);
