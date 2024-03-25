var commonMsg = {
  레드: {
    ko: `레드`,
    en: `red`,
  },
};

var opt = {
  data: commonMsg, // 번안 저장 객체 (translate-key > 언어 > 내용)
  language: 'ko', // 번안을 원하는 언어
  // target: '.optional', // [선택 사항] 범위 지정을 원할 시 선택자 지정
  cleanDataset: true, // [선택 사항] 치환 후 dataset을 제거할 지 여부 (Default. true)
};

var go = function () {
  GAMEDEX.translate(opt)
    .then(function (result) {
      //console.log(result); // 언어 치환 성공 시 언어 치환 갯수 리턴
    })
    .catch(function (err) {
      //console.log(err); // 언어 치환 실패 시 에러 코드 리턴
    })
    .finally(function () {
      const HTML = document.querySelector('html');
      const BODY = document.querySelector('body');

      HTML.setAttribute('lang', opt.language);
      BODY.classList.add(opt.language);
      BODY.style.visibility = 'visible';
    });
};

window.addEventListener('load', function () {
  go();
});
