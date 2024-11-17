import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { FC } from "react";
import CodeSnippet from "../CodeSnippet/CodeSnippet";
import styles from "./index.module.css";
import { Container, Grid2, Typography } from "@mui/material";
import Image from "./image.svg";

const HeroSection: FC = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header>
      <Container>
        <Grid2 container spacing={3} my={2}>
          <Grid2
            size={{ xs: 12, sm: 6 }}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"start"}
            justifyContent={"center"}
          >
            <Typography variant="h1" fontWeight={600} color="#ab7a55">
              Repacked.
            </Typography>
            <Typography variant="h4">{siteConfig.tagline}</Typography>
            <Typography variant="subtitle1" my={3}>
              A powerful and customizable toolchain designed to simplify your
              React development process. Repacked offers flexible configurations
              and an intuitive workflow, making it ideal for projects of any
              scale.
            </Typography>
            <CodeSnippet />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }} p={4}>
            <Image width={"100%"} height={"100%"} />
          </Grid2>
        </Grid2>
      </Container>
    </header>
  );
};

export default HeroSection;
