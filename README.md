# Repacked

## Initialization

To initialize a new project with `repacked`, you can use the following command:

```bash
npx create-repacked@latest
```

## Example Configuration

```js
/**
 * @type {import('repacked').AppConfig}
 */
const config = {
  development: {
    open: true, // default is true
    port: 4000, // default is 3000
  },
  output: {
    dir: "./dist", // default is ./dist
  },
  client: {
    enabled: true, // default is true
    entry: "./src/index.tsx", // default is ./src/index.tsx
    template: "./src/index.html", // default is ./src/index.html
  },
  server: {
    enabled: true, // default is false
    entry: "./src/server.tsx", // default is ./src/server.ts
  },
  webpack: (config) => {
    return config;
  },
  jest: (config) => {
    return config;
  },
};

module.exports = config;

```

## API Documentation

# Repacked Configuration Options

This document outlines the configuration options for customizing your Repacked project. All options are optional, and default values will be used if not specified.

---

## development

Settings related to the development server.

| Option      | Type    | Default | Description                                  |
|-------------|---------|---------|----------------------------------------------|
| `open`      | boolean | `true`  | Automatically opens the browser on start.    |
| `port`      | number  | `3000`  | The port number for the development server.  |

---

## output

Controls the output directory for the build.

| Option | Type   | Default  | Description                     |
|--------|--------|----------|---------------------------------|
| `dir`  | string | `./dist` | Directory to output build files.|

---

## client

Settings for the client-side application.

| Option     | Type    | Default                | Description                                         |
|------------|---------|------------------------|-----------------------------------------------------|
| `enabled`  | boolean | `true`                 | Whether to enable the client build.                 |
| `entry`    | string  | `./src/index.tsx`      | Path to the client entry file.                      |
| `template` | string  | `./src/index.html`     | Path to the HTML template used for the client app.  |

---

## server

Settings for the server-side application.

| Option     | Type    | Default            | Description                                      |
|------------|---------|--------------------|--------------------------------------------------|
| `enabled`  | boolean | `false`            | Whether to enable the server-side build.         |
| `entry`    | string  | `./src/server.ts`  | Path to the server entry file.                   |

---

## webpack

A function to customize the Rspack configuration.

| Option    | Type     | Description                          |
|-----------|----------|--------------------------------------|
| `config`  | function | A function that takes the Rspack configuration and returns a modified version.|

Example:
```js
rspack: (config) => {
  // Modify the Rspack config here
  return config;
}
```

---

## jest

A function to customize the Jest configuration.

| Option    | Type     | Description                          |
|-----------|----------|--------------------------------------|
| `config`  | function | A function that takes the Jest configuration and returns a modified version.|

Example:
```js
jest: (config) => {
  // Modify the Jest config here
  return config;
}
```