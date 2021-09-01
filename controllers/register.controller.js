class Register{
  static async SignUpDispatcher(req, res) {
    try {
      console.log(req);
      return res.status(200).json({status: 200, message: 'Retrieved'})
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = Register;