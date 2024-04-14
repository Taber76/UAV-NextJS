export { default as AltitudeInstrument } from "./altitudeIntrument";
export { default as BatteryInstrument } from "./batteryInstrument";
export { default as CommandBar } from "./commandBar";
export { default as DropDownButton } from "./dropDownButton";
export { default as HeadingInstrument } from "./headingInstrument";
export { default as HorizonInstrument } from "./horizonInstrument";
export { default as LoginForm } from "./loginForm";
export { default as SimpleModal } from "./simpleModal";
export { default as SpeedInstrument } from "./speedInstrument";
export { default as StatusBar } from "./statusBar";
export { default as WaypointsList } from "./waypointsList";

import dynamic from "next/dynamic";
export const Map = dynamic(() => import("./map"), { ssr: false })