/*var forums = ["youtube"];

for (forum of startup[1][2]) {
  if (forums.includes(forum[2][14])) {
    forum[3] = {
      "1": {
        "2": "1551129889541098",
          "3": 100
      },
      "2": {
        "7": true
      }
    }
  }
}*/

chrome.storage.sync.get(null, function(items) {
  if (items.loaddrafts) {
    var startup = JSON.parse(document.querySelector("html").getAttribute("data-startup"));
    startup[4][13] = true;
    document.querySelector("html").setAttribute("data-startup", JSON.stringify(startup));
  }
});
