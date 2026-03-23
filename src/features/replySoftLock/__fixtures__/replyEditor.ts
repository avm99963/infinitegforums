export function getStringifiedThreadReplyEditor(options: {
  includeSubscribeCheckbox: boolean;
}) {
  return `
    <sc-tailwind-thread-reply-editor>
      <div class="scTailwindThreadReplyeditorroot">
        <sc-shared-callout>
          <!-- Skipped -->
        </sc-shared-callout>
        <div class="scTailwindThreadReplyeditortop-row">
          <sc-tailwind-shared-display_name_editor-display-name-editor>
            <div
              class="scTailwindSharedDisplay_name_editorDisplaynameeditorroot"
            >
              <div
                class="scTailwindSharedDisplay_name_editorDisplaynameeditorlabel"
                hidden="true"
                id="rce-66729638130298104"
              >
                Display name
              </div>
              <div
                class="scTailwindSharedDisplay_name_editorDisplaynameeditoruser-name-container"
              >
                <span
                  class="scTailwindSharedDisplay_name_editorDisplaynameeditoruser-name"
                >
                  avm99963
                </span>
                <sc-shared-material-button>
                  <div class="scSharedMaterialbuttoncontainer" style="">
                    <div
                      class="scSharedMaterialbuttontouch-target"
                      aria-hidden="true"
                    ></div>
                    <button
                      class="scSharedMaterialbuttonroot scSharedMaterialbuttontext scSharedMaterialbuttoncolor-label scSharedMaterialbuttonicon-only"
                      role="button"
                      type="button"
                      aria-label="Edit display name"
                      title="Edit display name"
                      aria-haspopup="false"
                      style=""
                    >
                      <span class="scSharedMaterialbuttonicon">
                        <sc-shared-material-icon>
                          <div
                            class="scSharedMaterialiconroot scSharedMaterialiconbaseline"
                            role="img"
                            aria-label="Edit display name"
                            style="width: 1.5rem; height: 1.5rem;"
                          >
                            <html-blob>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L13.4 6.41 3 16.82V21h4.18l10.46-10.46 2.77-2.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"
                                ></path>
                                <path fill="none" d="M0 0h24v24H0V0z"></path>
                              </svg>
                            </html-blob>
                          </div>
                        </sc-shared-material-icon>
                      </span>
                      <sc-shared-material-interaction-overlay>
                        <span></span>
                        <div
                          class="scSharedMaterialinteractionoverlayroot"
                          aria-hidden="true"
                        >
                          <div
                            class="scSharedMaterialinteractionoverlayhover-overlay"
                          ></div>
                          <div
                            class="scSharedMaterialinteractionoverlaypressed-overlay"
                          ></div>
                          <div
                            class="scSharedMaterialinteractionoverlayripple"
                            style="top: calc(50% - 128px); left: calc(50% - 128px); transform: scale(0.34329);"
                          ></div>
                        </div>
                      </sc-shared-material-interaction-overlay>
                    </button>
                  </div>
                </sc-shared-material-button>
              </div>
            </div>
          </sc-tailwind-shared-display_name_editor-display-name-editor>
          ${
            options.includeSubscribeCheckbox
              ? `
                <div class="scTailwindThreadReplyeditorsubscribe">
                  <sc-shared-material-checkbox>
                    <label class="scSharedMaterialcheckboxroot">
                      <div class="scSharedMaterialcheckboxtouch-target">
                        <div class="scSharedMaterialcheckboxcheckbox">
                          <input
                            id="rce-16582630872697212"
                            class="scSharedMaterialcheckboxnative-control"
                            type="checkbox"
                            tabindex="0"
                          />
                          <div class="scSharedMaterialcheckboxbox">
                            <svg
                              class="scSharedMaterialcheckboxcheckmark"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                            >
                              <path
                                class="scSharedMaterialcheckboxcheckmark-path"
                                d="M1.73,12.91 8.1,19.28 22.79,4.59"
                              ></path>
                            </svg>
                            <div
                              class="scSharedMaterialcheckboxmixedmark"
                            ></div>
                          </div>
                          <sc-shared-material-interaction-overlay>
                            <span></span>
                            <div
                              class="scSharedMaterialinteractionoverlayroot"
                              aria-hidden="true"
                            >
                              <div
                                class="scSharedMaterialinteractionoverlayhover-overlay"
                              ></div>
                              <div
                                class="scSharedMaterialinteractionoverlaypressed-overlay"
                              ></div>
                              <div
                                class="scSharedMaterialinteractionoverlayripple"
                                style="top: calc(50% - 128px); left: calc(50% - 128px); transform: scale(0.299096);"
                              ></div>
                            </div>
                          </sc-shared-material-interaction-overlay>
                        </div>
                      </div>
                      Subscribe to updates
                    </label>
                  </sc-shared-material-checkbox>
                </div>
              `
              : ''
          }
        </div>
        <div class="scTailwindThreadReplyeditorcontent">
          <sc-tailwind-shared-rich-text-editor>
            <!-- Skipped -->
          </sc-tailwind-shared-rich-text-editor>
        </div>
        <div class="scTailwindThreadReplyeditorfooter">
          Please follow our
          <a
            href="https://support.google.com/communities/answer/7425194"
            target="_blank"
          >
            content policy
          </a>
          when creating your post.
        </div>
      </div>
    </sc-tailwind-thread-reply-editor>
  `;
}
