document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("generateBtn");
    const resultDiv = document.getElementById("result");
  
    button.addEventListener("click", () => {
      const emotion = document.getElementById("emotion").value;
      const location = document.getElementById("location").value;
      const activity = document.getElementById("activity").value;
      const key = `${emotion}-${location}-${activity}`;
  
      const vacations = {
        "Calm-Beach-Sleep": {
          place: "A hammock in Tulum",
          reason: "Nothing heals like salt, sun, and doing nothing.",
          warning: "May forget what day it is."
        },
        "Angry-Forest-Escape": {
          place: "A hidden cabin in the Black Forest",
          reason: "Perfect for rage-screaming into trees.",
          warning: "Trees will not comfort you."
        },
        "Romantic-Mountain-Dance": {
          place: "The edge of a cliff in Santorini",
          reason: "Dancing badly in beautiful places is still poetic.",
          warning: "Avoid dramatic gestures near edges."
        }
        // Add more combinations here
      };
  
      const match = vacations[key];
  
      resultDiv.innerText = match
        ? `📍 Destination: ${match.place}\n✨ Why: ${match.reason}\n⚠️ Caution: ${match.warning}`
        : `📍 Destination: Your balcony\n✨ Why: Because it’s available.\n⚠️ Caution: You’re still technically home.`;
    });
  });
  