// > RESOURCES
let moneyHistory = [];
const API_BASE = "http://data.fixer.io/api/";
const STORAGE_HISTORY_KEY = "pwanime.history";
const API_FIXER = `${API_BASE}`;
const API_KEY = "80f63375c53f573bcac618becf16a26d";
const FETCH_BASIC = `${API_FIXER}latest?access_key=${API_KEY}&symbols=USD,AUD,CAD,PLN,MXN`;

function addMoneyMarkup({ title, descritpion }) {
  return `
                <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-0 shadow">
                <div class="card-body text-center">
                    <h5 class="card-title mb-0">${title}</h5>
                    <div class="card-text text-black-50">${descritpion}</div>
                </div>
            </div>
            </div>
    `;
}

function updateHistory(arrayMoney) {
  moneyHistory = moneyHistory.concat(arrayMoney);
  addMoneyToMarkupSelector(arrayMoney, "#history");
  localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(moneyHistory));
}

function addMoneyToMarkupSelector(arrayMoney, selector) {
  let el = document.querySelector(selector);

  arrayMoney.forEach(money => {
    el.innerHTML = addMoneyMarkup(money) + el.innerHTML;
  });
}

async function convertMoney() {
  let query = parseFloat(document.querySelector("#search").value);
  if (isNaN(query)) {
    query = 1;
  }

  try {
    const response = await fetch(FETCH_BASIC);
    if (!response.ok) {
      return;
    }

    const { rates: results } = await response.json();

    let tab = [];
    Object.entries(results).forEach(element => {
      tab.push({ title: element[0], descritpion: element[1] * query });
    });

    // > Reset search
    document.querySelector("#current").innerHTML = "";
    addMoneyToMarkupSelector(tab, "#current");
    // updateHistory(tab);
  } catch (error) {
    console.log("ERROR", error);
  }
}
async function installServiceWorkerAsync() {
  let storage = JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY));
  if (storage) {
    moneyHistory = storage;
    addMoneyToMarkupSelector(moneyHistory, "#history");
  }
  if ("serviceWorker" in navigator) {
    try {
      const sw = await navigator.serviceWorker.register("/service-worker.js");
      console.log("service registered: ", sw);
    } catch (err) {
      console.log(`failed to install sw . ERROR : ${err}`);
    }
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  document.querySelector("#search").addEventListener("keyup", event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.querySelector("#button-search").click();
    }
  });

  installServiceWorkerAsync();
});
