class Verify {
  constructor(option) {
    this.option = option
  }
  static verifyKong(str) {
    return /^\s*$/g.test(str)
  }
  static verifyPhone(str) {
    return /\d{11}/.test(str)
  }
  static verifyNum(str) {
    return /^\d+$/.test(str)
  }
}

export default Verify