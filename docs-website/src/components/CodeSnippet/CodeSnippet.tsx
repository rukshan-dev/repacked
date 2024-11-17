import { FC } from "react";
import CodeBlock from "@theme/CodeBlock";

const CodeSnippet: FC<{ code: string; language: string }> = ({
  code,
  language,
}) => {
  return <CodeBlock language={language}>{code}</CodeBlock>;
};

export default CodeSnippet;
