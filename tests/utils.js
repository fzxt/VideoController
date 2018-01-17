function trigger(dom, el, ev) {
  var e = dom.window.document.createEvent('UIEvents');
  e.initEvent(ev, true, true);
  el.dispatchEvent(e);
}

module.exports = {
  trigger
};
