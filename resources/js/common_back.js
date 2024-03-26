/* var canvas = document.getElementById('bg-mix'),
  gl =
    ((canvas.width = window.innerWidth),
    (canvas.height = window.innerHeight),
    canvas.getContext('webgl')),
  time = (gl || console.error('Unable to initialize WebGL.'), 0),
  vertexSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,
  fragmentSource = `
precision highp float;

#define AA

uniform float width;
uniform float height;
vec2 resolution = vec2(width, height);

uniform float time;

void main(){

	float strength = 0.1;
	float t = time/16.0;

	vec3 col = vec3(0);
	vec2 fC = gl_FragCoord.xy;

	#ifdef AA
	for(int i = -1; i <= 1; i++) {
		for(int j = -1; j <= 1; j++) {

			fC = gl_FragCoord.xy+vec2(i,j)/3.0;//3

			#endif

			//Normalized pixel coordinates (from 0 to 1)
			vec2 pos = fC/resolution.xy;

			pos.y /= resolution.x/resolution.y;
			pos = 4.0*(vec2(0.5) - pos);//4,0.5

			for(float k = 1.0; k < 7.0; k+=1.0){ 
				pos.x += strength * sin(2.0*t+k*1.5 * pos.y)+t*0.5;
				pos.y += strength * cos(2.0*t+k*1.5 * pos.x);
			}

			//Time varying pixel colour
			col += 0.6 + 0.2*cos(time+pos.xyx+vec3(1,0,8)); //0.5,0.5,0,2,4

			#ifdef AA
		}
	}

	col /= 9.0;//9
	#endif

  //Gamma
  col = pow(col, vec3(0.4545));//0.4545

	//Fragment colour
	gl_FragColor = vec4(col,1.0);
}
`;
function onWindowResize() {
  (canvas.width = window.innerWidth),
    (canvas.height = window.innerHeight),
    gl.viewport(0, 0, canvas.width, canvas.height),
    gl.uniform1f(widthHandle, window.innerWidth),
    gl.uniform1f(heightHandle, window.innerHeight);
}
function compileShader(e, t) {
  t = gl.createShader(t);
  if (
    (gl.shaderSource(t, e),
    gl.compileShader(t),
    !gl.getShaderParameter(t, gl.COMPILE_STATUS))
  )
    throw 'Shader compile failed with: ' + gl.getShaderInfoLog(t);
  return t;
}
function getAttribLocation(e, t) {
  e = gl.getAttribLocation(e, t);
  if (-1 === e) throw 'Cannot find attribute ' + t + '.';
  return e;
}
function getUniformLocation(e, t) {
  e = gl.getUniformLocation(e, t);
  if (-1 === e) throw 'Cannot find uniform ' + t + '.';
  return e;
}
window.addEventListener('resize', onWindowResize, !1);
var thisFrame,
  vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER),
  fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER),
  program = gl.createProgram(),
  vertexData =
    (gl.attachShader(program, vertexShader),
    gl.attachShader(program, fragmentShader),
    gl.linkProgram(program),
    gl.useProgram(program),
    new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1])),
  vertexDataBuffer = gl.createBuffer(),
  positionHandle =
    (gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer),
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW),
    getAttribLocation(program, 'position')),
  timeHandle =
    (gl.enableVertexAttribArray(positionHandle),
    gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, !1, 8, 0),
    getUniformLocation(program, 'time')),
  widthHandle = getUniformLocation(program, 'width'),
  heightHandle = getUniformLocation(program, 'height'),
  lastFrame =
    (gl.uniform1f(widthHandle, window.innerWidth),
    gl.uniform1f(heightHandle, window.innerHeight),
    Date.now());
function draw() {
  (thisFrame = Date.now()),
    (time += (thisFrame - lastFrame) / 770),
    (lastFrame = thisFrame),
    gl.uniform1f(timeHandle, time),
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4),
    requestAnimationFrame(draw);
}
draw();
 */
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
        <li class="swiper-slide"">
          <div data-filmo="${filmo.filmoURL}">
            <figure class="filmo-thum">
              <img src="${filmo.filmoThum}" alt="" />
            </figure>
            <dl>
              <dt>${filmo.filmoName}</dt>
              <dd>${filmo.filmoCategory}</dd>
            </dl>
          </div>
        </li>
      `;
    });
    var filmoSwiper = new Swiper('.filmoSwiper', {
      slidesPerView: 'auto',
      spaceBetween: 100,
      direction: 'vertical',
      speed: 500,
      centeredSlides: true,
      navigation: {
        nextEl: '.filmo-swiper__next',
        prevEl: '.filmo-swiper__prev',
      },
    });
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
    spaceBetween: 25,
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
