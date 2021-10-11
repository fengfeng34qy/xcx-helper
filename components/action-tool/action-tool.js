
Component({
  properties: {
    addGlobalClass: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        if (newVal != oldVal)
          this.triggerEvent("input", {
            value: newVal
          }, {});
      }
    }
  },
  data: {
    items: [{
      title: '写问题',
      icon: 'write',
      type: 2
    }],
    showMore: false
  },
  methods: {
    showMoreBtn() {
      this.setData({
        showMore: !this.data.showMore
      })
    },
    goSend: function goSend(index) {
      this.showMoreBtn()
      wx.navigateTo({
        url: '../../packageA/pages/createArticle/createArticle',
      })
    }
  }
})