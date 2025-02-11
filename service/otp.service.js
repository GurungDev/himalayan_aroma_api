import ExpressError from "../common/error.js";
import Otp from "../model/otp.model.js";

class OtpService {
  async buildOtp(email, purpose) {
    const otp = Array(5)
      .fill(null)
      .map(() => Math.floor(Math.random() * 10).toString())
      .join("");

    const verificationToken = {
      purpose,
      email,
      otp,
    };

    await Otp.updateMany({ purpose, email }, { isRevoked: true });
    return await new Otp(verificationToken).save();
  }

  async getOTP(otp) {
    return await Otp.findOne({ otp: otp });
  }

  async verifyOtp({ purpose, otp, email }) {
    const vToken = await Otp.findOne({ purpose, otp, email });
    console.log(vToken);
    if (!vToken) {
      throw new ExpressError(
        400,
        `Invalid token provided. Couldn't find token for this purpose.`
      );
    }

    if (vToken.isRevoked) {
      throw new ExpressError(400, `Can't verify token. Token no longer valid.`);
    }

    

    return vToken;
  }
  async revokeAllSimilarOtp(purpose, email) {
    return await Otp.updateMany({ purpose, email }, { isRevoked: true });
  }
  async revokeAOtp(otp) {
    return await Otp.updateOne({ otp }, { isRevoked: true });
  }
}

const otpService = new OtpService();
export default otpService;
