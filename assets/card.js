function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

function setClock() {
  const now = new Date();
  document.getElementById("time").innerHTML = "Czas: " + now.toLocaleTimeString("pl-PL");
  document.getElementById("date").innerHTML = now.toLocaleDateString("pl-PL");
  setTimeout(setClock, 1000);
}
setClock();

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function openPage(page) {
  clearClassList();
  document.querySelector(".confirm").classList.add("page_open");
  document.querySelector(".confirm").classList.add("page_" + page + "_open");
}

function closePage() {
  clearClassList();
}

function clearClassList() {
  const classList = document.querySelector(".confirm").classList;
  classList.remove("page_open", "page_1_open", "page_2_open", "page_3_open");
}

function sendTo(url) {
  location.href = url + ".html";
}

function deleteDocument() {
  alert("Usuń funkcję IndexedDB jeśli nie używasz już tej bazy.");
}

// rozwijanie sekcji "Twoje dodatkowe dane"
document.querySelectorAll(".info_holder").forEach(el => {
  el.addEventListener("click", () => {
    el.classList.toggle("unfolded");
  });
});

// obsługa przycisku „Aktualizuj” po załadowaniu strony
function attachUpdateButton(options) {
  const updateButton = document.querySelector(".update");
  if (updateButton) {
    updateButton.addEventListener("click", () => {
      const newUpdate = new Date().toLocaleDateString("pl-PL", options);
      document.querySelector(".bottom_update_value").innerHTML = newUpdate;
      scroll(0, 0);
    });
  }
}

// Replace IndexedDB retrieving with data.js usage
window.addEventListener("DOMContentLoaded", () => {
  if (typeof cardData === "undefined") {
    alert("Brak danych w pliku data.js!");
    return;
  }

  document.querySelector(".id_own_image").style.backgroundImage = `url(${cardData.imageUrl})`;

  // Assuming cardData formats birthDate in "YYYY-MM-DD"
  const birthDateParts = cardData.birthDate.split("-");
  const birthDateObj = new Date(birthDateParts[0], birthDateParts[1] - 1, birthDateParts[2]);
  const options = { year: 'numeric', month: 'numeric', day: '2-digit' };
  const birthdayFormatted = birthDateObj.toLocaleDateString("pl-PL", options);

  setText("name", cardData.firstName.toUpperCase());
  setText("surname", cardData.lastName.toUpperCase());
  setText("nationality", cardData.nationality.toUpperCase());
  setText("birthday", birthdayFormatted);
  setText("familyName", cardData.familyName || "");
  setText("sex", cardData.gender);
  setText("fathersFamilyName", cardData.fathersFamilyName || "");
  setText("mothersFamilyName", cardData.mothersFamilyName || "");
  setText("birthPlace", cardData.placeOfBirth);
  setText("countryOfBirth", cardData.countryOfBirth);

  const adress = `ul. ${cardData.adress1 || ""}<br>${cardData.adress2 || ""} ${cardData.city || ""}`;
  setText("adress", adress);
  setText("mothersName", cardData.mothersName || "");
  setText("fathersName", cardData.fathersName || "");
  setText("givenDate", cardData.givenDate || "");
  setText("expiryDate", cardData.expiryDate || "");
  setText("seriesAndNumber", cardData.seriesAndNumber || "");

  // Set a default or provided registrationDate as home date
  document.querySelector(".home_date").innerHTML = cardData.registrationDate || new Date().toLocaleDateString("pl-PL", options);

  // Generate PESEL (same logic as before with adjustments if needed)
  let peselMonth = parseInt(birthDateParts[1]);
  if (birthDateParts[0] >= 2000) peselMonth += 20;
  const later = cardData.gender.toLowerCase() === "mężczyzna" ? "0295" : "0382";
  const pesel =
    birthDateParts[0].substring(2) +
    (peselMonth < 10 ? "0" + peselMonth : peselMonth) +
    (birthDateParts[2] < 10 ? "0" + birthDateParts[2] : birthDateParts[2]) +
    later + "7";

  setText("pesel", pesel);

  // Set last update date to today or default example date
  const today = new Date().toLocaleDateString("pl-PL", options);
  document.querySelector(".bottom_update_value").innerHTML = today;

  attachUpdateButton(options);
});

// przypięcie funkcji do window dla onclick w HTML
window.openPage = openPage;
window.closePage = closePage;
window.sendTo = sendTo;
window.deleteDocument = deleteDocument;
