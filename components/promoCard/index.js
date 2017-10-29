module.exports = {
  data: {
    a: 1,
    b: 2
  },
  onLoad: function () {
    console.log('component promoCard')
    this.getPromoCard()
  },
  getPromoCard: () => {
    console.log('get methods')
  }
}