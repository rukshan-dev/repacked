import { FC } from "react";
import "./styles.css";

const LandingPage: FC = () => {
  return (
    <div className="container">
      <h1>Welcome to Your New React App!</h1>
      <p>
        Congratulations on setting up your app with{" "}
        <span className="brand">Repacked</span>! Here's what you can look
        forward to with this streamlined toolchain:
      </p>
      <div className="features">
        <div className="feature-item">
          <strong>Instant Setup:</strong> No complex configurations—start
          developing right away.
        </div>
        <div className="feature-item">
          <strong>Essential Commands:</strong> Includes <i>start</i>,{" "}
          <i>build</i>, and <i>test</i> commands to streamline your development
          process.
        </div>
        <div className="feature-item">
          <strong>Developer-Friendly:</strong> Hot reloading, TypeScript
          support, and more, included by default.
        </div>
      </div>
      <p>
        <span className="brand">Repacked</span> is here to boost your
        productivity and help you create amazing apps. Let's get started!
      </p>
    </div>
  );
};

export default LandingPage;
