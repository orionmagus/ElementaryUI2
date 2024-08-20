import { formatLocale } from "d3-format";
import moment from "dayjs";
import { compose, noop } from "./usefulUtils";

import Extended from "./plugins/dayjs-ext"; // load on demand
import en from "./locale/en";
moment.extend(Extended);
moment.locale(en);

export { moment };
export const { format, formatPrefix } = formatLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["R", ""]
});

var FORMATTERS = {
  ".1%": format(".1%"),
  ",.0f": format(",.0f")
};
const createFormat = k => {
    FORMATTERS[k] = format(k);
    return FORMATTERS[k];
  },
  INTERPOLATE01 = /{([\s\S]+?)}/g,
  INTERPOLATE02 = /<%=\s+([\s\S]+?)\s%>/g,
  INTERPOLATE_MUSTACHE = /{{([\s\S]+?)}}/g,
  paramRegex = {
    required: /\{(\$*[A-z0-9]+)\}/gi,
    optional: /\{\/(\$*[A-z0-9]+)\}/gi
  };

export const formatter = k =>
    !(k in FORMATTERS) ? createFormat(k) : FORMATTERS[k],
  fnFormat = {
    datetime: (formatString = "YYYY-MM-DD HH:mm:ss") => v =>
      moment(v).format(formatString),
    duration: (formatString = "d[d] hh[h] mm[m]") => v =>
      moment(v).format(formatString),
    duration_days: (formatString = "d[d]") => v =>
      moment(v).format(formatString),
    default: (formatString = ".1%") => formatter(formatString)
  },
  formatValue = (type = "", formatString = "") =>
    formatString in fnFormat
      ? fnFormat[formatString](type)
      : type in fnFormat
      ? fnFormat[type](formatString)
      : formatString.length > 0
      ? formatter(formatString)
      : type.length > 0
      ? formatter(type)
      : FORMATTERS[".1%"],
  formatDuration = formatString => formatValue("duration", formatString),
  urlParams = urlPattern => {
    let url = urlPattern,
      params = { required: [], optional: [] };
    for (let key in paramRegex) {
      url = url.replace(paramRegex[key], (match, code) => {
        params[key].push(code);
        return "";
      });
    }
    return { url, params };
  },
  __tmi = (str, regex) => data =>
    str.replace(regex, (match, code) => data[code] || ""),
  __tpl = (str, regex = INTERPOLATE01, data = null) =>
    data ? __tmi(str, regex)(data) : __tmi(str, regex),
  __template = (str, data) => {
    let tmpl =
      "var __p=[],print=function(){__p.push.apply(__p,arguments);};" +
      "with(obj||{}){__p.push('" +
      str
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(INTERPOLATE01, function(match, code) {
          return "'," + code.replace(/\\'/g, "'") + ",'";
        })
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n")
        .replace(/\t/g, "\\t") +
      "');}return __p.join('');";
    let func = new Function("obj", tmpl);
    return data ? func(data) : func;
  },
  templateFactory = (strings, ...keys) => (...values) => {
    var dict = values[values.length - 1] || {},
      result = [strings[0]];
    console.log(strings, keys);
    keys.forEach((key, i) => {
      result.push(
        Number.isInteger(key) ? values[key] : dict[key],
        strings[i + 1]
      );
    });
    console.log(result);
    return result.join("");
  },
  lodash_template = templ_str => __tpl(templ_str, INTERPOLATE02),
  template = templ_str => __tpl(templ_str, INTERPOLATE01),
  handlebars_template = templ_str => __tpl(templ_str, INTERPOLATE_MUSTACHE),
  dateToNumber = (v, date1904) => {
    if (date1904) {
      v += 1462;
    }

    var epoch = Date.parse(v);

    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (86400 * 1000);
  },
  toExcelDate = dateToNumber,
  secondsToExcelTime = seconds => second / 86400.0,
  umoment = v => moment(typeof v === "number" ? v - 7200000 : v),
  colFormats = {
    displayNonZero: row => (row.value > 0 ? row.value : "-"),
    displayDatetimeNull: row =>
      umoment(row.value).isAfter(moment().add(1, "day")) ||
      umoment(row.value).isValid() === false
        ? "-"
        : dateToNumber(umoment(row.value).toDate()),
    displayDatetime: row => dateToNumber(umoment(row.value).toDate()),
    displayDateNull: row =>
      umoment(row.value).isAfter(moment().add(1, "day")) ||
      umoment(row.value).isValid() === false
        ? "-"
        : dateToNumber(umoment(row.value).toDate()),
    displayDate: row => dateToNumber(umoment(row.value).toDate()),
    displayPercentage: row => (row.value > 1.0 ? row.value / 100 : row.value),
    displayDuration: row => (row.value ? row.value / 86400.0 : "-"),
    displayDurationDay: row => (row.value ? row.value / 86400.0 : "-")
  },
  toColumnName = num => {
    for (var ret = "", a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
      ret = String.fromCharCode(parseInt((num % b) / a, 10) + 65) + ret;
    }
    return ret;
  },
  transpose = m => m[0].map((x, i) => m.map(x => x[i])),
  encode_AA = (c, r) => `${toColumnName(c)}${r}`,
  toProperties = (data, top_right = [1, 1]) => {
    var maxCols = data.reduce((a, r) => (r.length > a ? r.length : a), 0),
      T = transpose([...data]),
      props = {
        widths: T.map(
          col =>
            col
              .map(v => "" + v)
              .sort((a, b) => a - b)
              .pop().length
        ),
        range: [encode_AA(...top_right), encode_AA(maxCols, data.length)]
      };
    return props;
  },
  toARGB = c => {
    const { opacity, r, g, b } = rgb(c);
    return {
      argb: [opacity, r, g, b]
        .map((v, i) => (i > 0 ? v : v * 255))
        .map(v => v.toString(16))
    };
  },
  headerStyle = (color = "88442157") => ({
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: color }
  }),
  displayDefault = { font: { name: "Calibri", size: 12 } },
  dateTimeStyle = { numFmt: "yyyy-mm-dd HH:MM:SS" },
  dateStyle = { numFmt: "yyyy-mm-dd" },
  durationStyle = { numFmt: "[HH]:MM" },
  durationDayStyle = { numFmt: '0"d" ?/?' },
  currencyStyle = { numFmt: '"R"#,##0.00;[Red] -"R"#,##0.00' },
  defaultStyles = {
    displayDatetimeNull: { ...displayDefault, ...dateTimeStyle },
    displayDatetime: { ...displayDefault, ...dateTimeStyle },
    displayDate: { ...displayDefault, ...dateStyle },
    displayDateNull: { ...displayDefault, ...dateStyle },
    displayCurrency: { ...displayDefault, ...currencyStyle },
    displayPercentage: { ...displayDefault, numFmt: "0.0%" },
    displayDuration: { ...displayDefault, ...durationStyle },
    displayDurationDay: { ...displayDefault, ...durationDayStyle }
  },
  styleFromCell = c => defaultStyles[c] || displayDefault;

// (isOb = value => !!value && typeof value === "object"),
//   (_typeof =
//     typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
//       ? function(obj) {
//           return typeof obj;
//         }
//       : function(obj) {
//           return obj &&
//             typeof Symbol === "function" &&
//             obj.constructor === Symbol &&
//             obj !== Symbol.prototype
//             ? "symbol"
//             : typeof obj;
//         }),
//   (everyV = (obj, cb) => {
//     if (obj) {
//       if (Array.isArray(obj)) {
//         return obj.every(cb);
//       }
//       return Object.keys(obj).every(function(key) {
//         return cb(obj[key], key);
//       });
//     }
//     return true;
//     // },
//     // isEqual = (a, b) => {
//     //   var aType = typeof a === 'undefined' ? 'undefined' : _typeof(a);
//     //   var bType = typeof b === 'undefined' ? 'undefined' : _typeof(b);
//     //   var aArray = Array.isArray(a);
//     //   var bArray = Array.isArray(b);

//     //   if (aType !== bType) {
//     //     return false;
//     //   }
//     //   switch (typeof a === 'undefined' ? 'undefined' : _typeof(a)) {
//     //     case 'object':
//     //       if (aArray || bArray) {
//     //         if (aArray && bArray) {
//     //           return a.length === b.length && a.every(function (aValue, index) {
//     //             var bValue = b[index];
//     //             return isEqual(aValue, bValue);
//     //           });
//     //         }
//     //         return false;
//     //       }
//     //       return everyV(a, function (aValue, key) {
//     //         var bValue = b[key];
//     //         return isEqual(aValue, bValue);
//     //       });

//     //     default:
//     //       return a === b;
//     //   }
//     // },

//     // escapeHtml = (html) => html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"),;
//   });
