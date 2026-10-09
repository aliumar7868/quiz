/* Small page helpers shared by the landing pages. */
(function () {
  'use strict';

  // Buttons marked data-start-quiz scroll to the quiz and focus its first question.
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-start-quiz]');
    if (!trigger) return;
    var quiz = document.querySelector(trigger.getAttribute('data-start-quiz') || '#quiz');
    if (!quiz) return;
    e.preventDefault();
    quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Pages with an intro screen open the quiz first.
    var starter = quiz.querySelector('[data-quiz-start]');
    if (starter && starter.offsetParent !== null) starter.click();
    var first = quiz.querySelector('.quiz-option, input, .quiz-title');
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 450);
  });

  // The sticky mobile call bar only appears once the quiz is off screen.
  var bar = document.querySelector('.mobile-bar');
  var quiz = document.querySelector('[data-quiz-watch]');
  if (bar && quiz && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      bar.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { threshold: 0.05 }).observe(quiz);
  } else if (bar) {
    bar.classList.add('is-visible');
  }
})();
