const schemas = {
  valid_job: {
    title: "valid_job schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      name: { type: "string" }
    }
  },
  poi_type: {
    title: "poi_type schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      name: { type: "string" }
    }
  },
  appointment_type: {
    title: "appointment_types schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      name: { type: "string" }
    }
  },
  poi: {
    title: "poi schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      location: { type: "string" },
      poi_type: { type: "number" }
    }
  },
  state: {
    title: "states schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      description: { type: "string" },
      view_roles: { type: "array" },
      change_roles: { type: "array" },
      sla_time: { type: "number" }
    }
  },
  excess_state: {
    title: "excess_states schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      name: { type: "string" }
    }
  },
  supplier_type: {
    title: "supplier_type schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      name: { type: "string" }
    }
  },
  sp: {
    title: "sps schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      skills: {
        type: "array",
        items: { type: "number" }
      },
      regions: {
        type: "array",
        items: { type: "number" }
      },
      uuid: { type: "string" }
    }
  },
  role: {
    title: "roles schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      description: { type: "string" }
    }
  },
  cancel_reason: {
    title: "cancel_reasons schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      name: { type: "string" }
    }
  },
  skill: {
    title: "skills schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      mid: { type: "number" },
      specialist: { type: "string" },
      enabled: { type: "boolean" }
    }
  },
  claim_type: {
    title: "claim_types schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "number" },
      skill_groups: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            skills: {
              type: "array",
              items: { type: "number" }
            }
          }
        }
      },
      name: { type: "string" },
      description: { type: "string" },
      priority: { type: "number" },
      excess: { type: "number" },
      mid: { type: "number" },
      use_auto_allocation: { type: "boolean" },
      initial_cost_estimate: { type: "string" }
    }
  },
  excess_who: {
    title: "excess_who schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "string" },
      name: { type: "string" }
    }
  },
  excess_how: {
    title: "excess_how schema",
    type: "object",
    version: 0,
    properties: {
      id: { type: "string" },
      name: { type: "string" }
    }
  }
};
