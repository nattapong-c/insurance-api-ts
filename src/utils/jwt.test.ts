import { JWT } from "./jwt";

describe("jwt", () => {
  let token = "";
  it("sign", () => {
    let jwt = new JWT();
    token = jwt.jwtSign({
      role: "admin",
    });
    expect(token).not.toBeUndefined();
  });
  it("verify", () => {
    let jwt = new JWT();
    let info = jwt.jwtVerify(token) as { role: string };
    expect(info.role).toBe("admin");
  });
});
