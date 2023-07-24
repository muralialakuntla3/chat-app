import { JsonWebTokenError, sign } from "jsonwebtoken";
import { config } from "../src/config";
import { SafeUser } from "../src/types";
import {
  generatePasswordResetLink,
  generateToken,
  getAuthTokenPayload,
  getPasswordResetTokenPayload,
} from "./auth-utils";
import { toBase64 } from "./util";

describe("Test auth utils", () => {
  it("Reset link decodes given jwt correctly", () => {
    const email = "ramesh@example.com";
    const link = generatePasswordResetLink(email);
    const token = new URL(link).searchParams.get("token");
    expect(token).not.toBeNull();
    const payload = getPasswordResetTokenPayload(token as string);
    expect(payload as unknown).toEqual(email);
  });

  it("Handles tampered reset token correctly", () => {
    const email = "ramesh@example.com";
    const link = generatePasswordResetLink(email);
    const token = new URL(link).searchParams.get("token") as string; // Change some chars
    expect(token).not.toBeNull();
    const tamperedToken = [
      token.split(".")[0],
      toBase64(JSON.stringify({ email: "not-ramesh@example.com" })),
      token.split(".")[2],
    ].join(".");
    expect(() =>
      getPasswordResetTokenPayload(tamperedToken as string)
    ).toThrowError(JsonWebTokenError);
  });

  it("getAuthTokenPayload returns payload for valid tokens", () => {
    const user: SafeUser = {
      avatar: null,
      name: "Ramesh",
      email: "ramesh@example.com",
      username: "ramesh",
    };
    const token = generateToken(user);
    expect((getAuthTokenPayload(token) as SafeUser).username).toBe(
      user.username
    );
  });

  it("getAuthTokenPayload returns null payload for invalid tokens", () => {
    const token = "invalid token";
    expect(getAuthTokenPayload(token)).toEqual(null);
  });

  it("getAuthTokenPayload returns null payload for expired tokens", async () => {
    const user: SafeUser = {
      avatar: null,
      name: "Ramesh",
      email: "ramesh@example.com",
      username: "ramesh",
    };
    const expiredToken = sign(user, config.JWT_SECRET, {
      expiresIn: "10",
    });
    // Wait for 10ms
    await new Promise((r) => setTimeout(r, 10));
    expect(getAuthTokenPayload(expiredToken)).toEqual(null);
  });
});
