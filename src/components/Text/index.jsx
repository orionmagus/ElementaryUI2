import React from "react";
import styled from "styled-components";

const TextBase = styled.span.attrs(({ text = "", children, ...props }) => ({
  shadow: false,
  alt: false,
  bold: false,
  select: false,
  children: text || children,
  size: 1,
  ...props
}))`
  color: ${({ alt, theme }) => theme.colors.fg};
  user-select: ${props => (props.select ? "inherit" : "none")};
  outline: none;
  text-decoration: none;
  text-shadow: ${props => (props.shadow ? "1px 1px 3px #000000" : "none")};
  font-size: ${props => props.size}rem;
  font-weight: ${props => (props.bold ? "bold" : "inherit")};
`;

// export const TextBase = ({ as, sub, heading, title, style, poseConfig, baseStyle, className, children, ...props }) => {
//   const nprops = {
//       className: cn(
//         "text",
//         {
//           sub: sub,
//           heading: heading,
//           title: title
//         },
//         className
//       ),
//       style: { ...baseStyle, ...style },
//       ...props
//     }
//   return <BaseText {...nprops}>{children}</BaseText>;
// };
// TextBase.defaultProps = {
//   as: "span",
//   className: "",
//   sub: false,
//   heading: false,
//   title: false,
//   baseStyle: {},
//   poseConfig: false
// };
export const Text = TextBase,
  Heading = props => <TextBase bold size={1.8} {...props} />,
  SubHeading = props => <TextBase bold size={1.6} {...props} />,
  Title = props => <TextBase bold size={1.25} {...props} />,
  SubTitle = props => <TextBase bold size={1.1} {...props} />,
  T = Text,
  H = Heading,
  SH = SubHeading,
  Tt = Title,
  STt = SubTitle;
export default Text;
