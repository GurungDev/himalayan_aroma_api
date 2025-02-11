export default function forgotPasswordOtp(otp) {
  return `
    <div style="text-align: ; padding: 20px;">
    <p><h1>Verification Code </h1>Your Verification code:<strong>${otp}</strong></p>
     <p style="opacity:0.7">Please verify your account by entering the verification code.</p>
   </div>
  `;
}
