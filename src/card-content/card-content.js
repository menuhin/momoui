Component({
  properties: {
    mStyle: String,
  },
  relations: {
    '../card/card': {
      type: 'parent',
    },
  },
  options: {
    styleIsolation: 'shared',
  },
})
