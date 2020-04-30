export function getActionsText(actions) {
  const result = Object.keys(actions).reduce((acc, actionName) => {
    acc[actionName] = typeof actions[actionName];

    return acc;
  }, {});

  return JSON.stringify(result);
}

export function getStateText(state) {
  return JSON.stringify(state);
}
