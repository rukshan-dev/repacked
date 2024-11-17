import { FC, useState } from "react";
import CodeBlock from "@theme/CodeBlock";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";

const commands = {
  yarn: "yarn create repacked",
  npm: "npm create repacked",
  npx: "npx create-repacked",
};

const CodeSnippet: FC = () => {
  const [code, setCode] = useState(commands.npx);

  return (
    <Box>
      <Stack direction={"row"} px={1} mb={1}>
        <ButtonBase
          sx={{ p: 0.5 }}
          onClick={() => {
            setCode(commands.yarn);
          }}
        >
          <Typography variant="subtitle2">yarn</Typography>
        </ButtonBase>
        <ButtonBase
          sx={{ p: 0.5 }}
          onClick={() => {
            setCode(commands.npm);
          }}
        >
          <Typography variant="subtitle2">npm</Typography>
        </ButtonBase>
        <ButtonBase
          sx={{ p: 0.5 }}
          onClick={() => {
            setCode(commands.npx);
          }}
        >
          <Typography variant="subtitle2">npx</Typography>
        </ButtonBase>
      </Stack>
      <CodeBlock language={"bash"}>{code}</CodeBlock>
    </Box>
  );
};

export default CodeSnippet;
