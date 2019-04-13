// Prog Enhancement
if (navigator.serviceWorker) {
  // Register SW
  navigator.serviceWorker.register("sw.js").catch(console.error);

  // Cache Clean City
  function cleanDynamicCache(content) {
    // Confirm SW Registration
    navigator.serviceWorker.getRegistration().then(function(reg) {
      // Only post to active SW
      if (reg.active) {
        reg.active.postMessage({
          action: "cleanDynamicContent",
          content: content
        });
      }
    });
  }
}

// Giphy API object
var giphy = {
  url: "https://api.giphy.com/v1/gifs/trending",
  query: {
    api_key: "54452c59b31e4d14aca213ec76014baa",
    limit: 12
  }
};

// Update trending giphys
function update() {
  // Toggle refresh state
  $("#update .icon").toggleClass("d-none");

  // Call Giphy API
  $.get(giphy.url, giphy.query)

    // Success
    .done(function(res) {
      // Empty Element
      $("#giphys").empty();

      // Populate array of latest dynamic content
      var latestDynContent = [];

      // Loop Giphys
      $.each(res.data, function(i, giphy) {
        // Add to latest
        latestDynContent.push(giphy.images.downsized_large.url);

        // Add Giphy HTML
        $("#giphys").prepend(
          '<div class="col-sm-6 col-md-4 col-lg-3 p-1">' +
            '<img class="w-100 img-fluid" src="' +
            giphy.images.downsized_large.url +
            '" alt="' +
            giphy.title +
            '">' +
            "</div>"
        );
      });
      // Inform SW of latest dynamic content (if avails)
      if (navigator.serviceWorker) {
        cleanDynamicCache(latestDynContent);
      }
    })

    // Failure
    .fail(function() {
      $(".alert").slideDown();
      setTimeout(function() {
        $(".alert").slideUp();
      }, 2000);
    })

    // Complete
    .always(function() {
      // Re-Toggle refresh state
      $("#update .icon").toggleClass("d-none");
    });

  // Prevent submission if originates from click
  return false;
}

// Manual refresh
$("#update a").click(update);

// Update trending giphys on load
//update();

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

function openChat() {
  console.log("Input clicked");
  document.getElementById("info").className = "hidden";
}

function viewSwap(view) {
  if (view === "settings") {
    $("#settings").toggleClass("hidden");
  }
}

var pageCounter = 0;

$(".sugg").on("click", function() {
  // Remove other animation classes
  $("#main").removeClass();

  // Start Animating!
  $("#main").addClass("animate-out");
  setTimeout(function() {
    $("#main").removeClass("animate-out");
    $("#main").addClass("animate-in");
  }, 1000);
  setTimeout(function() {
    $("#main").removeClass("animate-in");
  });
  countMe(pageCounter);
});

$("#back").on("click", function() {
  // Decriment Counter
  pageCounter--;

  // Remove other animation classes
  $("#main").removeClass();

  // Reverse Animating!
  $("#main").addClass("re-animate-out");
  setTimeout(function() {
    $("#main").removeClass("re-animate-out");
    $("#main").addClass("re-animate-in");
  }, 750);
  setTimeout(function() {
    $("#main").removeClass("re-animate-in");
  });
  countMe(pageCounter);
});

function countMe(counter) {
  console.log(counter);
  // Hide/Display based on Counter
  if (counter >= 3) {
    $(".proger").hide();
    $(".ml-auto").show();
    if (counter >= 4) {
      $("#back").show();
    } else {
      $("#back").hide();
    }
  } else {
    $(".proger").show();
    $(".ml-auto").hide();
  }
  // Hide/Display based on Content
  // if ($(".sugg").text().length > 0) {

  // }
  $(".sugg").each(function() {
    if (
      $(this)
        .find("span")
        .text().length <= 0
    ) {
      $(this).hide();
    } else {
      $(this).show();
    }
  });
}

var step = "first";
function dataGo(route, e) {
  if (route === "external") {
    document.location.reload();
  } else if (route === "next") {
    // Incremint Counter
    pageCounter++;
    // First Step
    if (step === "first") {
      $(".welcome").replaceWith($(".stepOne"));
      $(".prog-1").css("opacity", "0.2");
      $(".prog-2").css("opacity", "1");
      $(".sugg-1 span").replaceWith("<span>Dat klopt!</span>");
      $(".sugg-2 span").replaceWith(
        "<span>Wijzigen door te bellen naar de polikliniek</span>"
      );
      $(".sugg-3 span").replaceWith("");
      countMe();
      step = "second";
      // Second Step
    } else if (step === "second") {
      startConfetti();
      $(".stepOne").replaceWith(
        "<h3 class='stepTwo'>Uitstekend, tijd om te vieren!<br /><br /> Je kunt nu doorgaan met je eigen persoonlijke ervaring!</h3>"
      );
      $(".prog-2").css("opacity", "0.2");
      $(".prog-3").css("opacity", "1");
      $(".sugg-1 span").replaceWith("<span>Dank u wel!</span>");
      $(".sugg-2 span").replaceWith("");
      setTimeout(function() {
        stopConfetti();
      }, 2000);
      step = "third";
      // Third Step
    } else if (step === "third") {
      $(".stepTwo").replaceWith(
        "<h3 class='stepThree'>We kunnen u helpen met het plannen van een (bel)afspraak, voorbereiden van uw reis en andere tips om uw bezoek zo aangenaam mogelijk te maken</h3>"
      );
      $(".sugg-1").html(
        "<a href='https://digid.nl/inloggen'><span>Hoe kan ik mij voorbereiden?</span></a>"
      );
      $(".sugg-2").html(
        "<a href='https://www.umcutrecht.nl/nl/Ziekenhuis/Afdelingen/allergologie'><span>Meer informatie over de poli</span></a>"
      );
      $(".sugg-3").html(
        "<a href='https://www.umcutrecht.nl/nl/Ziekenhuis/In-het-ziekenhuis/Faciliteiten/Winkels-en-restaurants'><span>Meer UMC Utrecht en wat er te doen is</span></a>"
      );
      $(".sugg-4").html(
        "<a href='https://www.umcutrecht.nl/nl/Over-Ons/Contact-route/Parkeren-UMC-Utrecht'><span>Help mijn route plannen</span></a>"
      );
      $(".sugg-5").html("<span>pas afspraak aan</span>");
      $(".sugg-6").html("<span>Wilt u deze informatie delen?</span>");
    }
  }
}
console.log($(window).height());
if ($(window).height() < 590) {
  $(".sugg").css("min-height", "60px");
  $("#suggestions").css("font-size", "12px");
}

countMe();
