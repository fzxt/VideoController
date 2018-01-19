class VideoController {
  constructor(target, parent) {
    this.target = target;
    this.parent = target.parentNode || parent;
    this.speed = 1.0;
    this.document = target.ownerDocument;
    this._dragStartPos = [];

    this._initControls = this._initControls.bind(this);
    this._setSpeed = this._setSpeed.bind(this);
    this._updateSpeed = this._updateSpeed.bind(this);
    this._dragStart = this._dragStart.bind(this);
    this._dragEnd = this._dragEnd.bind(this);
    this._insertStyles = this._insertStyles.bind(this);
    this._rewind = this._rewind.bind(this);
    this._faster = this._faster.bind(this);
    this._showControls = this._showControls.bind(this);
    this._slower = this._slower.bind(this);

    this._initControls();
    target.addEventListener('play', _ => this._setPlaybackRate());
    target.addEventListener('mouseenter', _ => this._showControls());
    target.addEventListener('mouseout', _ => this._hideControls());
  }

  _showControls() {
    this.controllerView.style.visibility = 'visible';
  }

  _hideControls() {
    this.controllerView.style.visibility = 'hidden';
  }

  _setSpeed(speed) {
    this.speed = Math.max(speed, 0);
    this.speedView.textContent = `${this.speed.toFixed(1)}x`;
  }

  _setPlaybackRate(rate) {
    this.target.playbackRate = rate;
  }

  _updateSpeed(speed) {
    this._setSpeed(speed);
    this._setPlaybackRate(this.speed);
  }

  _rewind() {
    this.target.currentTime -= 10;
  }

  _slower() {
    this._updateSpeed(this.speed - 0.1);
  }

  _faster() {
    this._updateSpeed(this.speed + 0.1);
  }

  _insertStyles() {
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
  }

  _dragStart(ev) {
    this._dragStartPos = [ev.screenX, ev.screenY];
    // TODO: Fix this, add a better, generated id
    ev.dataTransfer.setData('text/plain', ev.target.id);
  }

  _dragEnd(el, ev) {
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
  }

  _initControls() {
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
    // Hide initially
    controller.style.visibility = 'hidden';
    controller.setAttribute('draggable', true);
    controller.ondragstart = this._dragStart;
    controller.ondragend = (e) => { this._dragEnd(controller, e); };
    const speedView = this.document.createElement('span');
    speedView.textContent = `${this.speed}x`;
    const controlsContainer = this.document.createElement('span');

    for (let control of controls) {
      const button = this.document.createElement('button');
      button.classList.add('vidcontroller-btn');
      button.addEventListener('click', this[`_${control}`]);
      button.textContent = control;
      controlsContainer.appendChild(button);
    }

    controller.appendChild(speedView);
    controller.appendChild(controlsContainer);
    this.speedView = speedView;
    this.controllerView = controller;
    this.parent.insertBefore(controller, this.parent.firstChild);
  }
}

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
