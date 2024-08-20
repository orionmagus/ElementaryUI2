export const fnMap = {
    PAGE_CHANGE_FULLFILLED: (state, payload) => state.set("current_page", payload),
    LOAD_CONFIG: (state, payload) => state.mergeDeep(payload)
  },
  initialState = {
    pages: {
      login: {}
    }
  };
