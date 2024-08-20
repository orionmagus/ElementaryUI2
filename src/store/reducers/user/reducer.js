// const states = ["READY", "IN_PROGRESS", "FAIL", "AUTHEN"]
export const fnMap = {
    LOGIN_REQUEST: (state, payload) => state.set("status", "IN_PROGRESS"),
    LOGIN_SUCCESS: (state, { success, data }) => state.set("status", success ? "AUTHEN" : "FAIL").set("user.data", data),
    LOGIN_ERROR: (state, { reason }) => state.set("status", "FAIL").set("reason", reason),
    LOGIN_RESET: (state, p) => initialState(),
    LOGOUT_REQUEST: (state, p) => initialState()
  },
  initialState = ({ data = null }) => ({ user: { data }, status: "READY", reason: "" });
