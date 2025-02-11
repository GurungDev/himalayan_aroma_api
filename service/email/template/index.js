import EnvConfig from "../../../config/EnvConfig.js";

/**
 *
 * @param {string} emailContent
 * @returns {string}
 */
export default function baseTemplate(emailContent) {
  return `
  <html>
      <head>
      </head>
      <body
          style="font-family: Arial, sans-serif; background-color: #FFFFFF; margin: 0; padding: 33;">
          <!-- Template for verification code -->
          <div style=" max-width:700px; padding: 30px 40px 0px 40px;  ">
              <div>
              </div>
              <div>
                 ${emailContent}
                  <p><bold>Have any queries, feel free to email us at <a
                              style="text-decoration:none;" href="url">
                              support@himalayanaroma.com</a> </p>
                  </div>
                  <div style="margin-top:20px;">
                      <p><strong>Privacy Policy | Terms of Service</strong></p>
                      <p
                          style="  text-decoration: none; color: #333; opacity: 0.7;">&copy;
                          2025, Himalayan Aroma. All rights reserved.</p></br>
              </div>
          </div>
  
           
      </body>
  
  </html>`;
}
