"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const audioPlayer = document.getElementById("audio__player");
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let analyser = audioContext.createAnalyser();
  let dataArray;
  const gridElements = document.querySelectorAll(".grid__element");

  // Setup the analyser
  function setupAnalyser(audioNode) {
    audioNode.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }

  // Update the grid elements with the audio data
  function updateGrid() {
    requestAnimationFrame(updateGrid);

    analyser.getByteFrequencyData(dataArray);

    // Loop through each grid element and modify the style based on the audio data
    for (let i = 0; i < gridElements.length; i++) {
      const intensity = dataArray[i] / 255.0;
      gridElements[i].style.backgroundColor = `rgba(0,255,0,${intensity})`;
    }
  }

  document
    .getElementById("audio__upload")
    .addEventListener("change", function (e) {
      const files = e.target.files;
      if (files.length > 0) {
        const audioUrl = URL.createObjectURL(files[0]);
        audioPlayer.src = audioUrl;
        const audioNode = audioContext.createMediaElementSource(audioPlayer);
        setupAnalyser(audioNode);
        updateGrid();
      }
    });

  // Start playing the audio
  audioPlayer.onplay = function () {
    audioContext.resume();
  };
});
