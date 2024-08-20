import React from "react";
import styled from "styled-components";
import posed from "react-pose";

const Stylish = (elem, animCfg) => styled(posed[elem](animCfg));
