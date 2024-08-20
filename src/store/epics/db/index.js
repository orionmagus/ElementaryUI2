import PouchAdapterMemory from "pouchdb-adapter-memory";
import RxDB from "rxdb";
RxDB.plugin(PouchAdapterMemory);

const rxdb = await RxDB.create({
  name: "stats_app_dash",
  adapter: "idb",
  password: "sdFR566t@df$fg",
  multiInstance: true,
  queryChangeDetection: true
});
const schemas = {
  user: {
    title: "User schema",
    version: 0,
    description: "describes a User Login",
    type: "object",
    properties: {
      email: {
        type: "string",
        primary: true
      },
      token: { type: "string" },
      sp_token: { type: "string" },
      first_name: { type: "string" },
      user_type: { type: "string" },
      groups: {
        type: "array",
        uniqueItems: true,
        items: { type: "string" }
      },
      expiry: { type: "date" }
    },
    required: ["token"]
  }
};
Object.entries(schemas).forEach(([name, schema]) => {
  rxdb.collection({
    name,
    schema,
    statics: {},
    methods: {}
  });
});
//     healthpoints: {
//       type: "number",
//       min: 0,
//       max: 100
//     },
//     secret: {
//       type: "string",
//       encrypted: true
//     },
//     birthyear: {
//       type: "number",
//       final: true,
//       min: 1900,
//       max: 2050
//     },
//     skills: {
//       type: "array",
//       maxItems: 5,
//       uniqueItems: true,
//       items: {
//         type: "object",
//         properties: {
//           id: {
//             type: "number"
//           },
//         }
//       }
//     }
//   },
//   required: ["color"],
//   attachments: {
//     encrypted: true
//   }
// };
