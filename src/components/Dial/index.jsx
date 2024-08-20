import React, { PureComponent } from "react";
import posed from "react-pose";
import ld from "../../lib/lodash";
const GlowContainer = posed.div({
    hoverable: true,
    press: true,
    focus: true,
    init: {
      filter: "brightness(100 %) saturate(100%)",
      background: `radial-gradient( 175% 80% at top, var(--bg-light), var(--bg-dark) 80%, transparent 100%) `,
      outlineWidth: "0px",
      outlineOffset: "0px",
      boxShadow: "0px 0px 0px rgba(0,0,0,0) inset"
    },
    focus: {
      outlineWidth: "12px",
      outlineOffset: "5px",
      outlineColor: "#AB36FF"
    },
    hover: {
      filter: "brightness(150%) saturate(150%)"
    },
    press: {
      boxShadow: "0px 0px 0px rgba(0,0,0,0), 2px 2px 5px rgba(0,0,0,0.8) inset"
    }
  }),
  percentFmt = ld.format(".1%");
export default class StatisticDial extends PureComponent {
  static defaultProps = {
    height: 247.26245,
    width: 247.20001,
    value: 0,
    total: 0,
    title: "Test",
    color: "#337799"
  };
  state = {
    value: 0,
    value_formatted: "",
    total: 0,
    total_formatted: "",
    ratio: 0,
    percentage: 0,
    show_percent: true,
    show_value: true,
    show_total: true
  };
  render() {
    const { ratio, total, value_formatted, total_formatted } = this.state,
      { title, width, height, value, total, color } = this.props;
    var percent = percentFmt(ratio),
      p = Math.PI * 210,
      d = Math.round(p / 8),
      dashes = new Array(52),
      dashOffset = -416 * ratio + "px";
    dashes.fill("5px, 3px");
    dashes.push("5px");
    dashes.unshift("0px, 659px");
    dashes = dashes.join(", ");
    var bottom_text = total_formatted,
      banner_text = "" + value;

    return (
      <GlowContainer
        style={{
          "--bg-light": color,
          "--bg-dark": "transparent"
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          enableBackground="new"
          version="1.1"
          viewBox="0 0 247.20001 247.26245"
          className="stata-svg"
          style={{
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle closest-side, transparent,transparent,transparent,#252525,transparent)"
          }}
        >
          <defs id="defs1966">
            <linearGradient id="linearGradient2918">
              <stop
                offset={0}
                style={{ stopColor: "#b0e5fd", stopOpacity: 1 }}
              />
              <stop
                offset={1}
                style={{ stopColor: "#b0e5fd", stopOpacity: 0 }}
              />
            </linearGradient>
            <linearGradient id="linearGradient2910">
              <stop
                id="stop2906"
                offset={0}
                style={{ stopColor: "#242428", stopOpacity: 1 }}
              />
              <stop
                id="stop2908"
                offset={1}
                style={{ stopColor: "#43434c", stopOpacity: "0.28235295" }}
              />
            </linearGradient>
            <linearGradient
              y2="258.99472"
              x2={0}
              y1="411.72238"
              x1={0}
              gradientTransform="translate(-2.5000069,-76.48792)"
              gradientUnits="userSpaceOnUse"
              id="linearGradient4676"
              xlinkHref="#cutout_grad"
            />
            <linearGradient id="cutout_grad">
              <stop
                id="stop4671"
                offset={0}
                style={{ stopColor: "#414141", stopOpacity: 1 }}
              />
              <stop
                id="stop4673"
                offset={1}
                style={{ stopColor: "#606061", stopOpacity: 1 }}
              />
            </linearGradient>

            <linearGradient
              gradientTransform="translate(-2.5000069,-76.48792)"
              gradientUnits="userSpaceOnUse"
              y2="258.99472"
              x2={0}
              y1="411.72238"
              x1={0}
              id="linearGradient861"
              xlinkHref="#cutout_grad-3"
            />
            <linearGradient id="cutout_grad-3">
              <stop
                style={{ stopColor: "#414141", stopOpacity: "0.04705882" }}
                offset={0}
                id="stop4659"
              />
              <stop
                style={{ stopColor: "#606061", stopOpacity: "0.04705882" }}
                offset={1}
                id="stop4661"
              />
            </linearGradient>
            <radialGradient
              gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(1.0710964,-0.00136896,0.00331101,2.2581141,-11.511315,-522.48899)"
              r="81.696091"
              fy="354.61966"
              fx="110.2329"
              cy="354.61966"
              cx="110.2329"
              id="bann_grad01"
              xlinkHref="#bann_grad02"
            />
            <linearGradient id="bann_grad02">
              <stop
                id="stop912"
                offset={0}
                style={{ stopColor: "#454545", stopOpacity: 1 }}
              />
              <stop
                style={{ stopColor: "#6c6c6c", stopOpacity: 1 }}
                offset="0.44484517"
                id="stop924"
              />
              <stop
                style={{ stopColor: "#454545", stopOpacity: "0.9776786" }}
                offset="0.78602266"
                id="stop922"
              />
              <stop
                id="stop914"
                offset={1}
                style={{ stopColor: "#535353", stopOpacity: "0.6651786" }}
              />
            </linearGradient>
            <mask id="bannerMask" maskUnits="userSpaceOnUse">
              <circle
                r="81.189377"
                cy="350.43964"
                cx="110.73993"
                id="circle4446"
                style={{
                  fill: "#313131",
                  stroke: "none",
                  strokeWidth: "0.32316834",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeMiterlimit: "0.60000002",
                  strokeDasharray: "none",
                  strokeDashoffset: 29,
                  strokeOpacity: "0.97321424",
                  paintOrder: "stroke fill markers"
                }}
              />
            </mask>

            <radialGradient
              r="81.696091"
              fy="354.61966"
              fx="110.2329"
              cy="354.61966"
              cx="110.2329"
              gradientTransform="matrix(1.0710964,-0.00136896,0.00331101,2.2581141,-9.0113078,-446.00107)"
              gradientUnits="userSpaceOnUse"
              id="radialGradient4781"
              xlinkHref="#cutout_grad"
            />
            <clipPath id="bannerClip" clipPathUnits="userSpaceOnUse">
              <circle
                style={{
                  fill: "#313131",
                  fillOpacity: "0.6091603",
                  stroke: "#276ffe",
                  strokeWidth: "0.31842533",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeMiterlimit: "0.60000002",
                  strokeDasharray: "none",
                  strokeDashoffset: 29,
                  strokeOpacity: "0.97321424",
                  paintOrder: "stroke fill markers"
                }}
                id="circle4761"
                cx="110.14295"
                cy="349.2457"
                r="79.997787"
              />
            </clipPath>

            <radialGradient
              gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(-1,0,0,1.0287165,217.53124,159.13176)"
              r="77.910156"
              fy="110.45801"
              fx="110.01562"
              cy="110.45801"
              cx="110.01562"
              id="radialGradient4922"
              xlinkHref="#linearGradient4920"
            />
            <linearGradient id="linearGradient4920">
              <stop
                id="stop4916"
                offset={0}
                style={{ stopColor: "#232323", stopOpacity: "0.99607843" }}
              />
              <stop
                style={{ stopColor: "#202020", stopOpacity: "0.65882355" }}
                offset="0.57673264"
                id="stop4936"
              />
              <stop
                style={{ stopColor: "#4e4e4e", stopOpacity: "0.06717557" }}
                offset="0.96648365"
                id="stop4934"
              />
              <stop
                id="stop4918"
                offset={1}
                style={{ stopColor: "#ababab", stopOpacity: "0.0351145" }}
              />
            </linearGradient>
            <radialGradient
              xlinkHref="#bann_grad02"
              id="radialGradient1413"
              gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(1.0710964,-0.00136896,0.00331101,2.2581141,-9.0113078,-446.00107)"
              cx="110.2329"
              cy="354.61966"
              fx="110.2329"
              fy="354.61966"
              r="81.696091"
            />
            <linearGradient id="gg">
              <stop
                style={{ stopColor: "#1ee1ff", stopOpacity: 0 }}
                offset="0"
              />
              <stop
                style={{ stopColor: "#1ee1ff", stopOpacity: 0 }}
                offset="0.79"
              />
              <stop
                offset="0.85161424"
                style={{ stopColor: "#20dbff", stopOpacity: 0.8 }}
              />
              <stop
                style={{ stopColor: "#22d6ff", stopOpacity: 0 }}
                offset="0.95"
              />
              <stop
                style={{ stopColor: "#22d6ff", stopOpacity: 0 }}
                offset="1"
              />
            </linearGradient>
            <radialGradient
              xlinkHref="#gg"
              id="fad"
              cy="107.5"
              cx="107.5"
              r="105"
              fy="107.5"
              fx="107.5"
              gradientUnits="userSpaceOnUse"
            />
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="-9.4100606e-006"
              x2="106.72859"
              y1="215.68118"
              x1="106.72859"
              id="bg_gradient"
              xlinkHref="#linearGradient2910"
            />
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="-9.4100606e-006"
              x2="106.72859"
              y1="215.68118"
              x1="106.72859"
              id="linearGradient2920"
              xlinkHref="#linearGradient2918"
            />
          </defs>

          <g
            style={{ filter: "url(#filter2886)" }}
            transform="translate(16.100007,15.774079)"
            id="layer4"
          >
            <rect
              clipPath="none"
              style={{
                fill: "url(#bann_grad01)",
                stroke: "rgba(50,50,50,0.5)",
                strokeWidth: "5"
                //   strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: '0.60000002', strokeDasharray: 'none', strokeDashoffset: 29, strokeOpacity: '0.97321424', paintOrder: 'stroke fill markers',   filter: 'url(#filter4572)'
              }}
              width="175.00894"
              height="46.719555"
              x="20.228424"
              y="89.611829"
              mask="none"
            />
            <rect
              clipPath="url(#bannerClip)"
              style={{
                fill: "url(#radialGradient4781)",
                stroke: "none",
                // strokeWidth: '0.31048152', strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: '0.60000002', strokeDasharray: 'none', strokeDashoffset: 29, strokeOpacity: '0.97321424', paintOrder: 'stroke fill markers',
                filter: "url(#filter5176)"
              }}
              width="175.00894"
              height="46.719555"
              x="20.228424"
              y="89.611829"
              mask="url(#bannerMask)"
            />

            <path
              d="m 107.49999,169.56545 a 103,103 0 0 0 -102.9999969,103 103,103 0 0 0 25.1621089,67.26367 l 16.277344,-16.27734 a 80,80 0 0 1 -18.439453,-50.98633 80,80 0 0 1 79.999997,-80 80,80 0 0 1 80,80 80,80 0 0 1 -18.44531,51.05273 l 16.29687,16.29688 a 103,103 0 0 0 25.14844,-67.34961 103,103 0 0 0 -103,-103 z M 56.443352,334.11818 40.148431,350.41311 a 103,103 0 0 0 67.351559,25.15234 103,103 0 0 0 67.26562,-25.16602 l -16.27539,-16.27539 a 80,80 0 0 1 -50.99023,18.44141 80,80 0 0 1 -51.056638,-18.44727 z"
              style={{ fill: "#252525", stroke: "none" }}
              transform="translate(0,-164.7083)"
            />
            <path
              id="circle853"
              d="m 107.49999,169.56545 a 103,103 0 0 0 -102.9999969,103 103,103 0 0 0 25.1621089,67.26367 l 16.277344,-16.27734 a 80,80 0 0 1 -18.439453,-50.98633 80,80 0 0 1 79.999997,-80 80,80 0 0 1 80,80 80,80 0 0 1 -18.44531,51.05273 l 16.29687,16.29688 a 103,103 0 0 0 25.14844,-67.34961 103,103 0 0 0 -103,-103 z M 56.443352,334.11818 40.148431,350.41311 a 103,103 0 0 0 67.351559,25.15234 103,103 0 0 0 67.26562,-25.16602 l -16.27539,-16.27539 a 80,80 0 0 1 -50.99023,18.44141 80,80 0 0 1 -51.056638,-18.44727 z"
              style={{
                fill: "url(#linearGradient4676)",
                stroke: "#276ffe",
                strokeWidth: 0,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: "0.60000002",
                strokeDasharray: "none",
                strokeDashoffset: 29,
                strokeOpacity: "0.97321424",
                paintOrder: "stroke fill markers",
                filter: "url(#filter936)"
              }}
              transform="translate(0,-164.7083)"
            />
            <path
              d="m 165.16324,178.91972 a 91.900002,91.900002 0 0 1 -115.669085,0"
              className="rota"
              style={{
                fill: "none",
                strokeOpacity: "0.6",
                stroke: "none",
                strokeWidth: 18,
                strokeDasharray: "4px,2px",
                strokeDashoffset: 0
              }}
              id="path2783"
            />
            <path
              id="path2803"
              d="m 44.672757,183.12724 c 38.044157,31.30559 91.567513,28.54457 126.076993,0.21262"
              style={{ stroke: "none", fill: "none" }}
            />

            <text
              style={{
                fontSize: "14.66666698px",
                textAnchor: "middle",
                fill: "#dedede",
                stroke: "none"
              }}
            >
              <textPath
                id="textPath2805"
                startOffset="50%"
                xlinkHref="#path2803"
              >
                {bottom_text}
              </textPath>
            </text>

            <text
              y="156.89128"
              x="107.5"
              style={{
                fontSize: 16,
                textAlign: "center",
                textAnchor: "middle",
                fill: "#cccccc",
                stroke: "none"
              }}
            >
              <tspan y="156.89128" x="107.5">
                {total_formatted}
              </tspan>
            </text>
            <text
              y="282.56543"
              x="108.20163"
              style={{
                fontSize: 24,
                textAnchor: "middle",
                fill: "#dedede",
                stroke: "none"
              }}
              transform="translate(0,-164.7083)"
            >
              <tspan y="282.56543" x="108.20163" id="tspan2729">
                {value_formatted}
              </tspan>
            </text>
            <path
              d="m 38.142186,167.79182 a 91.900002,91.900002 0 0 1 5.904385,-126.76943 91.900002,91.900002 0 0 1 126.906859,2e-6 91.900002,91.900002 0 0 1 5.90438,126.769438"
              id="path2741"
              style={{
                fill: "none",
                stroke: "url(#fad)",
                strokeWidth: "21",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeMiterlimit: 4,
                strokeDasharray: dashes,
                strokeDashoffset: dashOffset,
                transition: " all 2.3s cubic-bezier(0.075, 0.82, 0.165, 1)",
                paintOrder: "fill markers stroke"
              }}
            />
            <text
              transform="translate(0,4.209752)"
              y="4.2097521"
              x="0.30069658"
              id="text2819"
              style={{
                fontSize: 12,
                textAnchor: "middle",
                fill: "#dedede",
                transition: " all 2.3s cubic-bezier(0.075, 0.82, 0.165, 1)",
                stroke: "none"
              }}
            >
              <textPath
                id="textPath2821"
                startOffset={percent}
                xlinkHref="#path2741"
              >
                <tspan id="tspan2817">{percent}</tspan>
              </textPath>
            </text>
            <text
              transform="translate(0,-164.7083)"
              style={{
                fontSize: 16,
                textAnchor: "middle",
                fill: "#dedede",
                stroke: "none"
              }}
              x="107.5"
              y="243.27972"
            >
              <tspan id="tspan2846" x="107.5" y="243.27972">
                {title}
              </tspan>
            </text>
          </g>
        </svg>
      </GlowContainer>
    );
  }
}
