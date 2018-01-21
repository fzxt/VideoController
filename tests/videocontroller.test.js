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
  t.is('hidden', vc.controllerView.style.visibility);
});

test('video controller is visible on hover for video element', t => {
  trigger(dom, target, 'mouseenter');
  t.is('visible', vc.controllerView.style.visibility);
});

test('video controller is hidden on mouse exit for video element', t => {
  trigger(dom, target, 'mouseexit');
  t.is('hidden', vc.controllerView.style.visibility);
});

test('videocontroller has draggable attribute', t => {
  const draggable = vc.controllerView.getAttribute('draggable');
  t.is('true', draggable);
});

test('rewind: rewinds time by 10s', t => {
  const currentTime = target.currentTime;
  vc._rewind();
  t.is(currentTime - 10, target.currentTime);
});

test('faster: speeds up playback by 0.1', t => {
  const playbackRate = target.playbackRate;
  vc._faster();
  t.is(playbackRate + 0.1, target.playbackRate);
});

test('slower: slows down playback by 0.1', t => {
  const playbackRate = target.playbackRate;
  vc._slower();
  t.is(playbackRate - 0.1, target.playbackRate);
});
