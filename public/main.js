function evaluateText() {
  searchApi(function(response) {
    $("#results").text(JSON.stringify(response));
  })
}
let geolocation = '';

$(document).ready(async function () {
  geolocation = await $.ajax({url: "/geo"});
  $("#inputField").keyup(function (e) {
    if (e.keyCode == 13) {
      search();
    }
  });
});

async function makeUrl(params) {
  if (!params.departure) {
    params.departure = geolocation;
  }
  if (params.departure_date && params.return_date && params.destination) {
    return `https://www.edreams.com/#/results/type=R;dep=${params.departure_date};from=${params.departure};to=${params.destination};ret=${params.return_date}`
  } else if (params.departure_date && params.destination) {
    return `https://www.edreams.com/#/results/type=O;dep=${params.departure_date};from=${params.departure};to=${params.destination}`
  }
}

function search() {
  searchApi(async function(response) {
    const url = await makeUrl(response);
    openInNewTab(url);
  })
}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}


function searchApi(callback) {
  $.ajax({
    url: "/parse",
    type: "get",
    data: {
      q: $('#inputField').val()
    },
    success: function(response) {
      callback(response);
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
