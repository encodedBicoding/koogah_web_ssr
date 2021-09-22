class Company {
  constructor(
    args,
  ) {
    this.bank_account_name = args['bank_account_name'];
    this.bank_account_number = args['bank_account_number'];
    this.business_address = args['business_address'];
    this.business_country = args['business_country'];
    this.business_name = args['business_name'];
    this.business_state = args['business_state'];
    this.business_town = args['business_town'];
    this.email = args['email'];
    this.first_name = args['first_name'];
    this.last_name = args['last_name'];
    this.id = args['id'];
    this.last_payout = args['last_payout'];
    this.phone = args['phone'];
    this.profile_image = args['profile_image'];
    this.total_payouts = args['total_payouts'];
  }

  get fullPhoneNumber() {
    return `+234${this.phone}`;
  }
  toSentenceCase(string) {
    return string[0].toUpperCase() + string.substring(1, string.length);
  }
  get firstName() {
    return this.toSentenceCase(this.first_name);
  }

  get lastName() {
    return this.toSentenceCase(this.last_name);
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

};

module.exports = Company;