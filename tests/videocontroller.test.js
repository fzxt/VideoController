import test from 'ava';
import jsdom from 'jsdom';
import VideoController from '../videocontroller';
import { trigger } from './utils';

const { JSDOM } = jsdom;

const dom = new JSDOM(`
  <!DOCTYPE html>
  <body>
    <video></video>
  </body>
`);

// video element and VideoController
let target, vc;

test.beforeEach(t => {
  target = dom.window.document.getElementsByTagName("video")[0];
  vc = new VideoController(target, target.parentNode);
});

test('can initialize video controller', t => {
  t.truthy(vc);
});

test('video controller is hidden initially on video element', t => {
  t.is(vc.controllerView.style.visibility, 'hidden');
});

test('video controller is visible on hover for video element', t => {
  trigger(dom, target, 'mouseenter');
  t.is(vc.controllerView.style.visibility, 'visible');
});

test('video controller is hidden on mouse exit for video element', t => {
  trigger(dom, target, 'mouseexit');
  t.is(vc.controllerView.style.visibility, 'hidden');
});
