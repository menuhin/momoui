import {debounce} from '../utils/utils'

const regexp = /(\b[0-9]{1,3}\b)/g

export default Behavior({
  properties: {
    ripple: {
      type: Boolean,
      value: true
    },
  },
  data: {
    rippleList: [],
    rippleListInitKey: 0,
    ripplelongpress: false,
    centerripple: false,
  },
  methods: {
    stopRipple: debounce(function () {
      if (!this.data.ripplelongpress) {
        this.setData({
          rippleList: [],
          rippleListInitKey: 0,
        })
      }
    }, 1000),
    rippleHoldEnd() {
      if (this.data.ripplelongpress) {
        const that = this
        setTimeout(function () {
          that.setData({
            rippleList: [],
            rippleListInitKey: 0,
            ripplelongpress: false,
          })
        }, 200)
      }
    },
    rippleHold(e) {
      this.setData({
        ripplelongpress: true,
      })
      const {x, y} = e.detail
      this._ripple({
        x,
        y
      }, 'hold')
    },
    rippleClick(e) {
      const {x, y} = e.detail
      this._ripple({
        x,
        y
      }, 'click')
    },
    _ripple(position, type) {
      const that = this
      const query = that.createSelectorQuery()
      query.select('.mui-ripple-view').fields({
        size: true,
        rect: true,
        computedStyle: ['backgroundColor']
      })
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        const [view, viewPort] = res
        const rippleBackgroundColor = that.rippleBackgroundColor || (that._highBrightnessColor(view.backgroundColor) ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)')
        const boxWidth = parseInt(view.width, 10)
        const boxHeight = parseInt(view.height, 10)

        let rippleLength
        if (boxWidth >= boxHeight) {
          rippleLength = boxWidth
        } else {
          rippleLength = boxHeight
        }

        const {centerripple} = that.data

        that.data.rippleListInitKey += 1
        const rippleClass = `mui-ripple-animation${type === 'hold' ? '-hold' : ''}${centerripple ? '-center' : ''}`

        let rippleX
        let rippleY
        if (centerripple) {
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
          key: that.data.rippleListInitKey,
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