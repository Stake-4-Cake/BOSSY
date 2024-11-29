(function () {
  // Function to get URL parameters
  var script = document.currentScript;
  var params = new URLSearchParams(script.src.split("?")[1]);
  var tagID = params.get("tagID");

  function getQueryParams() {
    var params = {};
    var queryString = window.location.search.substring(1);
    var regex = /([^&=]+)=([^&]*)/g;
    var m;
    while ((m = regex.exec(queryString))) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
  }

  // Function to send data to the server
  function sendData(data, endpoint) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://us-central1-web3-marketing-hub.cloudfunctions.net/pixel_api/" + endpoint, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
  }

  var utmParams = getQueryParams();

  // Fetch IP address if not already stored in sessionStorage
  function fetchIPAddress(callback) {
    if (!sessionStorage.getItem("ip")) {
      fetch("https://api.ipify.org?format=json")
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          sessionStorage.setItem("ip", data.ip);
          callback(data.ip);
        })
        .catch(function (error) {
          console.error("Error fetching IP address:", error);
        });
    } else {
      var ip = sessionStorage.getItem("ip");
      callback(ip);
    }
  }

  // Function to track page views
  function trackPageView(ip) {
    var referrer = document.referrer;
    var current_path = window.location.pathname;
    if (referrer.includes("gtm-msr.appspot.com") || current_path === "/render2") {
      return;
    }

    // Store session data if not already stored
    if (!sessionStorage.getItem("bca_ID")) {
      sessionStorage.setItem("utm_source", utmParams.utm_source || "");
      sessionStorage.setItem("utm_medium", utmParams.utm_medium || "");
      sessionStorage.setItem("utm_campaign", utmParams.utm_campaign || "");
      if (utmParams.bca_ID) sessionStorage.setItem("bca_ID", utmParams.bca_ID);
    }

    var sessionData = {
      tagID: tagID,
      bca_ID: sessionStorage.getItem("bca_ID"),
      utm_source: sessionStorage.getItem("utm_source"),
      utm_medium: sessionStorage.getItem("utm_medium"),
      utm_campaign: sessionStorage.getItem("utm_campaign"),
      referrer: referrer,
      ip: ip,
      current_path: current_path,
    };

    // Send page view data
    sendData({ ...sessionData, event_type: "page_view" }, "trackGeneral");
  }

  // Function to track link clicks
  function trackLinkClick(ip, event) {
    var referrer = document.referrer;
    var current_path = window.location.pathname;
    var destination_url = event.target.href;

    // Store session data if not already stored
    if (!sessionStorage.getItem("bca_ID")) {
      sessionStorage.setItem("utm_source", utmParams.utm_source || "");
      sessionStorage.setItem("utm_medium", utmParams.utm_medium || "");
      sessionStorage.setItem("utm_campaign", utmParams.utm_campaign || "");
      if (utmParams.bca_ID) sessionStorage.setItem("bca_ID", utmParams.bca_ID);
    }

    var clickData = {
      tagID: tagID,
      bca_ID: sessionStorage.getItem("bca_ID"),
      utm_source: sessionStorage.getItem("utm_source"),
      utm_medium: sessionStorage.getItem("utm_medium"),
      utm_campaign: sessionStorage.getItem("utm_campaign"),
      referrer: referrer,
      ip: ip,
      current_path: current_path,
      destination_url: destination_url,
      event_type: "link_click",
    };

    // Send link click data
    sendData(clickData, "trackGeneral");
  }

  // Track page view on load
  window.addEventListener("load", function () {
    fetchIPAddress(trackPageView);
  });

  // Track link clicks
  document.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      fetchIPAddress(function (ip) {
        trackLinkClick(ip, event);
      });
    }
  });
})();
