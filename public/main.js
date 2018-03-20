'use stric';

function search() {
  $.ajax({
    url: "/parse",
    type: "get",
    data: {
      q: $('#inputField').val()
    },
    success: function(response) {
      $("#results").text(`Searching flights from: ${response.departure} to: ${response.destination} on: ${response.departureDate} at: ${response.departureTime}` );
      if (response.departure && response.destination && response.departureDate) {
        const edreamsUrl = `https://www.edreams.com/#/results/type=O;dep=${response.departureDate};from=${response.departure};to=${response.destination}`;
        window.location.replace(edreamsUrl);
      }
    },
    error: function(xhr) {
      //Do Something to handle error
    }
  });
}

function startDictation() {
  const showListeningOverlay = function() {
    document.getElementById("overlay").style.display = "block";
  }

  const hideListeningOverlay = function() {
    document.getElementById("overlay").style.display = "none";
  }
  if (window.hasOwnProperty('webkitSpeechRecognition')) {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.start();
    showListeningOverlay();

    recognition.onresult = function(e) {
      document.getElementById('inputField').value = e.results[0][0].transcript;
      recognition.stop();
      hideListeningOverlay();
      search();
    };
    recognition.onerror = function(e) {
      recognition.stop();
      hideListeningOverlay();
    }
  }
}
