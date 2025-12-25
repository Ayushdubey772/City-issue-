// ===============================
// ELEMENT REFERENCES
// ===============================
const submitBtn = document.getElementById("actionBtn");
const output = document.getElementById("output");
const locateBtn = document.querySelector(".locate");
const locationInput = document.getElementById("location");
const imageInput = document.getElementById("imgUpload");
const descriptions = document.querySelectorAll(".description");

// ===============================
// GOOGLE MAP VARIABLES
// ===============================
let map;
let marker;
let autocomplete;
let currentCenter = { lat: 20.5937, lng: 78.9629 }; // India center

// ===============================
// INIT GOOGLE MAP
// ===============================
function initMap() {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  map = new google.maps.Map(mapDiv, {
    center: currentCenter,
    zoom: 14,
    gestureHandling: "greedy"
  });

  marker = new google.maps.Marker({
    position: currentCenter,
    map: map
  });
}

// ===============================
// UPDATE MAP
// ===============================
function updateMap(lat, lng) {
  currentCenter = { lat, lng };
  if (map && marker) {
    map.setCenter(currentCenter);
    marker.setPosition(currentCenter);
  }
}

// ===============================
// AUTOCOMPLETE INIT
// ===============================
function initAutocomplete() {
  if (!locationInput) return;

  autocomplete = new google.maps.places.Autocomplete(locationInput, {
    types: ["geocode"],
    componentRestrictions: { country: "in" }
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    updateMap(
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );
  });
}

// ===============================
// PAGE LOAD
// ===============================
window.addEventListener("load", () => {
  if (window.google && google.maps) {
    initMap();
    initAutocomplete();
  }
});

// ===============================
// RESPONSIVE MAP FIX
// ===============================
window.addEventListener("resize", () => {
  if (map) {
    google.maps.event.trigger(map, "resize");
    map.setCenter(currentCenter);
  }
});

// ===============================
// LIVE LOCATION BUTTON
// ===============================
locateBtn?.addEventListener("click", () => {
  output.style.color = "#2196F3";
  output.innerText = "Detecting live location...";

  if (!navigator.geolocation) {
    output.style.color = "red";
    output.innerText = "Geolocation not supported ❌";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      updateMap(lat, lng);

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          locationInput.value = results[0].formatted_address;
        } else {
          locationInput.value = `Lat: ${lat}, Lng: ${lng}`;
        }
        output.innerText = "Live location detected ✅";
      });
    },
    () => {
      output.style.color = "red";
      output.innerText = "Location permission denied ❌";
    }
  );
});

// ===============================
// SUBMIT REPORT
// ===============================
submitBtn?.addEventListener("click", () => {

  if (!descriptions[0]?.value.trim()) {
    output.style.color = "red";
    output.innerText = "Please describe the issue ❗";
    return;
  }

  if (!imageInput?.files.length) {
    output.style.color = "red";
    output.innerText = "Please upload an image ❗";
    return;
  }

  if (!locationInput?.value.trim()) {
    output.style.color = "red";
    output.innerText = "Please provide location ❗";
    return;
  }

  const reportData = {
    issue: descriptions[0].value,
    location: locationInput.value,
    latitude: currentCenter.lat,
    longitude: currentCenter.lng,
    image: imageInput.files[0].name,
    timestamp: new Date().toISOString()
  };

  console.log("REPORT DATA:", reportData);

  output.style.color = "#2196F3";
  output.innerText = "Report submitted successfully 🎉";

  setTimeout(() => {
    descriptions.forEach(d => d.value = "");
    locationInput.value = "";
    imageInput.value = "";
    output.innerText = "";
  }, 2000);
});
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB5EckLrQZZKV8qbZ3ynqkpr-3peRzT9vM&libraries=places"></script>
