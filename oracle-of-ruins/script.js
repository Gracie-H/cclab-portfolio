let mood = "neutral";
let match = "Unknown";

window.onload = () => {
  loadModelsAndStartCamera();
  document.getElementById("scanButton").addEventListener("click", startScan);
};

async function loadModelsAndStartCamera() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
  ]);
  startCamera();
}

function getElementByBirthMonth(dateStr) {
  const month = new Date(dateStr).getMonth() + 1;
  if ([3, 4].includes(month)) return "Wood";
  if ([5, 6].includes(month)) return "Fire";
  if ([7, 8].includes(month)) return "Earth";
  if ([9, 10].includes(month)) return "Metal";
  return "Water";
}

function getTopEmotion(expressions) {
  let top = "neutral", max = 0;
  for (let key in expressions) {
    if (expressions[key] > max) {
      max = expressions[key];
      top = key;
    }
  }
  return top;
}

async function startCamera() {
  const video = document.getElementById("video");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    console.log("✅ 摄像头已开启");
  } catch (err) {
    console.error("❌ 摄像头失败", err);
    alert("⚠️ 无法访问摄像头，请检查权限或使用 Live Server");
  }
}

async function startScan() {
  const name1 = document.getElementById("name").value;
  const name2 = document.getElementById("other").value;
  const birth1 = document.getElementById("birth1").value;
  const birth2 = document.getElementById("birth2").value;

  if (!name1 || !name2 || !birth1 || !birth2) {
    alert("Please fill in all fields.");
    return;
  }

  const element1 = getElementByBirthMonth(birth1);
  const element2 = getElementByBirthMonth(birth2);
  const video = document.getElementById("video");

  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions()
    .withFaceDescriptors();

  if (detections.length >= 1) {
    mood = getTopEmotion(detections[0].expressions);
    if (detections.length >= 2) {
      const dist = faceapi.euclideanDistance(detections[0].descriptor, detections[1].descriptor);
      match = dist > 0.6 ? "Low" : dist > 0.4 ? "Medium" : "High";
    }
  } else {
    alert("No face detected.");
    return;
  }

  const nasaRes = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=1");
  const nasaData = await nasaRes.json();
  const img = nasaData[0].url;
  const title = nasaData[0].title;
  const desc = nasaData[0].explanation;

  const prompt = `Write a poetic message about two people with ${element1} and ${element2} energy, feeling ${mood}, match ${match}`;
  const aiReply = await puter.ai.chat(prompt);

  const resultURL = `result.html?img=${encodeURIComponent(img)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(desc)}&element1=${element1}&element2=${element2}&mood=${mood}&match=${match}&oracle=${encodeURIComponent(aiReply)}`;
  window.location.href = resultURL;
}
