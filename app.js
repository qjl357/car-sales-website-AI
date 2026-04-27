var pageReady = false;

function parseRoute() {
  var h = window.location.hash;
  if (h == "" || h == "#" || h == "#/" || h == "#/") {
    return { name: "discovery", q: "" };
  }
  if (h.indexOf("search") != -1) {
    var q = "";
    var pos = h.indexOf("q=");
    if (pos != -1) {
      q = decodeURIComponent(h.substring(pos + 2).split("&")[0]);
    }
    return { name: "results", q: q };
  }
  return { name: "discovery", q: "" };
}

function setTitle(name) {
  if (name == "results") {
    document.title = "Search Results · Used Cars";
  } else {
    document.title = "Used Car Search · Discover";
  }
}

function goSearch(q) {
  var v = (q != null ? String(q) : "").trim();
  window.location.hash = "#/search?q=" + encodeURIComponent(v);
}

function showView(name) {
  document.getElementById("view-discovery").hidden = name != "discovery";
  document.getElementById("view-results").hidden = name != "results";
  setTitle(name);
}

function hotPick(rowIndex, tagIndex) {
  var row = window.AppData.hotRows[rowIndex];
  var word = row.tags[tagIndex];
  document.getElementById("search-input").value = word;
  goSearch(word);
}

function renderHotTags() {
  var wrap = document.getElementById("hot-tag-rows");
  if (!wrap || !window.AppData) {
    return;
  }
  var html = "";
  var r;
  for (r = 0; r < AppData.hotRows.length; r++) {
    var row = AppData.hotRows[r];
    html += "<div class='section hot-row'>";
    html += "<div class='rank-meta tag-row-title'>" + row.label + "</div>";
    html += "<div class='hot-tags'>";
    var t;
    for (t = 0; t < row.tags.length; t++) {
      html +=
        "<button type='button' class='tag' onclick='hotPick(" +
        r +
        "," +
        t +
        ")'>" +
        row.tags[t] +
        "</button>";
    }
    html += "</div></div>";
  }
  wrap.innerHTML = html;
}

function renderRankList(listEl) {
  if (!listEl || !window.AppData) {
    return;
  }
  var n = 5;
  if (AppData.rankingPlaceholderRows > 0) {
    n = AppData.rankingPlaceholderRows;
  }
  listEl.innerHTML = "";
  var i;
  for (i = 0; i < n; i++) {
    var rank = i + 1;
    var numClass = "rank-num";
    if (rank <= 3) {
      numClass += " top";
    }
    listEl.innerHTML +=
      "<li class='rank-item rank-item-placeholder'>" +
      "<span class='" +
      numClass +
      "'>" +
      rank +
      "</span>" +
      "<div class='rank-thumb rank-thumb-placeholder'></div>" +
      "<div class='rank-body'>" +
      "<div class='rank-name rank-name-placeholder'>—</div>" +
      "<div class='rank-meta rank-meta-placeholder'>—</div>" +
      "</div></li>";
  }
}

function renderResultsEmpty() {
  var main = document.getElementById("listings");
  var countEl = document.getElementById("result-count");
  if (!main) {
    return;
  }
  main.innerHTML = "";
  if (countEl) {
    countEl.innerHTML = "0 listings";
  }
  main.innerHTML += "<p class='rank-meta empty-tip'>No matching listings.</p>";
}

function wirePageOnce() {
  if (pageReady) {
    return;
  }
  pageReady = true;

  document.getElementById("search-form").addEventListener("submit", function (e) {
    e.preventDefault();
    goSearch(document.getElementById("search-input").value);
  });

  document.querySelector("#view-discovery .back-btn").addEventListener("click", function () {
    window.location.href = "home.html";
  });

  document.getElementById("search-form-results").addEventListener("submit", function (e) {
    e.preventDefault();
    goSearch(document.getElementById("results-search-input").value);
  });

  document.querySelector("#view-results .back-btn").addEventListener("click", function () {
    window.location.href = "home.html";
  });
}

function onRoute() {
  wirePageOnce();

  var route = parseRoute();

  renderHotTags();
  renderRankList(document.getElementById("rank-sales"));
  renderRankList(document.getElementById("rank-drop"));
  renderRankList(document.getElementById("rank-hotsearch"));
  renderRankList(document.getElementById("rank-pop"));

  if (route.name == "results") {
    showView("results");
    document.getElementById("results-search-input").value = route.q;
    renderResultsEmpty();
  } else {
    showView("discovery");
  }
}

window.addEventListener("hashchange", onRoute);

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", onRoute);
} else {
  onRoute();
}
