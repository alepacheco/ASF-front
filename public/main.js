'use stric';

function search() {
  $.ajax({
    url: "/parse",
    type: "get",
    data: {
      q: $('#inputField').val()
    },
    success: function(response) {
      //response.destination
      $("#results").text(`Searching flights from: ${response.departure} to: ${response.destination} on: ${response.departureDate} at: ${response.departureTime}` );

      if (response.departure && response.destination && response.departureDate) {
        const edreamsUrl = `https://www.edreams.com/#/results/type=O;dep=${response.departureDate};from=${response.departure};to=${response.destination}`;
        setTimeout(() => window.location.replace(edreamsUrl), 3000);   
      }

    },
    error: function(xhr) {
      //Do Something to handle error
    }
  });
}
