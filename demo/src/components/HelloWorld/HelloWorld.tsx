import { FC, Fragment } from "react";
import logo from "./logo.svg";
import "./style.css";

const HelloWorld: FC = () => {
  return (
    <div className="hello-world-container">
      <h2 className="hello-world">REPACKED</h2>
      <h3>Simplified all-in-one toolchain for react.</h3>
      <img width={200} src={logo} />
    </div>
  );
};

export default HelloWorld;
