import React, { useState } from "react";
import posed, { PoseGroup } from "react-pose";
import SplitText from "react-pose-text";
import { Icon } from "../Icon";
import Center from "./Center";
import { CometLoader } from "../Loader";
import cn from "classnames";
import "./style.scss";

const ResizeableDiv = props => {
    return <div />;
  },
  base = (Elemen, baseCls = "", baseStyle = {}) => ({ style, className, children, ...props }) => {
    const nprops = {
      className: cn(baseCls, className),
      style: { ...baseStyle, ...style },
      ...props
    };
    return <Elemen {...nprops}>{children}</Elemen>;
  };
const Container = posed.div({
  enter: { staggerChildren: 1500, delayChildren: 50 },
  exit: { staggerChildren: 1500, delayChildren: 50 }
});
const DraggableDiv = posed.div({
  draggable: true,
  init: { opacity: 1 },
  drag: { opacity: 0.5 },
  dragEnd: {
    x: 0,
    y: 0,
    transition: { type: "spring" }
  }
});
const EnterLeft = posed.div({
  enter: { x: 0, opacity: 1 },
  exit: { x: 50, opacity: 0 }
});
export const Page = base("div", "page"),
  MainSide = base("main", "main-side"),
  PortalRoot = base("div", "page portal-root"),
  Header = base("header", "header"),
  ContentHeader = base("section", "content-header"),
  Content = base("section", "content"),
  Footer = base("footer", "footer"),
  SideBar = base(
    posed.aside({
      wide: { "--sidebar-width": "230px" },
      mini: { "--sidebar-width": "50px" },
      offscreen: { "--sidebar-width": "50px" },
      initialPose: "wide"
    }),
    "sidebar",
    { "--sidebar-width": "230px" }
  ),
  Grid = () => {
    const cil = [
      "stats 0",
      "stats 1",
      "stats 2",
      "stats 3",
      "stats 4",
      "stats 5",
      "main-chart three-wide two-rows",
      "aux 0 hide-md hide-sm",
      "aux 1 hide-md hide-sm",
      "aux 2 hide-md hide-sm",
      "aux 3 hide-sm",
      "aux 4 two-wide"
    ];
    return (
      <div className="grid six columns ro220xfrx164">
        <PoseGroup>
          {cil.map(c => (
            <div key={c} className={c} />
          ))}
        </PoseGroup>
      </div>
    );
  },
  Goo = props => <div className="goo" {...props} />,
  Inner = props => <div className="inner" {...props} />,
  Overlay = props => <div className="overlay" {...props} />;

const charPoses = {
  enter: { y: 0 },
  exit: { y: ({ initialOffset }) => initialOffset }
};

export const TextAnim = ({ text }) => (
  <SplitText initialOffset={50} charPoses={charPoses}>
    {text}
  </SplitText>
);
/*
 <PortalRoot>
        <Overlay style={{ visibility: "hidden" }}>
          <Center>
            <CometLoader style={{ background: "rgba(0, 0, 0, 0.05)" }}>
              Loading...
            </CometLoader>
          </Center>
        </Overlay>
      </PortalRoot>
      
      */
const SquareToggle = posed.button({
  init: {},
  hoverable: true,
  pressable: true,
  active: {},
  hover: {},
  pressed: {}
});
const SidebarMenu = posed.ul({
  open: {
    width: 230,
    delayChildren: 50,
    staggerChildren: 50
  },
  closed: { width: 50, delayChildren: 50, staggerChildren: 50 }
});
const Item = posed.li({
  open: { width: 230, opacity: 1 },
  closed: { width: 50, opacity: 1 }
});
export const Panel = props => {
  const { Pcontent, NavBar } = props;
  const [menuOpen, toggleMenuOpen] = useState(true);
  return (
    <div className="page-lyt">
      <Page>
        <SideBar pose={`${menuOpen ? "wide" : "mini"}`} className={`${menuOpen ? "open" : "close"}`}>
          <div style={{ height: 50 }}>Logo</div>
          <SquareToggle className="toggler" onClick={() => toggleMenuOpen(!menuOpen)}>
            <Icon name="menu" />
          </SquareToggle>
          <SidebarMenu pose={`${menuOpen ? "open" : "closed"}`} className="sidebar-menu">
            <Item>
              <a to="/simple_reports/wip" className="active">
                <Icon name="dashboard" size={24} />
                <span> Dashboard</span>
              </a>
            </Item>
            <Item>
              <a to="/simple_reports/wip">
                <Icon name="map-marker" size={24} />
                <span>WIP Dashboard</span>
              </a>
            </Item>
            <Item>
              <a href="/simple_reports/wip">
                <Icon name="pie-chart" size={24} />
                <span>WIP Dashboard</span>
              </a>
            </Item>
            <Item>
              <a href="/simple_reports/wip">
                <Icon name="speedometer" size={24} />
                <span>WIP Dashboard</span>
              </a>
            </Item>
            <Item>
              <a href="/simple_reports/wip">
                <Icon name="bar-chart" size={24} />
                <span>WIP Dashboard</span>
              </a>
            </Item>
            <Item>
              <a href="/simple_reports/wip">
                <Icon name="area-chart" size={24} />
                <span>WIP Dashboard</span>
              </a>
            </Item>
            <Item>
              <a href="/simple_reports/wip">
                <Icon name="line-chart" size={24} />
                <span>WIP Dashboard</span>
              </a>
            </Item>
            <Item>
              <a href="/simple_reports/wip">
                <Icon name="download" size={24} />
                <span>WIP Dashboard</span>
              </a>
            </Item>
            <Item>
              <a href="/simple_reports/wip">
                <Icon name="ios-pie" size={30} />
                <span>WIP Dashboard</span>
              </a>
            </Item>
            <Item>
              <a href="/simple_reports/wip">
                <Icon name="ios-pie-outline" className="spin" size={30} />
                <span>WIP Dashboard</span>
              </a>
            </Item>
            <Item>
              <a href="/simple_reports/wip">
                <Icon name="spinner" className="spin" size={30} />
                <span>WIP Dashboard</span>
              </a>
            </Item>
          </SidebarMenu>
        </SideBar>
        <MainSide>
          <Header style={{ background: "red" }}>
            <NavBar />
          </Header>
          <ContentHeader />
          <Content>
            <Grid />
            {/* <Pcontent /> */}
          </Content>

          <Footer>Footer</Footer>
        </MainSide>
      </Page>
    </div>
  );
};
Panel.defaultProps = {
  NavBar: Inner
};
export default Panel;
