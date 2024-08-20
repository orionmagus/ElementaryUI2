export const stateSelector = (key, _def = {}) => state =>
    state.getIn(key.split("."), _def).asMutable({ deep: true }),
  stateTransformer = state => state.asMutable({ deep: true });
export default stateTransformer;
