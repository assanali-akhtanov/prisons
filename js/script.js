let prisoners = document.getElementById('prisoners');
let thousand = document.getElementById('thousand');
let counter = document.getElementById('counter');
let title = document.getElementById('title');
let html = document.getElementsByTagName('html');
let curve_wrapper_outer = document.getElementById('curve-wrapper-outer');
let url_params = new URLSearchParams(window.location.search);
let mute = url_params.get('mute');
let unscroll = url_params.get('unscroll');
let scroll_count = 0;

if (mute) {
  html[0].classList.add('mute')
}
if (unscroll) {
  html[0].classList.add('unscroll')
}

if (!mute) {
  let citations = document.querySelectorAll('.citation');
  citations.forEach(function(citation, i){
    citation.innerHTML = i+1;
  })

  let observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        html[0].classList = (unscroll) ? "unscroll" : "";
        html[0].classList.add(entry.target.dataset.background);
      }
    })
  })
  document.querySelectorAll('[data-background]').forEach(function(target){
    observer.observe(target);
  });

  let until_recently_shown = false;
  let since_it_began_shown = false;

  let curveObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        if (entry.target.id === 'since-it-began') {
          since_it_began_shown = true;
        }
        if (entry.target.id === 'until-recently') {
          until_recently_shown = true;
        }
        if (entry.target.id === 'none-of-this') {
          since_it_began_shown = false;
          until_recently_shown = false;
          curve_wrapper_outer.classList.remove('stretched');
          curve_wrapper_outer.classList.remove('show-correlation');
        }
      }
      if (entry.target.id === 'until-recently'
        && !entry.isIntersecting
       && until_recently_shown === true) {
        if ((entry.target.offsetTop - window.scrollY - window.innerHeight) < 0) {
          curve_wrapper_outer.classList.add('stretched');
        }
        else {
          curve_wrapper_outer.classList.remove('stretched');
        }
      }

      if (entry.target.id === 'since-it-began'
        && !entry.isIntersecting
        && until_recently_shown === true) {
        if ((entry.target.offsetTop - window.scrollY - window.innerHeight) < 0) {
          curve_wrapper_outer.classList.add('show-correlation');
        }
        else {
          curve_wrapper_outer.classList.remove('show-correlation');
        }
      }
    })
  })
  document.querySelectorAll('.curve-section').forEach(function(target){
    curveObserver.observe(target);
  });
  let letterObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
      else {
        entry.target.classList.remove('animate');
      }
    })
  })
  let letters = document.getElementById('animated-letters');
  letterObserver.observe(letters);

  function toggleExpand(outer, inner) {
    let outerEl = document.getElementById(outer);
    let innerEl = document.getElementById(inner);
    let offset = Math.abs(outerEl.offsetTop - innerEl.offsetTop);
    innerEl.style.top = offset + 'px';
    outerEl.classList.add('expanded')
  }

  function showTooltip(e) {
    let tooltip = e.parentElement.getElementsByClassName('tooltip')[0]
    tooltip.classList.add('open')
  }
  function closeTooltip(e) {
    e.parentElement.classList.remove('open');
  }
}

window.addEventListener('scroll', function(e) {
  scroll_count = getScrollCount();
  if (scroll_count > 2000) {
    counter.innerHTML = scroll_count.toLocaleString();
  }
  else {
    counter.innerHTML = '';
  }
});

function getScrollCount() {
  let body = document.documentElement || document.body;
  let total_height = prisoners.clientHeight;
  let scroll_percent = (body.scrollTop - prisoners.offsetTop + body.clientHeight) / total_height;
  let count = Math.floor(scroll_percent * 2300000);
  return count;
}

function setHeight() {
  let browser_width = window.innerWidth || document.body.clientWidth;
  let icons_per_card = 200;
  let pixel_height_per_card = 500;
  let pixel_width_per_card = 400;

  let cards_per_row = browser_width / pixel_width_per_card;
  let icons_per_row = icons_per_card * cards_per_row;
  let number_of_rows = 2300000/icons_per_row;

  let height = Math.floor(number_of_rows * pixel_height_per_card);
  prisoners.style.height = height + "px";

  if (!mute) {
    let thousand_height = Math.floor((1000/icons_per_row) * pixel_height_per_card);
    thousand.style.height = thousand_height + "px";
  }
}
setHeight();
window.addEventListener("orientationchange", setHeight);
window.addEventListener("resize", setHeight);
