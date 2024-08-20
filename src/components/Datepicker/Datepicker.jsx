import React, { useState, useEffect } from "react";
import Dayzed from "dayzed";
import styled, { css } from "styled-components";
import Text, { Title, SubTitle } from "../Text";
import Fluent from "../FluentEffects";
import { Button } from "../Interactive";
import { Icon } from "../Icon";
import { BaseInput, Field, Label } from "../Form";
import { moment } from "../../lib/lodash/formatUtils";
import { mix, darker, brighter, addAlpha, desaturate } from "../../lib/theme/functions";
import { animated } from "react-spring";
import posed from "react-pose";
const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(v => v[0]);
const toMProps = (m, asDay = true) => {
  const { years, months, date } = m.toObject(),
    weekday = m.weekday(),
    idformat = asDay ? "YYYYMMDD" : "YYYYMM",
    gridColumn = weekday + 1;

  return { id: parseInt(m.format("YYYYMMDD"), 10), years, months, date, gridColumn, weekday, toMoment: id => moment(id), inc: (i = 1) => toMProps(m.clone().add(i, "day")) };
};
const getDays = m => {
    let sd = m.clone().startOf("month");
    let days = [];
    for (let i = 0, ld = toMProps(sd); i < m.daysInMonth(); i++) {
      days.push(ld.inc(i));
    }
    return days;
  },
  getMonths = (m, numberOfMonths = 1) => {
    let days = [];
    for (let i = -1; i < numberOfMonths - 1; i++) {
      let sd = m.clone();
      days.push(sd.add(i, "month"));
    }
    return days;
  };
const BG = color => css`
  background-image: radial-gradient(85% 80% at center top, ${brighter(color, 1)}, ${addAlpha(darker(color, 2), 0.8)});
`;
const MonthGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 28px);
    grid-template-rows: 25px;
    grid-auto-flow: row;
    grid-auto-rows: 28px;
    border-radius: 8px;

    overflow: hidden;
    grid-row-gap: 2px;
    transition: all 0.6s cubic-bezier(0.6, -0.6, 0.5, 0.5);
    height: 100%;
    width: 100%;
    background-blend-mode: color-dodge;
    /* filter: url(#shadowed-goo); */
    /* border: 3px solid rgba(150,150,150,0.8);
    box-shadow: inset 0 0 10px #000; */
    padding: 0px;
  `,
  fr = React.Fragment,
  WeekDay = styled.div.attrs(({ text, ...props }) => ({ children: <Text>{text}</Text>, ...props }))`
    ${Text} {
      color: #888;
      text-align: center;
      font-size: 12px;
    }

    background: rgba(35, 35, 35, 0.6);
    height: 100%;
    border: 1px solid transparent;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
  `,
  Day = styled(Button).attrs(props => {
    let r = 1000;
    let { today, selected, isStart, isEnd, isHovered } = {
        today: props.today || false,
        selected: props.selected || false,
        isStart: props.isStart || false,
        isEnd: props.isEnd || false,
        isHovered: props.isHovered || false
      },
      s = isStart ? r : 0,
      e = isEnd ? r : 0,
      { primary, secondary, tertiary } = props.theme.colors;
    const ends = mix(secondary, brighter(secondary, 3)),
      td = brighter(secondary, 1),
      box_color = isHovered ? darker(secondary) : selected ? (today ? darker(secondary, 2) : secondary) : today ? darker(tertiary) : "transparent";
    const extra =
      props.prevMonth || props.nextMonth
        ? css`
            pointer-events: none;
            background: transparent;
            ${Text} {
              color: #999;
              text-shadow: 2px 2px 4px #222;
              opacity: 0.4;
            }
          `
        : css`
            border: 0px solid transparent;
            ${isHovered &&
              `
             &:hover{
            border-radius: 0 100px 100px 0;
          }
            `}
            ${(selected || isHovered || isStart || isEnd) &&
              `border: 1.5px solid ${ends}; 
      border-left:${isStart ? 3 : 0}px solid ${ends}; 
      border-right:${isEnd ? 3 : 0}px solid ${ends};`};

            background: transparent;
            background-image: linear-gradient(transparent 20%, ${box_color} 40%, ${box_color} 60%, transparent 80%);
          `;
    // ex = ` ${(selected || isHovered) && "border-left-width:0px; border-right-width:0px;"};
    // ${today && !selected && !isHovered && "border: 0px solid " + brighter(secondary, 1)};
    // `;
    // ${isStart && !isEnd && `border-left-width:5px; background-position: 20px 0px; background-size: 100% 5%;`}
    //   ${isEnd && !isStart && `border-right: 5px solid ${ends}; border-top: 2px solid ${ends};`}

    //box-shadow: inset 0 0 29px 6px ${({ box_color }) => box_color};
    return {
      today,
      selected,
      isStart,
      isEnd,
      extra,

      border_radius: today && !selected && !isHovered ? [r] : [s, e, e, s]
    };
  })`
    /* background: transparent; */
    transition: all 0.6s;
    height: 100%;

    ${Text} {
      color: #dedede;
      font-size: 12px;
      text-shadow: 2px 2px 4px #000;
    }
    border-radius: ${({ border_radius }) => border_radius.join("px ")}px;
    ${props => props.extra}
  `,
  Pane = styled.div.attrs(props => ({
    monthsToDisplay: props.centers || 2
  }))`
    /* display: grid;
    grid-template-columns: repeat(${props => props.monthsToDisplay}, 1fr);
    grid-template-rows: repeat(2, 20px);

    line-height: 20px; */
    position: relative;
    /* height: 40px; */
    /* justify-content: center; */
    ${Day} {
      position: absolute;    
      height: 24px;
      width: 24px;
      padding: 0;
      top:8px;
      border: 0px solid transparent;  
      /* background-image: linear-gradient(rgba(50,50,50,0.1),rgba(50,50,50,0.1)); */
      &.prev{
        left: 5px;
        border-left: 2px solid rgb(198,0,234);
      }
      &.next{
        right: 5px;
        border-right: 2px solid rgb(198,0,234);
      }
    }
    /* & > span {
      text-align: center;
      margin: 0 auto;
      &.year{
        grid-column: span ${({ monthsToDisplay }) => monthsToDisplay};
      }
    } */
    /* font-family: ${props => props.theme.base_font_family}; */
  `,
  isSame = (s, d) => !!d && s.getYear() === d.getYear() && s.getMonth() === d.getMonth() && s.getDate() === d.getDate(),
  Calendar = styled.div.attrs(
    ({ isRanged, title, firstDayOfWeek, hovered, setHover, newStart, setNew, selected, onDateSelected, getDateProps, prevProps, nextProps, month, year, weeks, ...props }) => {
      let start = selected[0],
        hfo = e => hovered && setHover(null),
        end = selected.slice(-1)[0];
      return {
        children: (
          <fr>
            <Title
              bold
              size={1.2}
              text={title}
              style={{
                height: 40,
                display: "block",
                // border: "1px solid #555",
                textAlign: "center",
                lineHeight: "34px",
                margin: "0 auto"
              }}
            />

            <MonthGrid weeks={weeks.length - 1} onMouseLeave={hfo}>
              {[...weekdayNamesShort.slice(firstDayOfWeek), ...weekdayNamesShort.slice(0, firstDayOfWeek)].map(weekday => (
                <WeekDay key={`${month}${year}${weekday}`} text={weekday} />
              ))}
              {weeks.map(week =>
                week.map((dateObj, index) => {
                  if (!dateObj) {
                    return <WeekDay key={`${year}${month}${index}`} text="" style={{ background: "transparent" }} />;
                  }
                  let { date, selectable, today, prevMonth, nextMonth } = dateObj,
                    isEnd = selected.length > 0 && isSame(date, end),
                    isSelected = selected.length > 0 && date >= start && date <= end,
                    isHovered = selected.length > 0 && date >= start && date <= hovered,
                    isStart = selected.length > 0 && isSame(date, start),
                    props_day = getDateProps({ dateObj });
                  const cf = e => {
                      if (!isRanged) {
                        onDateSelected([date]);
                      } else {
                        if (newStart && date >= start) {
                          onDateSelected([start, date]);
                          setNew(false);
                        } else {
                          onDateSelected([date]);
                          setNew(true);
                        }
                      }
                    },
                    hf = e => {
                      if (newStart && date >= start) {
                        setHover(date);
                      } else {
                        if (hovered) {
                          setHover(null);
                        }
                      }
                    };
                  return (
                    <Day
                      key={`${year}${month}${index}`}
                      {...{ ...props_day, isHovered, isStart, isEnd, selectable, today, prevMonth, nextMonth, selected: isSelected }}
                      text={date.getDate()}
                      onClick={cf}
                      onMouseOver={hf}
                      onMouseOut={hfo}
                    />
                  );
                })
              )}
            </MonthGrid>
          </fr>
        )
      };
    }
  )`
    box-shadow: 0 0 5px 1px rgba(10, 10, 10, 0.9);
    background: rgba(0, 0, 0, 0.3);
    height: fit-content;
    border-radius: 8px;
  `;
const areaFill = (monthsToDisplay, fillArea = "pane", exten = "") => `"${[...Array(monthsToDisplay).fill(fillArea), exten].join(" ")}"`;
const Picker = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  /* grid-template-columns: repeat(${({ monthsToDisplay }) => monthsToDisplay}, 3fr);
  grid-template-rows: 0 var(--popup) auto;
  grid-template-areas: ${({ monthsToDisplay }) => `${areaFill(monthsToDisplay)} ${areaFill(monthsToDisplay, "calendar")} ${areaFill(monthsToDisplay, "buttons")}`}; */
  /* background-image: linear-gradient(rgba(80, 80, 80, 0.8), rgba(80, 80, 80, 0.95)); */
  grid-gap: 4px;
  border: 0;
  position: relative;
  font-family: ${props => props.theme.base_font_family};
  &>div{
    width:50%;
  }
  ${Pane} {
    grid-area: pane;
    column-span: 3;
    width:100%;    
  }
  .side-pane{
    position: absolute;
    background: #999;
    top:0;
    bottom:0;
    width: 100px;
    right: -98px;
  }
  .buttons {
    grid-area: buttons;
  }
`;
const DatepickerBase = props => {
  const { selected, setDates } = props,
    [hovered, setHover] = useState(),
    [newStart, setNew] = useState(false);
  const onDateSelected = dates => {
    setDates(dates);
    if (!props.isRanged) {
      props.onChanged(dates[0]);
    } else {
      if (newStart && dates.length === 2) {
        props.onChanged(dates);
      }
    }
  };
  return (
    <Dayzed
      onDateSelected={onDateSelected}
      selected={selected}
      {...props}
      render={({ calendars, getBackProps, getForwardProps, getDateProps }) => {
        if (calendars.length) {
          const navProps = {
            prevProps: getBackProps({ calendars }),
            nextProps: getForwardProps({ calendars })
          };
          return (
            // <div style={{ height: "fit-content", display: "flex", flexDirection: "column", width: "100%", position: "relative" }}>
            <Picker {...props}>
              <Pane centers={calendars.length}>
                <Day {...navProps.prevProps} className="prev" icon="caret-left" style={{ borderRadius: "10px 0 0 10px" }} />
                {/* {calendars.slice(0, 1).map(({ month, year, ...calendar }, index) => (
                  <Title key={`y-${index}`} className="year" bold size={1.1} text={`${year} `} />
                ))} */}
                {calendars.map(({ month, year, ...calendar }, index) => (
                  <span key={index} />
                ))}
                <Day {...navProps.nextProps} className="next" icon="caret-right" style={{ borderRadius: "0 10px 10px 0" }} />
              </Pane>
              <div className="side-pane">
                <Day.Group vertical items={["Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month"].map(text => ({ text }))} />
              </div>
              {calendars.map(({ month, year, ...calendar }, index) => (
                <Calendar
                  key={`${month}${year}`}
                  {...{
                    hovered,
                    isRanged: props.isRanged,
                    setHover,
                    newStart,
                    setNew,
                    title: `${monthNamesShort[month]} ${year}`,
                    monthsToDisplay: calendars.length,
                    index,
                    selected,
                    onDateSelected,
                    getDateProps,
                    month,
                    year,
                    ...calendar,
                    ...navProps,
                    ...props
                  }}
                />
              ))}
            </Picker>
          );
        }
        return null;
      }}
    />
  );
};
const StyledDatepicker = styled(DatepickerBase)`
    opacity: var(--op);
  `,
  PopupF = styled.div`
    position: absolute;
    filter: url(#goo);
    border: 2px solid rgba(82, 60, 120, 0.6);
    border-radius: 0px;
    ${BG("#848")}
    ${StyledDatepicker} {
      transition: all 0.6s linear 700ms;
      padding:5px;
      /* margin:0 3px; */
    }
    .side-pane{
      order:3;
      background: linear-gradient(90deg, rgb(54, 54, 54), rgba(94,94,94,0.5));
      background-clip: content-box;
      top: 3px;
      border-radius: 0 8px 8px 0;
      border: 8px solid rgba(94, 59, 117, 0.95);
      border-left: 0px;
      bottom: -18px;
      ${Button}{
        padding:0;
        background: transparent;
        border-left: 4px solid transparent;
        justify-content: start;
        &:hover{
          border-left: 4px solid blue;
        }
        ${Text} {
          font-size: 10px;
          text-align:left;
          
        }
      }
    }
    /* background-image: linear-gradient(90deg, rgba(150, 50, 50, 1), rgba(50, 50, 50, 1)); */
    padding:3px;
    left: 0px;
    transition: all 0.6s linear 200ms;
    box-shadow: inset 0 0 1px 6px rgba(82, 60, 120, 0.6);
    box-sizing: content-box;
    z-index:-1;
  `,
  Popup = posed(PopupF)({
    init: {
      height: 40,
      "--op": 0,
      "--popup": "0px"
    },
    open: {
      height: 275,
      "--op": 1,
      "--popup": "220px"
    },
    close: {
      height: 40,
      "--op": 0,
      "--popup": "0px"
    }
  }),
  SideB = posed(styled.div`
    /* box-shadow: 0 0 5px 1px rgba(10, 10, 10, 0.9); */
    background: rgba(0, 0, 0, 0.9);
    height: fit-content;
    border-radius: 8px;
    left: 50px;
    top: 3px;
    transition: all 0.6s linear 500ms;
    position: absolute;
    overflow: hidden;
    z-index: 2;
  `)({ init: { right: "90%" }, reveal: { right: 0 }, hideAway: { right: "90%" }, transition: { delay: 50, duration: 500 } }),
  Panel = styled.div`
    display: grid;
    grid-template-columns: 50px 1fr 50px 1fr;
    height: 40px;
    position: relative;
    ${Day}, ${Button} {
      background-image: linear-gradient(90deg, rgba(50, 50, 50, 0.3), rgba(50, 50, 50, 0.8), rgba(50, 50, 50, 0.3));
      text-shadow: 2px 2px 4px #000;
      & > ${Text} {
        color: #dedede;
        font-size: 1.2em;
        text-shadow: 2px 2px 4px #000;
      }
    }
    ${Text} {
      color: #dedede;
      background-image: linear-gradient(rgba(50, 50, 50, 0.3), rgba(50, 50, 50, 0.3));
      /* font-size: 1.2em; */
      text-shadow: 2px 2px 4px #000;
    }
  `,
  PopupBase = styled.div`
    position: relative;
    z-index: 1000;
    overflow: visible;
    padding: 1px;
    /* height: 2.5em; */
    /* border: 1px solid red; */
    & > ${Label} {
      border: 0 none;
      margin: 2px;
      background: rgba(35, 35, 35, 0.1);
      color: #dedede;
    }
  `,
  DateInput = ({ border, pad_bottom, label, icon, initialPose, mode, onChanged, ...inprops }) => {
    // const { set, ...props } = useField(inprops.value);
    const [focused, setFocused] = useState(false);
    const [overPane, setOverPane] = useState(false);
    const [active, setActive] = useState(false);
    const [[start, end], setDates] = useState(inprops.selected);
    const onFurtherChanged = dats => {
      // setDates(dats);
      onChanged(dats);
      setActive(false);
    };
    const frm = inprops.format || "YYYY-MM-DD";
    const getHandle = f => () => setFocused(f),
      open = () => setActive(state => !state),
      toogle = () => setOverPane(state => !state),
      close = () => setActive(false),
      props = { onFocus: getHandle(true), onBlur: getHandle(false), ...inprops },
      fprops = {},
      lprops = { border, pose: `${active || focused ? "open" : "close"}`, className: `${focused ? "focus" : ""} ${mode}` };

    return (
      <Field pad_bottom={pad_bottom} style={{ height: 55 }}>
        <PopupBase>
          <Popup pose={active ? "open" : "close"}>
            <Panel>
              <Button icon="calendar" style={{ borderRadius: 0 }} onClick={toogle} />
              <SideB pose={overPane ? "reveal" : "hideAway"}>
                <Button.Group
                  // style={{ height: 30 }}
                  before
                  select
                  multi
                  items={[{ icon: "undo" }, { icon: "caret-left" }, { icon: "play" }, { icon: "caret-right" }, { icon: "repeat" }]}
                />
              </SideB>
              <Day onClick={open} text={moment(start).format(frm) || ""} onChange={e => e} style={{ textAlign: "right" }} />
              {inprops.isRanged && <Text text="-" size={2} style={{ textAlign: "center" }} />}
              {inprops.isRanged && <Day onClick={open} name="end" text={moment(end).format(frm) || moment(start).format(frm)} />}
            </Panel>
            <StyledDatepicker
              {...inprops}
              setDates={setDates}
              selected={[start, end]}
              onChanged={onFurtherChanged}
              style={{ height: active ? 220 : 0, opacity: active ? 1 : 0, pointerEvents: active ? "all" : "none" }}
            />
          </Popup>
        </PopupBase>
      </Field>
    );
  };
//styled.div.attrs(
DateInput.defaultProps = {
  value: null,
  label: "",
  border: 1,
  padded: true,
  initialPose: "close",
  pad_bottom: "1em",
  icon: "calendar",
  mode: "default", //'default', 'iconified', 'drop'
  placeholder: "Date",
  type: "text"
  // required: true,
  // pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}"
};
const Datepicker = styled.div.attrs(props => ({ children: <DateInput {...props} /> }))``;

Datepicker.defaultProps = {
  isRanged: true,
  firstDayOfWeek: 1,
  showOutsideDays: true,
  monthsToDisplay: 3,
  selected: [new Date()], //[new Date("2019-05-12 00:00:00+02:00"), new Date("2019-05-23 00:00:00+02:00")],
  onChanged: e => console.log(e)
};
export default Datepicker;
