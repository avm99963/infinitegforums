import { customElement, property } from 'lit/decorators.js';
import { I18nLitElement } from '../../../i18n/i18nLitElement';
import { html } from 'lit';
import { SHARED_MD3_STYLES } from '../../../../common/styles/md3';
import { Forum, LanguageConfiguration } from '../../../../domain/forum';
import { repeat } from 'lit/directives/repeat.js';

import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import { keyed } from 'lit/directives/keyed.js';
import { FORM_STYLES } from './styles';
import { EVENT_LOADED_FULL_FORUM_INFO } from '../events';
import {
  getForumRepositoryContext,
  GetForumRepositoryPort,
} from '../../../../features/bulkMove/ui/ports/getForum.repository.port';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { MdOutlinedSelect } from '@material/web/select/outlined-select.js';
import { msg } from '@lit/localize';
import { consume } from '@lit/context';

interface SingleLanguageConfiguration {
  language: string;
  localizedName: string;
  configuration: LanguageConfiguration;
}

@customElement('twpt-forum-picker')
export default class ForumPicker extends I18nLitElement {
  @property({ type: String })
  accessor forumId: string | undefined;

  @property({ type: String })
  accessor language: string | undefined;

  @property({ type: Object })
  accessor forums: Forum[] | undefined;

  /**
   * Display language code set by the user in the Community Console.
   */
  @property({ type: String })
  accessor displayLanguage: string | undefined;

  static styles = [SHARED_MD3_STYLES, FORM_STYLES];

  @consume({ context: getForumRepositoryContext })
  @property({ attribute: false })
  private accessor getForumRepository!: GetForumRepositoryPort;

  communityForumSelectRef: Ref<MdOutlinedSelect> = createRef();

  render() {
    return html`
      <div class="fields">
        ${this.renderForumSelect()} ${this.renderLanguageSelect()}
      </div>
    `;
  }

  private renderForumSelect() {
    const sortedForums =
      this.forums?.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'accent' }),
      ) ?? [];

    return html`
      <md-outlined-select
        label=${msg('Community Forum', {
          id: 'components.forumPicker.communityForum',
          desc: 'Label for the forum select in the forum picker.',
        })}
        required
        clampMenuWidth
        @change=${this.onForumChanged}
        ${ref(this.communityForumSelectRef)}
      >
        ${repeat(
          sortedForums,
          (forum) => forum.id,
          (forum) => html`
            <md-select-option
              value=${forum.id}
              ?selected=${forum.id === this.forumId}
            >
              <div slot="headline">${forum.name ?? forum.id}</div>
            </md-select-option>
          `,
        )}
      </md-outlined-select>
    `;
  }

  private renderLanguageSelect() {
    const selectedForum = this.getSelectedForum();
    const isForumSelected = selectedForum !== undefined;

    const sortedSingleLanguageConfigurations = isForumSelected
      ? this.getSortedSingleLanguageConfigurations(selectedForum)
      : [];

    // We use keyed since otherwise when changing forums the new language is not
    // properly set.
    return keyed(
      this.forumId,
      html`
        <md-outlined-select
          label=${msg('Language', {
            id: 'components.forumPicker.language',
            desc: 'Label for the language select in the forum picker.',
          })}
          required
          ?disabled=${!isForumSelected}
          clampMenuWidth
          @change=${this.onLanguageChanged}
        >
          ${repeat(
            sortedSingleLanguageConfigurations,
            (configuration) => configuration.language,
            (configuration) => html`
              <md-select-option
                value=${configuration.language}
                ?selected=${configuration.language === this.language}
              >
                <div slot="headline">${configuration.localizedName}</div>
              </md-select-option>
            `,
          )}
        </md-outlined-select>
      `,
    );
  }

  focus() {
    this.communityForumSelectRef.value?.focus();
  }

  private getSortedSingleLanguageConfigurations(
    forum: Forum,
  ): SingleLanguageConfiguration[] {
    return (
      forum?.languageConfigurations
        .map((configuration) => {
          return configuration.supportedLanguages.map(
            (language): SingleLanguageConfiguration => {
              return {
                language,
                localizedName: this.getLocalizedLanguageName(language),
                configuration,
              };
            },
          );
        })
        .flat()
        // The Community Console doesn't show languages without a localized name.
        .filter((it) => it.localizedName !== undefined)
        .sort((a, b) =>
          a.localizedName.localeCompare(b.localizedName, undefined, {
            sensitivity: 'accent',
          }),
        ) ?? []
    );
  }

  private getLocalizedLanguageName(language: string) {
    switch (language.toLowerCase()) {
      case 'ar':
        return msg('Arabic', { id: 'languages.ar' });
      case 'bg':
        return msg('Bulgarian', { id: 'languages.bg' });
      case 'ca':
        return msg('Catalan', { id: 'languages.ca' });
      case 'cs':
        return msg('Czech', { id: 'languages.cs' });
      case 'da':
        return msg('Danish', { id: 'languages.da' });
      case 'de':
        return msg('German', { id: 'languages.de' });
      case 'el':
        return msg('Greek', { id: 'languages.el' });
      case 'en':
        return msg('English', { id: 'languages.en' });
      case 'en-au':
        return msg('English (Australia)', { id: 'languages.en-AU' });
      case 'en-gb':
        return msg('English (UK)', { id: 'languages.en-GB' });
      case 'es':
        return msg('Spanish', { id: 'languages.es' });
      case 'es-419':
        return msg('Spanish (Latin America)', { id: 'languages.es-419' });
      case 'et':
        return msg('Estonian', { id: 'languages.et' });
      case 'fi':
        return msg('Finnish', { id: 'languages.fi' });
      case 'fil':
        return msg('Filipino', { id: 'languages.fil' });
      case 'fr':
        return msg('French', { id: 'languages.fr' });
      case 'hi':
        return msg('Hindi', { id: 'languages.hi' });
      case 'hr':
        return msg('Croatian', { id: 'languages.hr' });
      case 'hu':
        return msg('Hungarian', { id: 'languages.hu' });
      case 'id':
        return msg('Indonesian', { id: 'languages.id' });
      case 'it':
        return msg('Italian', { id: 'languages.it' });
      case 'iw':
        return msg('Hebrew', { id: 'languages.iw' });
      case 'ja':
        return msg('Japanese', { id: 'languages.ja' });
      case 'ko':
        return msg('Korean', { id: 'languages.ko' });
      case 'lt':
        return msg('Lithuanian', { id: 'languages.lt' });
      case 'lv':
        return msg('Latvian', { id: 'languages.lv' });
      case 'ms':
        return msg('Malay', { id: 'languages.ms' });
      case 'nl':
        return msg('Dutch', { id: 'languages.nl' });
      case 'no':
        return msg('Norwegian (Bokmal)', { id: 'languages.no' });
      case 'pl':
        return msg('Polish', { id: 'languages.pl' });
      case 'pt-br':
        return msg('Portuguese (Brazil)', { id: 'languages.pt-BR' });
      case 'pt-pt':
        return msg('Portuguese (Portugal)', { id: 'languages.pt-PT' });
      case 'ro':
        return msg('Romanian', { id: 'languages.ro' });
      case 'ru':
        return msg('Russian', { id: 'languages.ru' });
      case 'sk':
        return msg('Slovak', { id: 'languages.sk' });
      case 'sl':
        return msg('Slovenian', { id: 'languages.sl' });
      case 'sr':
        return msg('Serbian', { id: 'languages.sr' });
      case 'sv':
        return msg('Swedish', { id: 'languages.sv' });
      case 'th':
        return msg('Thai', { id: 'languages.th' });
      case 'tr':
        return msg('Turkish', { id: 'languages.tr' });
      case 'uk':
        return msg('Ukrainian', { id: 'languages.uk' });
      case 'vi':
        return msg('Vietnamese', { id: 'languages.vi' });
      case 'zh-cn':
        return msg('Chinese (Simplified)', { id: 'languages.zh-CN' });
      case 'zh-hk':
        return msg('Chinese (Hong Kong)', { id: 'languages.zh-HK' });
      case 'zh-tw':
        return msg('Chinese (Traditional)', { id: 'languages.zh-TW' });
      default:
        return undefined;
    }
  }

  private getSelectedForum(): Forum | undefined {
    return this.forums?.find((forum) => forum.id === this.forumId);
  }

  private async onForumChanged(e: Event) {
    this.forumId = (e.target as HTMLInputElement).value;

    const forum = await this.loadFullSelectedForumInfo();
    if (
      !forum.languageConfigurations.some((language) =>
        language.supportedLanguages.includes(this.language),
      )
    ) {
      this.language = undefined;
    }
    const changeEvent = new Event('change');
    this.dispatchEvent(changeEvent);

    const loadedFullForumInfoEvent = new CustomEvent(
      EVENT_LOADED_FULL_FORUM_INFO,
      { detail: { forum } },
    );
    this.dispatchEvent(loadedFullForumInfoEvent);
  }

  private onLanguageChanged(e: Event) {
    this.language = (e.target as HTMLInputElement).value;

    const event = new Event('change');
    this.dispatchEvent(event);
  }

  private async loadFullSelectedForumInfo(): Promise<Forum> {
    return this.getForumRepository.getForum(this.forumId, this.displayLanguage);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-forum-picker': ForumPicker;
  }
}
