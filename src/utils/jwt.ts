import { sign, verify, SignOptions } from "jsonwebtoken";
import ENV from "../config_env";

export class JWT {
  privateKey: string;
  publicKey: string;
  private config: SignOptions;
  constructor() {
    this.privateKey = ENV.JWT_PRIVATE_KEY.replace(/\\n/g, "\n");
    this.publicKey = ENV.JWT_PUBLIC_KEY.replace(/\\n/g, "\n");
    this.config = {
      algorithm: "RS256",
      expiresIn: "30d",
    };
  }

  jwtSign(payload: object): string {
    return sign(payload, this.privateKey, this.config);
  }

  jwtVerify(token: string) {
    return verify(token, this.publicKey, this.config);
  }
}
