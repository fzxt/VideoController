function VideoController(target, parent) {
  this.target = target;
  this.parent = parent || target.parentNode;
  this.document = target.ownerDocument;
  this._speed = 1.0;
  this._dragStartPos = [];
  target.addEventListener('play', _ => this._setPlaybackRate(this._speed));
  target.addEventListener('mouseenter', _ => this._showControls());
  target.addEventListener('mouseout', _ => this._hideControls());
  this._initControls();
}

VideoController.prototype._setPlaybackRate = function(rate) {
  this.target.playbackRate = rate;
};

VideoController.prototype._showControls = function() {
  this.controllerView.style.visibility = 'visible';
};

VideoController.prototype._hideControls = function() {
  this.controllerView.style.visibility = 'hidden';
};

VideoController.prototype._setSpeed = function(speed) {
  this._speed = Math.max(0, speed);
  this._speedView.textContent = `${this._speed.toFixed(1)}x`;
};

VideoController.prototype._updateSpeed = function(speed) {
  this._setSpeed(speed);
  this._setPlaybackRate(this._speed);
};

VideoController.prototype._rewind = function() {
  this.target.currentTime -= 10;
};

VideoController.prototype._slower = function() {
  this._updateSpeed(this._speed - 0.1);
};

VideoController.prototype._faster = function() {
  this._updateSpeed(this._speed + 0.1);
};

VideoController.prototype._dragStart = function(ev) {
  this._dragStartPos = [ev.screenX, ev.screenY];
  // TODO: Fix this, add a better, generated id
  ev.dataTransfer.setData('text/plain', ev.target.id);
};

VideoController.prototype._dragEnd = function(el, ev) {
  let style = this.document.defaultView.getComputedStyle(el, null);
  let endPos = [ev.screenX, ev.screenY];
  const topPixels = Number(style.top.replace('px', ''));
  const leftPixels = Number(style.left.replace('px', ''));
  const newTop = topPixels + (endPos[1] - this._dragStartPos[1]);
  const newLeft = leftPixels + (endPos[0] - this._dragStartPos[0]);
  const validTop = newTop > 0 && newTop <= this.target.height;
  const validLeft = newLeft > 0 && newLeft <= this.target.width;
  if (validTop && validLeft) {
    el.style.top =  newTop + 'px';
    el.style.left = newLeft + 'px';
  }
};

VideoController.prototype._insertStyles = function() {
  const css = `
  .vidcontroller {
    position: absolute;
    top: 0;
    left: 0;
    background: black;
    color: white;
    border-radius: 5px;
    padding: 5px;
    margin: 10px 10px 10px 15px;
    cursor: default;
    z-index: 9999999;
    opacity: 0.7;
    transition: 300ms all;
  }
  .vidcontroller:hover {
    opacity: 1;
  }
  .vidcontroller-btn {
    margin-left: 10px;
  }`;

  const style = this.document.createElement('style');
  style.textContent = css;

  this.document.head.appendChild(style);
};

VideoController.prototype._initControls = function() {
  this._insertStyles();
  let controls = ['rewind', 'slower', 'faster'];
  const controller = this.document.createElement('div');

  const resetInteractions = (e) => {
    e.preventDefault();
    this._showControls();
  };

  controller.addEventListener('mouseover', resetInteractions);
  controller.addEventListener('mouseenter', resetInteractions);
  controller.addEventListener('mouseclick', resetInteractions);

  controller.classList.add('vidcontroller');
  controller.style.visibility = 'hidden';
  controller.setAttribute('draggable', true);
  controller.ondragstart = (e) => { this._dragStart(e); };
  controller.ondragend = (e) => { this._dragEnd(controller, e); };

  const speedView = this.document.createElement('span');
  speedView.textContent = `${this._speed.toFixed(1)}x`;

  const controlsContainer = this.document.createElement('span');
  for (let control of controls) {
    const button = this.document.createElement('button');
    button.classList.add('vidcontroller-btn');
    button.addEventListener('click', _ => this[`_${control}`]());
    button.textContent = control;
    controlsContainer.appendChild(button);
  }
  controller.appendChild(speedView);
  controller.appendChild(controlsContainer);

  this._speedView = speedView;
  this.controllerView = controller;
  this.parent.insertBefore(controller, this.parent.firstChild);
};

/**
 * Called when the webpage is loaded
 * @param {Document} document
 */
const init = (document) => {
  const videoTags = document.getElementsByTagName('video');
  for (let i = 0; i < videoTags.length; i++) {
    const video = videoTags[i];
    new VideoController(video, video.parentNode);
  }
};

// For testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VideoController;
} else {
  // Entry point in the browser
  window.onload = () => init(document);
}
