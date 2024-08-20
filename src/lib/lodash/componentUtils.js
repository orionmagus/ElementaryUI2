export function getModelByType(session, itemType, itemID) {
  const modelClass = session[itemType];
  const model = modelClass.withId(itemID);
  return model;
}
export const getComponentDisplay = (Component, defaultName = "Component") => Component.displayName || Component.name || defaultName,
  isStateless = Component => typeof Component === "function" && !(Component.prototype && "isReactComponent" in Component.prototype);
