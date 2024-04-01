$(document).ready(function () {
  /* 메인 */
  const mainImg = document.querySelectorAll('.main__contents .img-box');
  const mainTxt = document.querySelectorAll('.main__contents .txt-box p');

  gsap.set(mainImg, {
    opacity: 0,
  });
  gsap.set(mainTxt, {
    x: 10,
    opacity: 0,
  });

  gsap.to(mainImg, {
    opacity: 1,
    duration: 1,

    onComplete: function () {
      gsap.to(mainTxt, {
        x: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.4,
        onComplete: function () {
          // .main__contents .txt-box에 클래스 'shadow' 추가
          document
            .querySelectorAll('.main__contents .txt-box')
            .forEach(function (element) {
              element.classList.add('shadow');
            });
        },
      });
    },
  });

  /* 작품활동 */
  $.getJSON('/resources/js/filmo.json', function (data) {
    data.forEach(function (filmo) {
      var slideHTML = `
        <li class="swiper-slide">
          <dl>
            <dt><span>${filmo.filmoCategory}</span> ${filmo.filmoName}</dt>
            <dd>${filmo.filmoRole}</dd>
          </dl>
        </li>
      `;
      $('.filmoSwiper .swiper-wrapper').append(slideHTML);

      var filmoYearHTML = `
        <span>${filmo.filmoYear}</span>
      `;
      $('#filmoYear').append(filmoYearHTML);
    });

    var filmoSwiper = new Swiper('.filmoSwiper', {
      slidesPerView: 1,
      direction: 'vertical',
      speed: 500,
      spaceBetween: 30,
      centeredSlides: true,
      mousewheel: true,
      on: {
        init: function () {
          // 초기 활성화된 슬라이드의 filmoYear를 업데이트
          var initialFilmoYear = data[0].filmoYear;
          var initialFilmoThum = data[0].filmoThum;
          var initialFilmoThunImg = `
          <img src="${initialFilmoThum}" alt="" />
          `;
          $('#filmoYear').text(initialFilmoYear);
          updateFilmoThum(initialFilmoThum);
        },
        slideChange: function () {
          // 슬라이드가 변경될 때마다 활성 슬라이드의 filmoYear를 업데이트
          var activeIndex = this.activeIndex;
          var activeFilmoYear = data[activeIndex].filmoYear;
          $('#filmoYear').text(activeFilmoYear);

          //배경 업데이트
          var activeFilmoThum = data[activeIndex].filmoThum;
          var activeFilmoThunImg = `
          <img src="${activeFilmoThum}" alt="" />
          `;
          updateFilmoThum(activeFilmoThum);
        },
      },
    });

    // 배경 이미지 업데이트 함수
    function updateFilmoThum(filmoThum) {
      var filmoThumHTML = `<img src="${filmoThum}" alt="" />`;
      $('.filmo-thum').html(filmoThumHTML); // 기존 내용을 새 내용으로 대체
    }

    // Swiper 인스턴스 초기화
    filmoSwiper.init();
  });

  /* 헤더 */
  let links = gsap.utils.toArray('nav li a');

  links.forEach((link) => {
    let element = document.querySelector(link.getAttribute('href')),
      linkST = ScrollTrigger.create({
        trigger: element,
        start: 'top top',
      });

    ScrollTrigger.create({
      trigger: element,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => setActive(link),
    });
  });

  function setActive(link) {
    links.forEach((el) => el.classList.remove('on'));
    link.classList.add('on');
  }

  /* mainSwiper */
  const progressCircle = document.querySelector('.autoplay-progress svg');
  const progressContent = document.querySelector('.autoplay-progress span');

  var mainSwiper = new Swiper('.mainSwiper', {
    slidesPerView: 3,
    spaceBetween: 25,
    speed: 1000,
    loop: true,
    effect: 'fade',
    autoplay: {
      delay: 5000,
    },
    pagination: {
      el: '.mainSwiper_progressbar',
      type: 'progressbar',
    },
    navigation: {
      nextEl: '.mainSwiper_next',
    },

    on: {
      autoplayTimeLeft(s, time, progress) {
        progressCircle.style.setProperty('--progress', 1 - progress);
        progressContent.textContent = `${Math.ceil(time / 1000)}s`;
      },
    },
  });

  var profileFilm = new Swiper('.profile_film', {
    slidesPerView: 'auto',
    spaceBetween: 15,
    speed: 3000,
    autoplay: {
      delay: 1,
      desableOnInteraction: false,
    },
    loop: true,
    slidesPerView: 'auto',
    freemode: true,
  });
});

// 클릭 이벤트 리스너를 'mailCopy' 버튼에 추가
document.getElementById('mailCopy').addEventListener('click', function () {
  // 'myMail' 요소의 텍스트를 가져옴
  const mailText = document.getElementById('myMail').innerText;

  // 클립보드에 텍스트를 복사하는 함수 호출
  copyToClipboard(mailText);
});

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    // navigator.clipboard 사용이 가능한 경우
    navigator.clipboard.writeText(text).then(
      function () {
        console.log('Clipboard successfully set');
      },
      function () {
        console.error('Clipboard write failed');
      }
    );
  } else {
    // navigator.clipboard 사용이 불가능한 경우, textarea를 이용한 복사 방법
    let textArea = document.createElement('textarea');
    textArea.value = text;
    // 스타일을 통해 화면에서 보이지 않도록 처리
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999); // 모바일 기기를 위한 추가

    try {
      let successful = document.execCommand('copy');
      let msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  alert('메일이 복사되었습니다.');
}
