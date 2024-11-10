# Repacked

## Initialization

To initialize a new project with `repacked`, you can use the following command:

```bash
npx create-repacked@latest
```

## API Documentation

```typescript
// filename: config.repacked.js
/**
 * @type {import('repacked').AppConfig}
 */
const config = {
  entry: "./src/index.tsx",
  devServer: {
    open: true,
    port: 3000,
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

## `entry: string`

- **Type**: `string`
- **Description**: The entry point for your application. This is the main file that Webpack will start bundling from. Typically, this is the root JavaScript or TypeScript file of your React app.
- **Example**:
  ```js
  entry: "./src/index.tsx"
  ```

## `devServer: object`

The `devServer` configuration provides options for setting up the development server behavior.

- **Type**: `object`
- **Properties**:
  - `open: boolean`
    - **Type**: `boolean`
    - **Description**: Determines whether the browser should automatically open when the development server starts.
    - **Default**: `false`
    - **Example**:
      ```js
      open: true
      ```
  - `port: number`
    - **Type**: `number`
    - **Description**: Specifies the port on which the development server will run.
    - **Default**: `3000`
    - **Example**:
      ```js
      port: 3000
      ```

## `webpack: function`

This function allows you to modify the Webpack configuration that is passed to it.

- **Type**: `(config: WebpackConfiguration) => WebpackConfiguration`
- **Parameters**:
  - `config`: The Webpack configuration object that `repacked` generates by default.
- **Return**: The modified Webpack configuration.
- **Example**:
  ```js
  webpack: (config) => {
    // Modify or extend the default Webpack config here
    return config;
  }
  ```

## `jest: function`

This function allows you to modify the Jest configuration used for running tests.

- **Type**: `(config: JestConfiguration) => JestConfiguration`
- **Parameters**:
  - `config`: The Jest configuration object that `repacked` generates by default.
- **Return**: The modified Jest configuration.
- **Example**:
  ```js
  jest: (config) => {
    // Modify or extend the default Jest config here
    return config;
  }
  ```

---

This API provides flexibility for customizing the behavior of your build process, including the Webpack bundling and Jest testing setups.
