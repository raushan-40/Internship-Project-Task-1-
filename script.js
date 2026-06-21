// Prodesk IT — script.js (Vanilla JS)
(function(){
  // Early theme initialization fallback if needed (keeps parity with inline head script)
  try{
    var t = localStorage.getItem('theme');
    if(t) document.documentElement.setAttribute('data-theme', t);
  }catch(e){}
})();
document.addEventListener('DOMContentLoaded', function(){
  // Set current year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const nav = document.getElementById('primary-nav');
  const btn = document.getElementById('nav-toggle');
  if(btn && nav){
    // initialize aria-expanded
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
    btn.addEventListener('click', function(){
      nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', nav.classList.contains('open'));
      if(nav.classList.contains('open')){
        // focus first menu item when opened for keyboard users
        const first = nav.querySelector('a[role="menuitem"]');
        if(first) first.focus();
      }
    });
    // close on Escape key when nav open
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && nav.classList.contains('open')){
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
        btn.focus();
      }
    });
  }

  // Theme toggle (persisted)
  const themeToggle = document.getElementById('theme-toggle');
  function getCurrentTheme(){
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
  function applyTheme(theme, save = true){
    // apply with transition helper
    document.documentElement.classList.add('theme-transition');
    document.documentElement.setAttribute('data-theme', theme);
    if(save){
      try{ localStorage.setItem('theme', theme); }catch(e){}
    }
    if(themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'dark');
    window.setTimeout(function(){ document.documentElement.classList.remove('theme-transition'); }, 300);
  }
  // initialize theme toggle state
  if(themeToggle){
    const saved = (function(){ try{return localStorage.getItem('theme')}catch(e){return null} })();
    if(saved){ applyTheme(saved, false); }
    else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){ applyTheme('dark', false); }
    else { applyTheme('light', false); }

    themeToggle.addEventListener('click', function(){
      const current = getCurrentTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });
  }

  // Sticky header: add shadow when scrolling (uses requestAnimationFrame for performance)
  const header = document.querySelector('.site-header');
  if(header){
    let lastKnownScrollY = 0;
    let ticking = false;
    function onScroll(){
      lastKnownScrollY = window.scrollY;
      if(!ticking){
        window.requestAnimationFrame(function(){
          if(lastKnownScrollY > 8){ header.classList.add('scrolled'); }
          else { header.classList.remove('scrolled'); }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    // initialize state
    onScroll();
  }

  // Smooth scrolling using event delegation (fewer listeners)
  document.addEventListener('click', function(e){
    var el = e.target.closest && e.target.closest('a[href^="#"]');
    if(!el) return;
    var href = el.getAttribute('href');
    if(!href || href === '#') return;
    var target = document.querySelector(href);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
      if(nav && nav.classList.contains('open')) nav.classList.remove('open');
      // briefly set focus for accessibility without scrolling further
      target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
      target.removeAttribute('tabindex');
    }
  }, true);

  // Contact form basic validation + fake submit
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if(!name || !email || !message){
        formMessage.textContent = 'Please complete all fields.';
        return;
      }
      // Simple email pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailPattern.test(email)){
        formMessage.textContent = 'Please enter a valid email.';
        return;
      }
      formMessage.textContent = 'Sending...';
      // Simulate network request
      setTimeout(function(){
        formMessage.textContent = 'Thank you — we\'ll get back to you shortly.';
        form.reset();
      }, 900);
    });
  }
});
