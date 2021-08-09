class Register{
  static async SignUpDispatcher(req, res) {
    try {
      console.log("Hello")
      console.log(req)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = Register