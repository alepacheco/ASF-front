function evaluateText() {
  searchApi(function(response) {
    if (response.departure || geolocation) {
      $("#res-dep").text(response.departure || geolocation);
      $("#results-dep").show();
    } else {
      $("#results-dep").hide();
    }

    if (response.destination) {
      $("#res-des").text(response.destination);
      $("#results-des").show();
    } else {
      $("#results-des").hide();
    }

    if (response.departure_date) {
      $("#res-date").text(response.departure_date);
      $("#results-date").show();
    } else {
      $("#results-date").hide();
    }

    if (response.return_date) {
      $("#res-date-r").text(response.return_date);
      $("#results-date-r").show();
    } else {
      $("#results-date-r").hide();
    }

  })
}
let geolocation = '';

$(document).ready(function () {
  if (!window.hasOwnProperty('webkitSpeechRecognition')) {
    $('.mic-icon').hide();
  }

  $("#inputField").keyup(function (e) {
    if (e.keyCode == 13) {
      search();
    }
  });
  $.ajax({url: "/geo"}).done(function (x) {geolocation = x});

  $("#js-rotating").Morphext({
    animation: "fadeInDown",
    separator: ",",
    speed: 2000,
  });

  $('.placeholder').show()

  $("#inputField").focus(function() {
    $('.placeholder').hide();
  }).blur(function() {
    console.log($('#inputField').val())
    if ($('#inputField').val() == '') {
      $('.placeholder').show();
    }
  });
});

function makeUrl(params) {
  if (!params.departure) {
    params.departure = geolocation;
  }
  if (params.departure_date && params.return_date && params.destination) {
    return `https://www.edreams.com/#/results/type=R;dep=${params.departure_date};from=${params.departure};to=${params.destination};ret=${params.return_date}`
  } else if (params.departure_date && params.destination) {
    return `https://www.edreams.com/#/results/type=O;dep=${params.departure_date};from=${params.departure};to=${params.destination}`
  } else {
    let base = 'https://www.edreams.es/#/home/';
    base += params.return_date ? `type=R;ret=${params.return_date};` : 'type=O;';
    base += params.departure_date ? `dep=${params.departure_date};` : '';
    base += params.destination ? `to=${params.destination};` : '';
    base += params.departure ? `from=${params.departure};` : '';
    return base;
  }
}

function search() {
  searchApi(function(response) {
    const url = makeUrl(response);
    openInNewTab(url);
  });
}

function openInNewTab(url) {
  try {
    window.open(url, '_blank').focus();
  } catch (e) {
    window.location.href = url;
  }
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
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.start();
    showListeningOverlay();

    recognition.onresult = function(e) {
      const result = e.results[0];
      document.getElementById('inputField').value = result[0].transcript;
      if (result.isFinal) {
        recognition.stop();
        hideListeningOverlay();
        search();
      }

    };
    recognition.onerror = function(e) {
      recognition.stop();
      hideListeningOverlay();
    }
  }
}
