import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { FC } from "react";
import CodeSnippet from "../CodeSnippet/CodeSnippet";
import styles from "./index.module.css";

const HeroSection: FC = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header>
      <div className="container">
        <div className="hero-section">
          <h1 className={styles["repkd-w-700"]}>{siteConfig.title}</h1>
          <h2 className="">{siteConfig.tagline}</h2>
          <CodeSnippet language="bash" code={`npx create-repacked`} />
        </div>
        <div className="hero-section"></div>
      </div>
    </header>
  );
};

export default HeroSection;
