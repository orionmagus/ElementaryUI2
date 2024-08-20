import React, { Fragment, useState } from "react";
import posed from "react-pose";
export const Content = posed.div({
    closed: { height: 0 },
    open: { height: "auto" }
  }),
  Accordion = (contents, openOn, ...props) => {
    const [open, setOpen] = useState(openOn);

    return (
      <div className="accordion">
        {contents.map(({ title, content }, i) => (
          <Fragment>
            <h2
              className="title"
              onClick={() => setOpen(open === i ? false : i)}
            >
              {title}
            </h2>
            <Content className="content" pose={open === i ? "open" : "closed"}>
              <div className="content-wrapper">{content}</div>
            </Content>
          </Fragment>
        ))}
      </div>
    );
  };
Accordion.defaultProps = {
  contents: [],
  openOn: null
};
export default Accordion;
