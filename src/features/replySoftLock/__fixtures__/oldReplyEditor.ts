export function getStringifiedThreadOldReplyEditor(options: {
  includeSubscribeCheckbox: boolean;
}) {
  return `
    <ec-movable-dialog
      showminimize=""
      class="_ngcontent-imz-47 _nghost-imz-56"
      style="position: fixed; top: 257.109px; left: 255.5px;"
    >
      <material-dialog class="dialog _nghost-imz-66 _ngcontent-imz-56">
        <focus-trap class="_ngcontent-imz-66 _nghost-imz-12">
          <div
            debugid="acx_159038034"
            tabindex="0"
            class="_ngcontent-imz-12"
          ></div>
          <div
            focuscontentwrapper=""
            style="outline: none"
            class="_ngcontent-imz-12"
            tabindex="-1"
          >
            <div
              class="wrapper _ngcontent-imz-66"
              role="dialog"
              aria-labelledby="a66181046-4565-4E82-86B3-A9AB7359902F--0"
            >
              <!---->
              <header
                role="presentation"
                class="_ngcontent-imz-66"
                id="a66181046-4565-4E82-86B3-A9AB7359902F--0"
              >
                <!-- Skipped -->
              </header>
              <div class="error _ngcontent-imz-66"></div>
              <div class="main _ngcontent-imz-66 with-scroll-strokes">
                <!---->
                <div class="header-notice _ngcontent-imz-47">
                  <!-- Skipped -->
                </div>
                <main class="_ngcontent-imz-47">
                  <div class="user _ngcontent-imz-47">
                    <ec-avatar class="avatar _nghost-imz-57 _ngcontent-imz-47">
                      <div
                        class="avatar _ngcontent-imz-57"
                        role="img"
                        aria-label="Avatar of avm99963"
                      >
                        <!---->
                        <!---->
                        <!---->
                        <img
                          class="_ngcontent-imz-57"
                          alt="Avatar of avm99963"
                          src="https://avm99963.com/images/avatarfull.jpg"
                        />
                        <!---->
                      </div>
                    </ec-avatar>
                    <ec-display-name-editor
                      class="display-name _nghost-imz-58 _ngcontent-imz-47"
                    >
                      <div class="top-section _ngcontent-imz-58 disabled">
                        <!---->
                        <!---->
                        <span debugid="readOnlyLabel" class="_ngcontent-imz-58">
                          avm99963
                        </span>
                        <div class="status _ngcontent-imz-58">
                          <!---->
                          <material-button
                            animated="true"
                            class="edit _nghost-imz-2 _ngcontent-imz-58"
                            icon=""
                            trailing=""
                            tabindex="0"
                            role="button"
                            aria-disabled="false"
                            elevation="1"
                          >
                            <div class="content _ngcontent-imz-2">
                              <material-icon
                                baseline=""
                                flip=""
                                icon="mode_edit"
                                class="_ngcontent-imz-58 _nghost-imz-3"
                              >
                                <i
                                  class="material-icon-i material-icons-extended _ngcontent-imz-3"
                                  role="img"
                                  aria-label="Edit display name"
                                >
                                  mode_edit
                                </i>
                              </material-icon>
                            </div>
                            <material-ripple
                              aria-hidden="true"
                              class="_ngcontent-imz-2"
                            ></material-ripple>
                            <div class="touch-target _ngcontent-imz-2"></div>
                            <div class="focus-ring _ngcontent-imz-2"></div>
                          </material-button>
                          <!---->
                          <!---->
                        </div>
                      </div>
                      <!---->
                    </ec-display-name-editor>
                    <!---->
                    ${
                      options.includeSubscribeCheckbox
                        ? `
                          <material-checkbox
                            class="checkbox themeable _nghost-imz-25 _ngcontent-imz-47"
                            debugid="subscribe-toggle"
                            aria-checked="true"
                            role="checkbox"
                            aria-disabled="false"
                            tabindex="0"
                          >
                            <div
                              aria-hidden="true"
                              class="icon-container _ngcontent-imz-25 filled-container"
                            >
                              <material-icon
                                class="icon _nghost-imz-3 _ngcontent-imz-25 filled"
                              >
                                <i
                                  class="material-icon-i material-icons-extended _ngcontent-imz-3"
                                  role="img"
                                  aria-hidden="true"
                                >
                                  check_box
                                </i>
                              </material-icon>
                              <!---->
                              <material-ripple
                                aria-hidden="true"
                                class="ripple _ngcontent-imz-25"
                              ></material-ripple>
                              <div class="focus-ring _ngcontent-imz-25"></div>
                            </div>
                            <div class="content _ngcontent-imz-25">
                              Subscribe to updates
                            </div>
                          </material-checkbox>
                        `
                        : ``
                    }
                  </div>
                  <!---->
                  <!---->
                  <ec-rich-text-editor
                    allowcannedresponses=""
                    autofocus=""
                    class="editor _nghost-imz-59 _ngcontent-imz-47"
                  >
                    <!-- Skipped -->
                  </ec-rich-text-editor>
                  <!---->
                </main>
              </div>
              <!---->
              <footer role="presentation" class="_ngcontent-imz-66">
                <!-- Skipped -->
              </footer>
            </div>
          </div>
          <div
            debugid="acx_159038034"
            tabindex="0"
            class="_ngcontent-imz-12"
          ></div>
        </focus-trap>
      </material-dialog>
      <!---->
    </ec-movable-dialog>
  `;
}
