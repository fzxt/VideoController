class VideoController {
  constructor(target, parent) {
    this.target = target;
    this.parent = target.parentNode || parent;
    this.speed = 1.0;
    this.document = target.ownerDocument;

    this._initControls = this._initControls.bind(this);
    this._setSpeed = this._setSpeed.bind(this);
    this._updateSpeed = this._updateSpeed.bind(this);
    this._insertStyles = this._insertStyles.bind(this);
    this._rewind = this._rewind.bind(this);
    this._faster = this._faster.bind(this);
    this._slower = this._slower.bind(this);

    target.addEventListener('play', _ => this._setPlaybackRate());
    this._initControls();
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
        opacity: 0.3;
      }

      .vidcontroller-btn {
        margin-left: 10px;
      }`;

    const style = this.document.createElement('style');
    style.textContent = css;

    this.document.head.appendChild(style);
  }

  _initControls() {
    this._insertStyles();
    let controls = ['rewind', 'slower', 'faster'];
    const controller = document.createElement('div');
    controller.classList.add('vidcontroller');
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

window.onload = () => init(document);
