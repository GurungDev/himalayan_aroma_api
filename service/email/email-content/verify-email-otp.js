export default function verifyEmailOtp(otp) {
  return `
  <div>
  <p><h1>Verification Code </h1>Your verification code:
      <strong>${otp}</strong></p>
  <p>Please verify your account by entering the verification
      code
      and finish setting up your profile.</p>
  </div>`;
}
