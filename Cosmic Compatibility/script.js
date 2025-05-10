// 🌌 Enhanced Face Scan with Loading Animation
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

function interpretEmotion(emotion) {
  switch (emotion) {
    case "happy": return "joyful";
    case "sad": return "heavy";
    case "angry": return "tense";
    case "surprised": return "electric";
    case "fearful": return "uncertain";
    case "disgusted": return "repelled";
    case "neutral": return "calm";
    default: return "undefined";
  }
}

async function startCamera() {
  const video = document.getElementById("video");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    console.log("✅ Camera started");
  } catch (err) {
    console.error("❌ Camera error", err);
    alert("⚠️ Please allow camera access and use HTTPS or Live Server");
  }
}

async function detectUntilFound(video, maxTries = 30, delay = 100) {
  for (let i = 0; i < maxTries; i++) {
    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.2 })
    ).withFaceLandmarks().withFaceExpressions().withFaceDescriptors();

    if (detections.length >= 1) return detections;
    await new Promise(res => setTimeout(res, delay));
  }
  return [];
}

async function startScan() {
  const name1 = document.getElementById("name").value;
  const name2 = document.getElementById("other").value;
  const birth1 = document.getElementById("birth1").value;
  const birth2 = document.getElementById("birth2").value;
  const btn = document.getElementById("scanButton");
  const loader = document.getElementById("loadingSpinner");

  if (!name1 || !name2 || !birth1 || !birth2) {
    alert("Please fill in all fields.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "🔍 Scanning...";
  loader.style.display = "block";

  const element1 = getElementByBirthMonth(birth1);
  const element2 = getElementByBirthMonth(birth2);
  const video = document.getElementById("video");

  const detections = await detectUntilFound(video);
  if (detections.length < 1) {
    alert("❌ No face detected. Try better lighting and positioning.");
    btn.disabled = false;
    btn.textContent = "Begin Scan";
    loader.style.display = "none";
    return;
  }

  const face1 = detections[0];
  const mood1 = getTopEmotion(face1.expressions);
  let mood2 = "neutral";
  let dist = null;

  if (detections.length >= 2) {
    const face2 = detections[1];
    mood2 = getTopEmotion(face2.expressions);
    dist = faceapi.euclideanDistance(face1.descriptor, face2.descriptor);
    match = dist < 0.4 ? "High" : dist < 0.6 ? "Medium" : "Low";
  } else {
    mood2 = "neutral";
    match = "Unknown";
  }

  const emotionSummary = `One feels ${interpretEmotion(mood1)}, the other ${interpretEmotion(mood2)}.`;
  const relationMeaning =
    match === "High"
      ? "These two faces resonate like twin stars."
      : match === "Medium"
      ? "They orbit close, but with friction."
      : "Distant energies, moving in separate constellations.";

  const visualKeyword = match === "High"
    ? "spiral galaxy"
    : match === "Medium"
    ? "supernova"
    : "binary stars";

  const prompt = `We are not analyzing similarity, but generating a symbolic relationship in the universe.\nTwo people, born under ${element1} and ${element2}, with moods ${mood1} and ${mood2}.\n${emotionSummary}\nConnection level: ${match}. It feels like: ${relationMeaning}.\nVisual inspiration: ${visualKeyword}.\nWrite a poetic fortune about their cosmic bond.`;

  let img = "", title = "", desc = "";
  try {
    const nasaRes = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=1");
    const nasaData = await nasaRes.json();
    img = nasaData[0].url;
    title = nasaData[0].title;
    desc = nasaData[0].explanation;
  } catch (e) {
    console.warn("NASA fetch failed:", e);
  }

  let aiReply = "No oracle message available.";
  try {
    aiReply = await puter.ai.chat(prompt);
  } catch (e) {
    console.warn("AI fetch failed:", e);
  }

  loader.style.display = "none";
  const resultURL = `result.html?img=${encodeURIComponent(img)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(desc)}&element1=${element1}&element2=${element2}&mood=${mood1}&match=${match}&oracle=${encodeURIComponent(aiReply)}`;
  window.location.href = resultURL;
}