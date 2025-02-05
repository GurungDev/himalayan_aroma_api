export default class ExpressError extends Error {
  /**
   *
   * @param {number} status
   * @param {string} message
   * @param {*} data
   * @param {*} redirectInfo
   */

  constructor(
    status = 500,
    message = "Something went wrong.",
    data,
    redirectInfo
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = data;
    this.redirectInfo = redirectInfo;
  }

  getStatus() {
    return this.status;
  }

  getMessage() {
    return this.message;
  }

  getData() {
    return this.data;
  }

  getRedirectInfo() {
    return this.redirectInfo;
  }
}
