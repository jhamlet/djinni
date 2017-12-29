const { assign, freeze } = Object;

const properties = {};

export default freeze({
  set (key, value) {
    properties[key] = value;
  },

  get (key) {
    return properties[key];
  },

  get properties () {
    return assign({}, properties);
  }
});
