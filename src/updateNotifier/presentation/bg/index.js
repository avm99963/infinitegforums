export default class UpdateNotifier {
  getCommunityConsoleTabs() {
    return new Promise(res => {
      chrome.tabs.query(
          {url: 'https://support.google.com/s/community*'}, tabs => res(tabs));
    });
  }

  notify(reason) {
    this.getCommunityConsoleTabs().then(tabs => {
      for (const tab of tabs) {
        const script = reason === 'install' ? 'handleInstall.bundle.js' :
                                              'handleUpdate.bundle.js';
        // #!if browser_target == 'chromium_mv3'
        chrome.scripting.executeScript({
          target: {tabId: tab.id},
          files: [script],
        });
        // #!else
        chrome.tabs.executeScript(tab.id, {file: script});
        // #!endif
      }
    });
  }
}
