import {Base64} from '../utils/base64'
import {iconPathMap} from '../utils/utils'

/* eslint-disable */
const app = getApp()
/* eslint-disable */
let pathPrefix = '/miniprogram_npm/momoui-miniprogram'
if (app.momouiRootPath) {
  pathPrefix = app.momouiRootPath
}
/*
const muiIconPath = '/styles/icons/'

const iconPathMap = {
  'default': `${muiIconPath}default.svg`,
  'share': `${muiIconPath}share.svg`,
  'share-arrow': `${muiIconPath}share-arrow.svg`,
  'check': `${muiIconPath}check.svg`,
  'check-circle': `${muiIconPath}check-circle.svg`,
  'close': `${muiIconPath}close.svg`,
  'close-circle': `${muiIconPath}close-circle.svg`,
  'bullet-list': `${muiIconPath}bullet-list.svg`,
  'link': `${muiIconPath}link.svg`,
  'trash': `${muiIconPath}trash.svg`,
  'like': `${muiIconPath}like.svg`,
  'hand-like': `${muiIconPath}hand-like.svg`,
  'arrow-down-1': `${muiIconPath}arrow-down-1.svg`,
  'arrow-up-1': `${muiIconPath}arrow-up-1.svg`,
  'arrow-left-1': `${muiIconPath}arrow-left-1.svg`,
  'arrow-right-1': `${muiIconPath}arrow-right-1.svg`,
  'arrow-down-2': `${muiIconPath}arrow-down-2.svg`,
  'arrow-up-2': `${muiIconPath}arrow-up-2.svg`,
  'arrow-left-2': `${muiIconPath}arrow-left-2.svg`,
  'arrow-right-2': `${muiIconPath}arrow-right-2.svg`,
  'play':  `${muiIconPath}play.svg`,
  'play-next':  `${muiIconPath}play-next.svg`,
  'play-prev':  `${muiIconPath}play-previous.svg`,
  'pictures': `${muiIconPath}pictures.svg`,
  'square': `${muiIconPath}square.svg`,
  'square-check': `${muiIconPath}square-check-fill.svg`,
  'round': `${muiIconPath}round.svg`,
  'radio-box': `${muiIconPath}radio-box.svg`,
  'user': `${muiIconPath}user.svg`,
  'circle': `${muiIconPath}circle.svg`,
  'progress-circle': `${muiIconPath}progress-circle.svg`,
  'save': `${muiIconPath}save.svg`,
  'search': `${muiIconPath}search.svg`,
  'clock': `${muiIconPath}clock.svg`,
  'location': `${muiIconPath}location.svg`,
  'folder': `${muiIconPath}folder.svg`,
  'menu': `${muiIconPath}menu.svg`,
  'message': `${muiIconPath}message.svg`,
  'address-book': `${muiIconPath}address-book.svg`,
  'browser': `${muiIconPath}browser.svg`,
  'plus': `${muiIconPath}plus.svg`,
  'send': `${muiIconPath}send.svg`,
  'info': `${muiIconPath}info.svg`,
  'mail': `${muiIconPath}mail.svg`,
  'user-add': `${muiIconPath}user-add.svg`,
  'scan': `${muiIconPath}scan.svg`,
  'pay': `${muiIconPath}pay.svg`,
}
*/

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
    pathPrefix: {
      type: String,
      value: pathPrefix,
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
        const iconPath = `${this.properties.pathPrefix}${iconPathMap[name]}`
        this._readSvgFile(iconPath)
      }
    },
  },
  methods: {
    _readSvgFile(iconPath) {
      const that = this
      const {color, name} = that.properties
      wx.getFileSystemManager().readFile({
        filePath: iconPath,
        encoding: 'binary',
        success(res) {
          const base64 = new Base64()
          let svgdata = res.data
          if (color) {
            if (name === 'progress-circle') {
              svgdata = svgdata.replace(/stroke="#[a-zA-Z0-9]{0,6}"/g, 'stroke="' + color + '"')
            } else {
              svgdata = svgdata.replace(/fill="#[a-zA-Z0-9]{0,6}"/g, 'fill="' + color + '"')
            }
          }
          const svgtobase64 = base64.encode(svgdata)
          that.setData({
            base64content: `data:image/svg+xml;base64,${svgtobase64}`
          })
        },
      })
    },
  },
  observers: {
    'name, color': function (name) {
      if (name && iconPathMap[name]) {
        const iconPath = `${this.properties.pathPrefix}${iconPathMap[name]}`
        this._readSvgFile(iconPath)
      }
    },
  },
  options: {
    styleIsolation: 'shared',
  },
})
