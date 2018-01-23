import test from 'ava';
import jsdom from 'jsdom';
import VideoController from '../videocontroller';
import { trigger } from './utils';

const { JSDOM } = jsdom;

// video element and VideoController
let target, vc, dom;

test.beforeEach(t => {
  dom = new JSDOM(`
    <!DOCTYPE html>
    <body>
      <video></video>
    </body>
  `);
  target = dom.window.document.getElementsByTagName("video")[0];
  vc = new VideoController(target, target.parentNode);
});

test('can initialize video controller', t => {
  t.truthy(vc);
});

test('video controller is hidden initially on video element', t => {
  t.is(vc.controllerView.style.visibility, 'hidden');
});

test('video controller displays current speed', t => {
  let speedView = vc._speedView;
  t.is(speedView.textContent, '1.0x');
});

test('video controller is visible on hover for video element', t => {
  trigger(dom, target, 'mouseenter');
  t.is(vc.controllerView.style.visibility, 'visible');
});

test('video controller is hidden on mouse exit for video element', t => {
  trigger(dom, target, 'mouseexit');
  t.is(vc.controllerView.style.visibility, 'hidden');
});

test('videocontroller has draggable attribute', t => {
  const draggable = vc.controllerView.getAttribute('draggable');
  t.is(draggable, 'true');
});

test('rewind: rewinds time by 10s', t => {
  const currentTime = target.currentTime;
  vc._rewind();
  t.is(target.currentTime, currentTime - 10);
});

test('faster: speeds up playback by 0.1', t => {
  const playbackRate = target.playbackRate;
  vc._faster();
  t.is(target.playbackRate, playbackRate + 0.1);
});

test('slower: slows down playback by 0.1', t => {
  const playbackRate = target.playbackRate;
  vc._slower();
  t.is(target.playbackRate, playbackRate - 0.1);
});
