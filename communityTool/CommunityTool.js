let audio = document.getElementById('sound');
let canvas = null;
let ctx = null;
let colorSet = '#c5e1a5';
let radius = 80;
let growth = 1;

let answer1 = '';
let answer2 = '';
let answer3 = '';


window.addEventListener("DOMContentLoaded", () => {
  const saved1 = localStorage.getItem('answer1');
  const saved2 = localStorage.getItem('answer2');
  const saved3 = localStorage.getItem('answer3');
  const savedSug = localStorage.getItem('suggestion');


  const reflectionBox = document.getElementById('reflection');
  const savedReflection = localStorage.getItem('reflection');
  if (savedReflection) reflectionBox.value = savedReflection;

  reflectionBox.addEventListener('input', () => {
    localStorage.setItem('reflection', reflectionBox.value);
  });


  if (saved1 && saved2 && saved3 && savedSug) {
    answer1 = saved1;
    answer2 = saved2;
    answer3 = saved3;
    document.getElementById('page1').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('suggestion').innerText = savedSug;
    canvas = document.getElementById('visual');
    ctx = canvas.getContext('2d');
    drawPulse();
    canvas.addEventListener('click', triggerRipple);
    audio.src = getAudioSource(saved1, saved2, saved3);
  }
});

function nextPage(color) {
  answer1 = color;
  transitionTo('page1', 'page2');
}

function nextPage2(time) {
  answer2 = time;
  transitionTo('page2', 'page3');
}

function showResultPage(soundAnswer) {
  answer3 = soundAnswer;
  transitionTo('page3', 'result');
  showResult();
}

function transitionTo(fromId, toId) {
  const from = document.getElementById(fromId);
  const to = document.getElementById(toId);
  from.style.opacity = 0;
  setTimeout(() => {
    from.style.display = 'none';
    to.style.display = 'block';
    to.style.opacity = 0;
    setTimeout(() => {
      to.style.opacity = 1;
    }, 50);
  }, 500);
}

function showResult() {
  let suggestion = "";

  if (answer1 === 'grey' && answer2 === 'rushed' && answer3 === 'alarm') {
    suggestion = "You’ve been running on empty. Click the circle to reset your breath.";
    colorSet = '#b0bec5';
    audio.src = 'https://cdn.pixabay.com/audio/2023/03/16/audio_e15ef48b68.mp3';
  } else if (answer1 === 'blue' && answer2 === 'paused' && answer3 === 'rain') {
    suggestion = "You are in stillness now. The drop will ripple when you touch it.";
    colorSet = '#bbdefb';
    audio.src = 'https://cdn.pixabay.com/audio/2023/03/29/audio_c2aaf3fd77.mp3';
  } else if (answer1 === 'red' && answer2 === 'loop' && answer3 === 'buzzing') {
    suggestion = "Too much static? Try tapping the pulse below.";
    colorSet = '#ffcdd2';
    audio.src = 'https://cdn.pixabay.com/audio/2023/04/13/audio_6f4d74e9c9.mp3';
  } else if (answer1 === 'green' && answer2 === 'flowing' && answer3 === 'waves') {
    suggestion = "You are flowing — click to ripple with the wave.";
    colorSet = '#c8e6c9';
    audio.src = 'https://cdn.pixabay.com/audio/2023/04/02/audio_206abf3437.mp3';
  } else {
    suggestion = "Whatever your state, give yourself permission to pause. Tap the calm.";
    colorSet = '#dcedc8';
    audio.src = 'https://cdn.pixabay.com/audio/2023/03/24/audio_89a6e47484.mp3';
  }


  localStorage.setItem('answer1', answer1);
  localStorage.setItem('answer2', answer2);
  localStorage.setItem('answer3', answer3);
  localStorage.setItem('suggestion', suggestion);

  document.getElementById('suggestion').innerText = suggestion;
  canvas = document.getElementById('visual');
  ctx = canvas.getContext('2d');
  drawPulse();
  canvas.addEventListener('click', triggerRipple);
}

function getAudioSource(a1, a2, a3) {
  if (a1 === 'grey' && a2 === 'rushed' && a3 === 'alarm') {
    return 'https://cdn.pixabay.com/audio/2023/03/16/audio_e15ef48b68.mp3';
  } else if (a1 === 'blue' && a2 === 'paused' && a3 === 'rain') {
    return 'https://cdn.pixabay.com/audio/2023/03/29/audio_c2aaf3fd77.mp3';
  } else if (a1 === 'red' && a2 === 'loop' && a3 === 'buzzing') {
    return 'https://cdn.pixabay.com/audio/2023/04/13/audio_6f4d74e9c9.mp3';
  } else if (a1 === 'green' && a2 === 'flowing' && a3 === 'waves') {
    return 'https://cdn.pixabay.com/audio/2023/04/02/audio_206abf3437.mp3';
  } else {
    return 'https://cdn.pixabay.com/audio/2023/03/24/audio_89a6e47484.mp3';
  }
}

function drawPulse() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
  ctx.fillStyle = colorSet;
  ctx.fill();
  radius += growth;
  if (radius > 90 || radius < 70) growth *= -1;
  requestAnimationFrame(drawPulse);
}

function triggerRipple() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  let r = 0;
  const ripple = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
    ctx.strokeStyle = '#64b5f6';
    ctx.lineWidth = 3;
    ctx.stroke();
    r += 5;
    if (r > 100) clearInterval(ripple);
  }, 30);
}
