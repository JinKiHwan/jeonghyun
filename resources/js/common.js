//언어체크
const userLang = document.getElementsByTagName('html')[0].getAttribute('lang');

$(document).ready(function () {
  // 메인비주얼 영상 기능
  const isMainVideo = document.querySelector('#isMainMovie');
  const videoArea = $('#isConnectionArea');
  const isHome = $('#home');
  const isStory = $('#story');
  const isMovie = $('#isMovie');
  let videoStr = 'start';

  isMainVideo.addEventListener('ended', handleVideoEnd);

  //영상 종료 헨들러
  function handleVideoEnd(e) {
    e.preventDefault();
    if (videoStr === 'start') {
      videoStr = 'end';
    } else {
      videoStr = 'start';
    }
    setMovieClass(videoStr);
  }
  //BG 클래스 세팅
  function setMovieClass(str) {
    if (str === 'start') {
      videoArea.removeClass('movieend');
    } else if (str === 'end') {
      videoArea.addClass('movieend');
    }
    isMovie.hide();
    isHome.removeClass('playmovie');
    controlMovie();
  }
  //영상 컨트롤
  function controlMovie() {
    setTimeout(() => {
      isMovie.show();
      isHome.addClass('playmovie');
      isStory.addClass('playmovie');
      reloadVideo();
    }, 5000);
  }

  //영상 리로드
  function reloadVideo() {
    let originalSource = isMainVideo.src;
    isMainVideo.src = '';
    isMainVideo.src = originalSource;
    isMainVideo.load();
  }

  //메인 영상 init
  setMovieClass('start');

  /* 스토리 섹션으로 이동시 + 100px */
  const link = document.querySelector('a[href="#story"]');

  link.addEventListener('click', function (event) {
    event.preventDefault(); // 링크 클릭 시 기본 동작인 스크롤 이동을 막음

    const targetElement = document.querySelector('#story');
    if (targetElement) {
      const targetOffset = targetElement.offsetTop + 100;
      window.scrollTo({
        top: targetOffset,
      });
    }
  });

  /* 캐릭터 스와이퍼 */
  let charThum = new Swiper('.charThum', {
    slidesPerView: 7,
    slidesPerGroup: 7,
    spaceBetween: 10,
    breakpoints: {
      1024: {
        touchRatio: 0,
        direction: 'vertical',
        slidesPerView: 'auto',
      },
    },
  });

  let charDetail = new Swiper('.charDetail', {
    slidesPerView: 1,
    touchRatio: 1, //터치 슬라이드 방지
    spaceBetween: 30,
    thumbs: {
      swiper: charThum,
    },
    effect: 'fade',
    breakpoints: {
      1024: {
        touchRatio: 0,
      },
    },
  });

  /* 시스템 스와이퍼 */
  let systemSw = new Swiper('.systemSw', {
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    allowTouchMove: false,
    loop: true,
    loopAdditionalSlides: 5,
    speed: 6000,
    slidesPerView: 2.5,
    spaceBetween: 10,
    breakpoints: {
      1024: {
        spaceBetween: 11,
        spaceBetween: 40,
        slidesPerView: 'auto',
      },
    },
  });
});

//특정영역 탑 버튼 노출, 비노출
let isScrollTop = $('#isScrollTop');
$(window).on('scroll', function () {
  // Top Btn
  checkVisible($('#character'));
});
function checkVisible(elm) {
  let viewportHeight = $(window).height(), // Viewport Height
    scrolltop = $(window).scrollTop(), // Scroll Top
    y = $(elm).offset().top;

  if (y < viewportHeight + scrolltop) {
    isScrollTop.addClass('-show');
  } else {
    isScrollTop.removeClass('-show');
  }
}

//캐릭터 음성
function actCharVoice() {
  alert('준비 중입니다.');
}

//메뉴 보이기, 숨기기
function actToggle(el, id, type) {
  $(el).toggleClass('-active');
  $('#' + id).toggleClass('-show');

  //슬라이드 토글 모션
  if (type == 'slide') {
    //sns 나라 별 분기
    if (id == 'isSnsList') {
      let liElements = $('#isSnsList > li');
      let isShowSns = [];

      if (userLang == 'ko') {
        //한국어
        isShowSns = ['navercafe', 'twiter', 'youtube', 'discode'];
      } else if (userLang == 'en') {
        //영어
        isShowSns = ['twiter', 'facebook', 'youtube', 'discode'];
      } else if (userLang == 'ja') {
        //일본어
        isShowSns = ['twiter', 'youtube', 'discode'];
      } else if (userLang == 'zh') {
        //중국어(간체)
        isShowSns = ['weibo', 'bili'];
      } else if (userLang == 'zt') {
        //중국어(번체)
        isShowSns = ['facebook', 'youtube', 'discode'];
      }

      liElements.each(function () {
        let sns = $(this).find('a').attr('class');
        if (isShowSns.includes(sns)) {
          $(this).css('display', 'flex');
        }
      });
    }

    $('#' + id)
      .stop()
      .slideToggle({
        duration: 500,
      });
  } else if (type == 'nav') {
    setMobileNav(id);
  }
}

//모바일 Nav 세팅
function setMobileNav(id) {
  let isW = $('#' + id).width();
  let isH = $('body').height();
  $('#' + id).css('height', isH);
  $('#isLangList').css('width', isW);
  $('#isSnsList').css('width', isW);
}
function resetMobileNav(id) {
  $('#' + id).css('height', 'auto');
  $('#isLangList').css('width', 'auto');
  $('#isSnsList').css('width', 'auto');
}

//SNS 링크 분기
function isSnsLink(link) {
  let url = '';

  if (userLang == 'ko') {
    //한국어
    switch (link) {
      case 'navercafe':
        url = 'https://cafe.naver.com/witchspring';
        break;
      case 'twiter':
        url = 'https://twitter.com/WitchSpring_kr';
        break;
      case 'youtube':
        url = 'https://www.youtube.com/@KIWIWALKS';
        break;
      case 'discode':
        url = 'https://discord.gg/uKwnCUat';
        break;
      default:
        break;
    }
  } else if (userLang == 'en') {
    //영어
    switch (link) {
      case 'twiter':
        url = 'https://twitter.com/witchspringr';
        break;
      case 'facebook':
        url = 'https://www.facebook.com/witchsprings';
        break;
      case 'youtube':
        url = 'https://www.youtube.com/@KIWIWALKS';
        break;
      case 'discode':
        url = 'https://discord.gg/uKwnCUat';
        break;
      default:
        break;
    }
  } else if (userLang == 'ja') {
    //일본어
    switch (link) {
      case 'twiter':
        url = 'https://twitter.com/WitchSprings';
        break;
      case 'youtube':
        url = 'https://www.youtube.com/@KIWIWALKS';
        break;
      case 'discode':
        url = 'https://discord.gg/uKwnCUat';
        break;
      default:
        break;
    }
  } else if (userLang == 'zt') {
    //중국어(번체)
    switch (link) {
      case 'facebook':
        url = 'https://www.facebook.com/witchsprings';
        break;
      case 'youtube':
        url = 'https://www.youtube.com/@KIWIWALKS';
        break;
      case 'discode':
        url = 'https://discord.gg/uKwnCUat';
        break;
      default:
        break;
    }
  } else if (userLang == 'zh') {
    //중국어(간체)
    switch (link) {
      case 'weibo':
        url = 'https://weibo.com/witchspring';
        break;
      case 'bili':
        url = 'https://space.bilibili.com/3493082502793916';
        break;
      default:
        break;
    }
  }

  //새창 링크 이동
  window.open(url);
}

//브라우저 크기 변경 시 이벤트
$(window).on('resize', function () {
  let windowWidth = $(window).width();
  if (windowWidth < 1008) {
    setMobileNav('isMobileNav');
  } else {
    resetMobileNav('isMobileNav');
  }
});
