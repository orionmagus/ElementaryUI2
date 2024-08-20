import { forEach, includes } from "./transformUtils";
export const htmlInputAttrs = [
  // REACT
  "selected",
  "defaultValue",
  "defaultChecked",

  // LIMITED HTML PROPS
  "autoCapitalize",
  "autoComplete",
  "autoCorrect",
  "autoFocus",
  "checked",
  "disabled",
  "form",
  "id",
  "list",
  "max",
  "maxLength",
  "min",
  "minLength",
  "multiple",
  "name",
  "pattern",
  "placeholder",
  "readOnly",
  "required",
  "step",
  "type",
  "value"
];

export const htmlInputEvents = [
  // EVENTS
  // keyboard
  "onKeyDown",
  "onKeyPress",
  "onKeyUp",

  // focus
  "onFocus",
  "onBlur",

  // form
  "onChange",
  "onInput",

  // mouse
  "onClick",
  "onContextMenu",
  "onDrag",
  "onDragEnd",
  "onDragEnter",
  "onDragExit",
  "onDragLeave",
  "onDragOver",
  "onDragStart",
  "onDrop",
  "onMouseDown",
  "onMouseEnter",
  "onMouseLeave",
  "onMouseMove",
  "onMouseOut",
  "onMouseOver",
  "onMouseUp",

  // selection
  "onSelect",

  // touch
  "onTouchCancel",
  "onTouchEnd",
  "onTouchMove",
  "onTouchStart"
];

export const htmlInputProps = [...htmlInputAttrs, ...htmlInputEvents];

export const partitionHTMLProps = (props, options = {}) => {
  const { htmlProps = htmlInputProps, includeAria = true } = options;
  const inputProps = {};
  const rest = {};

  forEach(props, (val, prop) => {
    const possibleAria =
      includeAria && (/^aria-.*$/.test(prop) || prop === "role");
    const target =
      includes(htmlProps, prop) || possibleAria ? inputProps : rest;
    target[prop] = val;
  });

  return [inputProps, rest];
};
export const getNodeWidth = node => {
    const nodeStyles = window.getComputedStyle(node);
    const width = node.offsetWidth;
    const borderLeftWidth = parseFloat(nodeStyles.borderLeftWidth || 0.0);
    const borderRightWidth = parseFloat(nodeStyles.borderRightWidth || 0.0);
    const paddingLeft = parseFloat(nodeStyles.paddingLeft || 0.0);
    const paddingRight = parseFloat(nodeStyles.paddingRight || 0.0);
    return (
      width - borderRightWidth - borderLeftWidth - paddingLeft - paddingRight
    );
  },
  getNodeHeight = node => {
    const nodeStyles = window.getComputedStyle(node);
    const height = node.offsetHeight;
    const borderTopWidth = parseFloat(nodeStyles.borderTopWidth || 0.0);
    const borderBottomWidth = parseFloat(nodeStyles.borderBottomWidth || 0.0);
    const paddingTop = parseFloat(nodeStyles.paddingTop || 0.0);
    const paddingBottom = parseFloat(nodeStyles.paddingBottom || 0.0);
    return (
      height - borderTopWidth - borderBottomWidth - paddingTop - paddingBottom
    );
  },
  getBounds = node => node.getBoundingClientRect(),
  getComputedStyle = node => window.getComputedStyle(node);
export default {
  getNodeWidth,
  getNodeHeight,
  getBounds,
  getComputedStyle,
  getNodeDimensions: node => ({
    width: getNodeWidth(node),
    height: getNodeHeight(node)
  })
};
