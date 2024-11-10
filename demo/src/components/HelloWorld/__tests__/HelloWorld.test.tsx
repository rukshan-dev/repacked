import { render } from "@testing-library/react";
import HelloWorld from "../HelloWorld";

describe("HelloWorld", () => {
  it("should render component", () => {
    const result = render(<HelloWorld />);
    expect(result.container).toMatchInlineSnapshot(`
<div>
  <div
    class="hello-world-container"
  >
    <h2
      class="hello-world"
    >
      REPACKED
    </h2>
    <h3>
      Simplified all-in-one toolchain for react.
    </h3>
    <img
      src="logo.svg"
      width="200"
    />
  </div>
</div>
`);
  });
});
