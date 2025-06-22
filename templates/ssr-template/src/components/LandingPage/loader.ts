"use server";
import { LoaderFunction } from "react-router";

export const landingPageLoader: LoaderFunction = () => {
  return {
    h1: "Welcome to Your New React App!",
    h2: "(configured with express js backend server and react-router data routes)",
  };
};
