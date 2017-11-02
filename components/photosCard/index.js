module.exports = {
  data: {
    swiperIndex: 1,
    isShowSwiper: false
  },
  swiperChange: function (e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
  openSwiper: function (e) {
    var _curPhotos = e.currentTarget.dataset.photos
    var _idx = e.currentTarget.dataset.idx
    this.setData({
      isShowSwiper: true,
      swiperIndex: _idx,
      curPhotos: _curPhotos
    })
  },
  closeSwiper: function () {
    this.setData({
      isShowSwiper: false,
      swiperIndex: 1,
    })
  },
}