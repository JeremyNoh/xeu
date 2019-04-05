// > RESOURCES
let moneyHistory = [];
const API_BASE = "http://data.fixer.io/api/";
const STORAGE_HISTORY_KEY = "pwanime.history";
const API_FIXER = `${API_BASE}`;
const API_KEY = "80f63375c53f573bcac618becf16a26d";
const FETCH_BASIC = `${API_FIXER}latest?access_key=${API_KEY}&symbols=USD,AUD,CAD,PLN,MXN`;
const namesMoneyConversion = [
  "AED",
  "AFN",
  "ALL",
  "AMD",
  "ANG",
  "AOA",
  "ARS",
  "AUD",
  "AWG",
  "AZN",
  "BAM",
  "BBD",
  "BDT",
  "BGN",
  "BHD",
  "BIF",
  "BMD",
  "BND",
  "BOB",
  "BRL",
  "BSD",
  "BTC",
  "BTN",
  "BWP",
  "BYN",
  "BYR",
  "BZD",
  "CAD",
  "CDF",
  "CHF",
  "CLF",
  "CLP",
  "CNY",
  "COP",
  "CRC",
  "CUC",
  "CUP",
  "CVE",
  "CZK",
  "DJF",
  "DKK",
  "DOP",
  "DZD",
  "EGP",
  "ERN",
  "ETB",
  "EUR",
  "FJD",
  "FKP",
  "GBP",
  "GEL",
  "GGP",
  "GHS",
  "GIP",
  "GMD",
  "GNF",
  "GTQ",
  "GYD",
  "HKD",
  "HNL",
  "HRK",
  "HTG",
  "HUF",
  "IDR",
  "ILS",
  "IMP",
  "INR",
  "IQD",
  "IRR",
  "ISK",
  "JEP",
  "JMD",
  "JOD",
  "JPY",
  "KES",
  "KGS",
  "KHR",
  "KMF",
  "KPW",
  "KRW",
  "KWD",
  "KYD",
  "KZT",
  "LAK",
  "LBP",
  "LKR",
  "LRD",
  "LSL",
  "LTL",
  "LVL",
  "LYD",
  "MAD",
  "MDL",
  "MGA",
  "MKD",
  "MMK",
  "MNT",
  "MOP",
  "MRO",
  "MUR",
  "MVR",
  "MWK",
  "MXN",
  "MYR",
  "MZN",
  "NAD",
  "NGN",
  "NIO",
  "NOK",
  "NPR",
  "NZD",
  "OMR",
  "PAB",
  "PEN",
  "PGK",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "QAR",
  "RON",
  "RSD",
  "RUB",
  "RWF",
  "SAR",
  "SBD",
  "SCR",
  "SDG",
  "SEK",
  "SGD",
  "SHP",
  "SLL",
  "SOS",
  "SRD",
  "STD",
  "SVC",
  "SYP",
  "SZL",
  "THB",
  "TJS",
  "TMT",
  "TND",
  "TOP",
  "TRY",
  "TTD",
  "TWD",
  "TZS",
  "UAH",
  "UGX",
  "USD",
  "UYU",
  "UZS",
  "VEF",
  "VND",
  "VUV",
  "WST",
  "XAF",
  "XAG",
  "XAU",
  "XCD",
  "XDR",
  "XOF",
  "XPF",
  "YER",
  "ZAR",
  "ZMK",
  "ZMW",
  "ZWL"
];

function addMoneyMarkup({ title, descritpion }) {
  let el = document.querySelector("#option");

  let { value: selected } = el.options[el.selectedIndex];

  console.log(selected === title);

  if (selected === title) {
    return `
      <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-2 bg-primary shadow">
              <div class="card-body text-center">
                  <h5 class="card-title mb-0 text-white">${title}</h5>
                  <div class="card-text text-white">${descritpion}</div>
              </div>
          </div>
      </div>
      `;
  }

  return `
                <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-2 shadow">
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

function addMoreNameMoney(name) {
  return `
    <option value="${name}">${name}</option>
      `;
}

function selectNameMoney() {
  let el = document.querySelector("#option");
  namesMoneyConversion.forEach(name => {
    el.innerHTML = addMoreNameMoney(name) + el.innerHTML;
  });
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
  let SEND_URL = `${FETCH_BASIC}`;

  let el = document.querySelector("#option");

  let { value: selected } = el.options[el.selectedIndex];

  if (selected !== "undefined") {
    SEND_URL = `${FETCH_BASIC},${selected}`;
  }

  console.log(SEND_URL);

  try {
    const response = await fetch(SEND_URL);
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
