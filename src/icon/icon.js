import {Base64} from '../utils/base64'

const muiIconPath = '/styles/icons/'

const iconPathMap = {
  default: `${muiIconPath}default.svg`,
  share: `${muiIconPath}share.svg`,
  'share-arrow': `${muiIconPath}share-arrow.svg`,
  check: `${muiIconPath}check.svg`,
  'check-circle': `${muiIconPath}check-circle.svg`,
  close: `${muiIconPath}close.svg`,
  'close-circle': `${muiIconPath}close-circle.svg`,
  'bullet-list': `${muiIconPath}bullet-list.svg`,
  link: `${muiIconPath}link.svg`,
}

Component({
  properties: {
    name: {
      type: String,
      value: 'default',
    },
    size: {
      type: Number,
      value: 20,
    },
    color: String,
    background: {
      type: String,
      value: 'transparent',
    },
    pathprefix: {
      type: String,
      // value: '/miniprogram_npm/momoui/dist',
      value: '/components'
    },
    src: {
      type: String,
      value: '',
    },
    base64content: String,
  },
  lifetimes: {
    attached() {
      const {name, path} = this.properties
      if (path) {
        this._readSvgFile(path)
      } else if (name && iconPathMap[name]) {
        const iconPath = `${this.properties.pathprefix}${iconPathMap[name]}`
        this._readSvgFile(iconPath)
      }
    },
  },
  methods: {
    _readSvgFile(iconPath) {
      const that = this
      const {color} = that.properties
      wx.getFileSystemManager().readFile({
        filePath: iconPath,
        encoding: 'binary',
        success(res) {
          const base64 = new Base64()
          let svgdata = res.data
          if (color) {
            svgdata = svgdata.replace(/fill="#[a-zA-Z0-9]{0,6}"/, 'fill="' + color + '"')
          }
          const svgtobase64 = base64.encode(svgdata)
          that.setData({
            base64content: `data:image/svg+xml;base64,${svgtobase64}`
          })
        },
      })
    },
  },
})