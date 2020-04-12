var mutationObserver, intersectionObserver, options;

function parseUrl(url) {
  var forum_a = url.match(/forum\/([0-9]+)/i);
  var thread_a = url.match(/thread\/([0-9]+)/i);

  if (forum_a === null || thread_a === null) {
    return false;
  }

  return {
    "forum": forum_a[1],
    "thread": thread_a[1]
  };
}

function recursiveParentElement(el, tag) {
  while (el !== document.documentElement) {
    el = el.parentNode;
    if (el.tagName == tag) return el;
  }

  return undefined;
}

function duplicateThreads() {
  var modal = document.querySelector(".pane[pane-id=\"default-1\"]");
  var duplicateinto = parseUrl(modal.querySelector("#infinitegforums_duplicateinto").value);
  if (duplicateinto === false) {
    return;
  }
  modal.querySelector("footer").style.display = "none";
  var checkboxes = document.querySelectorAll(".thread-group material-checkbox[aria-checked=\"true\"]");
  modal.querySelector("main").innerHTML = '<p style="text-align: center;">'+chrome.i18n.getMessage("inject_duplicate_progress")+':<br><progress id="infinitegforums_progress" max="'+checkboxes.length+'" value="0"></progress></p>';
  checkboxes.forEach(checkbox => {
    var thread = parseUrl(recursiveParentElement(checkbox, "A").href);
    var script = document.createElement('script');
    script.textContent = 'fetch("https://support.google.com/s/community/api/MarkDuplicateThread", {"credentials":"include","headers":{"content-type":"text/plain; charset=utf-8"},"body":\'{\"1\":\"'+thread.forum+'\",\"2\":\"'+thread.thread+'\",\"3\":{\"2\":{\"1\":\"'+duplicateinto.forum+'\",\"2\":\"'+duplicateinto.thread+'\"}}}\',"method":"POST","mode":"cors"}).then(_ => { var progress = document.querySelector("#infinitegforums_progress"); progress.value = parseInt(progress.value) + 1; if (progress.value == progress.getAttribute("max")) { location.reload(); } });';
    document.head.appendChild(script);
    script.remove();
  });
}

function mutationCallback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    if (mutation.type == "childList") {
      mutation.addedNodes.forEach(function (node) {
        if (typeof node.classList !== "undefined") {
          if (options.thread && node.classList.contains("load-more-bar")) {
            intersectionObserver.observe(node.querySelector(".load-more-button"));
          }

          if (options.threadall && node.classList.contains("load-more-bar")) {
            intersectionObserver.observe(node.querySelector(".load-all-button"));
          }

          if (options.history && ("parentNode" in node) && node.parentNode !== null && ("tagName" in node.parentNode) && node.parentNode.tagName == "EC-USER") {
            var nameElement = node.querySelector(".name span");
            if (nameElement !== null) {
              var name = nameElement.innerText;
              var query = encodeURIComponent("(creator:\""+name+"\" | replier:\""+name+"\") -forum:0");
              var urlpart = encodeURIComponent("query="+query);
              var link = document.createElement("a");
              link.setAttribute("href", "https://support.google.com/s/community/search/"+urlpart);
              link.innerText = chrome.i18n.getMessage("inject_previousposts");
              node.querySelector(".main-card-content").appendChild(document.createElement("br"));
              node.querySelector(".main-card-content").appendChild(link);
            }
          }

          if (options.batchduplicate && ("tagName" in node) && node.tagName == "MATERIAL-BUTTON" && node.getAttribute("debugid") !== null && (node.getAttribute("debugid") == "mark-read-button" || node.getAttribute("debugid") == "mark-unread-button") && ("parentNode" in node) && document.querySelector("[debugid=\"batchduplicate\"]") === null && node.parentNode !== null && ("parentNode" in node.parentNode) && node.parentNode.parentNode !== null && ("tagName" in node.parentNode.parentNode) && node.parentNode.parentNode.tagName == "EC-BULK-ACTIONS") {
            var clone = node.cloneNode(true);
            clone.setAttribute("debugid", "batchduplicate");
            clone.setAttribute("title", chrome.i18n.getMessage("inject_duplicatebtn"));
            clone.querySelector("material-icon").setAttribute("icon", "control_point_duplicate");
            clone.querySelector("i.material-icon-i").innerText = "control_point_duplicate";
            node.parentNode.prepend(clone);
            clone.addEventListener("click", function() {
              var modal = document.querySelector(".pane[pane-id=\"default-1\"]");
              modal.classList.add("visible");
              modal.style.display = "block";
              modal.innerHTML = '<material-dialog role="dialog" aria-modal="true" style="display: block!important; width: 600px; max-width: 100%; margin: 8px auto; padding: 16px 0; background: white; box-shadow: 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12), 0 11px 15px -7px rgba(0,0,0,.2);"><header role="presentation" style="padding: 24px 24px 0; width: 100%; box-sizing: border-box;"><div style="color: #202124; font-family: \'Google Sans\',sans-serif; font-size: 18px; font-weight: 400; line-height: 24px; margin-bottom: 4px; text-align: center;">'+chrome.i18n.getMessage("inject_duplicatebtn")+'</div></header><main role="presentation" style="font-size: 13px; font-weight: 400; color: rgba(0,0,0,.87); overflow: auto; padding: 0 24px;"><p><label for="duplicate_thread">'+chrome.i18n.getMessage("inject_duplicateinto")+' </label><input type="url" id="infinitegforums_duplicateinto" placeholder="'+chrome.i18n.getMessage("inject_duplicateinto_placeholder")+'" style="width: 400px;"></p></main><footer role="presentation" style="padding: 0 24px;"><material-button role="button" style="display: inline-block; float: right; color: #1a73e8; height: 36px; min-width: 64px; margin: 0 4px; cursor: pointer;" id="infinitegforums_duplicate"><div class="content" style="line-height: 36px; text-align: center;">'+chrome.i18n.getMessage("inject_duplicate_confirm")+'</div></material-button><material-button role="button" style="display: inline-block; float: right; color: #1a73e8; height: 36px; min-width: 64px; margin: 0 4px; cursor: pointer;" id="infinitegforums_cancel"><div class="content" style="line-height: 36px; text-align: center;">'+chrome.i18n.getMessage("inject_duplicate_cancel")+'</div></material-button><div style="clear: both;"></div></footer></material-dialog>';
              modal.querySelector("#infinitegforums_duplicateinto").focus();
              modal.querySelector("#infinitegforums_cancel").addEventListener("click", function() {
                var modal = document.querySelector(".pane[pane-id=\"default-1\"]");
                modal.classList.remove("visible");
                modal.style.display = "none";
                modal.innerHTML = "";
              });
              modal.querySelector("#infinitegforums_duplicateinto").addEventListener("keypress", function() {
                if (event.keyCode == 13) {
                  duplicateThreads();
                }
              });
              modal.querySelector("#infinitegforums_duplicate").addEventListener("click", duplicateThreads);
            });
          }
        }
      });
    }
  });
}

function intersectionCallback(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.click();
    }
  });
};

function injectStyles(css) {
  var link = document.createElement('link');
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", "data:text/css;charset=UTF-8,"+encodeURIComponent(css));
  document.head.appendChild(link);
}

var observerOptions = {
  childList: true,
  attributes: true,
  subtree: true
}

var intersectionOptions = {
  root: document.querySelector('.scrollable-content'),
  rootMargin: '0px',
  threshold: 1.0
}

chrome.storage.sync.get(null, function(items) {
  options = items;

  mutationObserver = new MutationObserver(mutationCallback);
  mutationObserver.observe(document.querySelector(".scrollable-content"), observerOptions);

  intersectionObserver = new IntersectionObserver(intersectionCallback, intersectionOptions);

  if (options.fixedtoolbar) {
    injectStyles("ec-bulk-actions{position: sticky; top: 0; background: white; z-index: 96;}");
  }

  if (options.increasecontrast) {
    injectStyles(".thread-summary.read{background: #ecedee!important;}");
  }
});
