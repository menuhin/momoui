const regexp = /(\b[0-9]{1,3}\b)/g

export default Behavior({
  properties: {
    ripple: {
      type: Boolean,
      value: true
    },
    customRippleBackgroundColor: String,
  },
  data: {
    rippleList: [],
    centerRipple: false,
    _tobeDeletedCount: 0,
  },
  methods: {
    stopRipple() {
      /*
      this.data._tobeDeletedCount++
      if (this.data.timer) {
        clearTimeout(this.data.timer)
      }
      function deleteRipple() {
        this.data.rippleList.splice(0, this.data._tobeDeletedCount)
        this.setData({
          rippleList: this.data.rippleList
        })
        clearTimeout(this.data.timer)
        this.data.timer = null
        this.data._tobeDeletedCount = 0
      }
      this.data.timer = setTimeout(deleteRipple.bind(this), 300)
      */
    },
    /*
    rippleHoldEnd(e, that) {
      const thisRippleBehaviors = that || this
      const {ripple, disabled} = thisRippleBehaviors.properties
      const {innerDisabled} = thisRippleBehaviors.data
      if (ripple && !disabled && !innerDisabled) {
        if (thisRippleBehaviors.data.ripplelongpress) {
          setTimeout(function () {
            thisRippleBehaviors.setData({
              rippleList: [],
              ripplelongpress: false,
            })
          }, 200)
        }
      }
    },
    */
    rippleHold(e, that) {
      const thisRippleBehaviors = that || this
      const {ripple, disabled} = thisRippleBehaviors.properties
      const {innerDisabled} = thisRippleBehaviors.data
      if (ripple && !disabled && !innerDisabled) {
        const {x, y} = e.detail
        thisRippleBehaviors._ripple({
          x,
          y
        }, 'hold')
      }
    },
    rippleClick(e, that) {
      const thisRippleBehaviors = that || this
      const {ripple, disabled} = thisRippleBehaviors.properties
      const {innerDisabled} = thisRippleBehaviors.data
      if (ripple && !disabled && !innerDisabled) {
        const {x, y} = e.detail
        thisRippleBehaviors._ripple({
          x,
          y
        }, 'click')
      }
    },
    _ripple(position, type) {
      const that = this
      const query = that.createSelectorQuery()
      query.select('.mui-ripple-view').fields({
        size: true,
        rect: true,
        computedStyle: ['backgroundColor'],
      })
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        const [view, viewPort] = res
        const rippleBackgroundColor = that.properties.customRippleBackgroundColor || that.data.rippleBackgroundColor || (that._highBrightnessColor(view.backgroundColor) ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)')
        const boxWidth = parseInt(view.width, 10)
        const boxHeight = parseInt(view.height, 10)

        let rippleLength
        if (boxWidth >= boxHeight) {
          rippleLength = boxWidth
        } else {
          rippleLength = boxHeight
        }

        const {centerRipple} = that.data

        const rippleClass = `mui-ripple-animation${type === 'hold' ? '-hold' : ''}${centerRipple ? '-center' : ''}`

        let rippleX
        let rippleY
        if (centerRipple) {
          if (boxWidth === boxHeight) {
            rippleX = 0
            rippleY = 0
          } else if (boxWidth > boxHeight) {
            rippleX = 0
            rippleY = -((boxWidth - boxHeight) / 2)
          } else {
            rippleX = -((boxHeight - boxWidth) / 2)
            rippleY = 0
          }
        } else {
          rippleX = (position.x - (view.left + viewPort.scrollLeft)) - (rippleLength / 2)
          rippleY = (position.y - (view.top + viewPort.scrollTop)) - (rippleLength / 2)
        }

        that.data.rippleList.push({
          length: rippleLength,
          x: rippleX,
          y: rippleY,
          backgroundColor: rippleBackgroundColor,
          key: `ripple-${new Date().getTime()}-${Math.round(Math.random() * 10000)}`,
          startRipple: true,
          rippleClass,
        })
        that.setData({
          rippleList: that.data.rippleList,
        })
      })
    },
    _highBrightnessColor(color) {
      const [r, g, b, a = 1] = color.match(regexp)
      return (
        (parseInt(r, 10) * 0.299 +
        parseInt(g, 10) * 0.578 +
        parseInt(b, 10) * 0.114) >= (192 * a)
      )
    }
  }
})
