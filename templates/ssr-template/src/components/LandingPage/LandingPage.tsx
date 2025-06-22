import { FC } from "react";
import { useLoaderData } from "react-router";

const LandingPage: FC = () => {
  const loaderData = useLoaderData();

  return (
    <div className="container">
      <h1>{loaderData.h1}</h1>
      <h2>{loaderData.h2}</h2>
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
