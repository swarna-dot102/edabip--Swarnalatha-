'use strict';
document.addEventListener('DOMContentLoaded', function () {

  // Tabs (How it works)
  var tabs = document.querySelectorAll('.tab');
  var panels = document.querySelectorAll('.pn');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t); });
      panels.forEach(function (p, i) { p.classList.toggle('on', i === Number(t.dataset.t)); });
    });
  });

  // Mobile menu
  var bg = document.getElementById('bg');
  var nl = document.getElementById('nl');
  bg.addEventListener('click', function () {
    bg.setAttribute('aria-expanded', nl.classList.toggle('open'));
  });
  nl.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nl.classList.remove('open');
      bg.setAttribute('aria-expanded', 'false');
    });
  });

  // Newsletter form
  var form = document.getElementById('f');
  var msg = document.getElementById('msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = document.getElementById('em').value.trim();
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    msg.textContent = ok ? 'Thanks! You are subscribed.' : 'Enter a valid email, e.g. name@company.com.';
    if (ok) form.reset();
  });
});