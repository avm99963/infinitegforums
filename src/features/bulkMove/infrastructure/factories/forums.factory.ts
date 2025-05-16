import { ProtobufObject } from '../../../../common/protojs.types';
import {
  Category,
  Detail,
  Forum,
  LanguageConfiguration,
} from '../../../../domain/forum';

export class ForumsFactory {
  convertProtobufForumInfoListToEntities(
    forums: ProtobufObject,
    displayLanguage: string,
  ): Forum[] {
    return forums.map((rawForumInfo: ProtobufObject) => {
      const productForum = rawForumInfo?.[2];
      return this.convertProtobufProductForumToEntity(
        productForum,
        displayLanguage,
      );
    });
  }

  convertProtobufProductForumToEntity(
    productForum: ProtobufObject,
    displayLanguage: string,
  ): Forum {
    const languageConfigurations =
      (productForum?.[10] as ProtobufObject[] | undefined)?.map?.(
        (configuration) => this.convertLanguageConfiguration(configuration),
      ) ?? [];
    const defaultLanguageConfiguration = this.getDefaultLanguageConfiguration(
      languageConfigurations,
      displayLanguage,
    );

    return {
      name: defaultLanguageConfiguration?.forumName ?? 'Unknown forum name',
      id: productForum?.[1]?.[1],
      languageConfigurations,
    };
  }

  private getDefaultLanguageConfiguration(
    languageConfigurations: LanguageConfiguration[],
    displayLanguage: string,
  ): LanguageConfiguration | undefined {
    return (
      this.getLanguageConfiguration(languageConfigurations, displayLanguage) ??
      // It seems like the Community Console falls back to loading the English
      // language configuration if the forum is not available in the user's
      // display language, so we're doing the same.
      this.getLanguageConfiguration(languageConfigurations, 'en') ??
      languageConfigurations?.[0]
    );
  }

  private getLanguageConfiguration(
    languageConfigurations: LanguageConfiguration[],
    language: string,
  ): LanguageConfiguration {
    return languageConfigurations.find((configuration) =>
      configuration.supportedLanguages.includes(language),
    );
  }

  private convertLanguageConfiguration(
    configuration: ProtobufObject,
  ): LanguageConfiguration {
    return {
      id: configuration?.[1],
      forumName: configuration?.[4],
      supportedLanguages: [
        ...new Set<string>(
          configuration?.[3].map((lang: string) => lang?.toLowerCase?.()) ?? [],
        ),
      ],
      categories: configuration?.[12]?.map?.((category: ProtobufObject) =>
        this.convertCategory(category),
      ),
      details:
        configuration?.[13]?.map?.((detail: ProtobufObject) =>
          this.convertDetail(detail),
        ) ?? [],
    };
  }

  private convertCategory(category: ProtobufObject): Category {
    return {
      id: category?.[1],
      name: category?.[2],
    };
  }

  private convertDetail(detail: ProtobufObject): Detail {
    return {
      id: detail?.[1],
      name: detail?.[2],
      options: detail?.[3]?.map?.((option: ProtobufObject) => {
        return {
          id: option?.[1],
          name: option?.[2],
        };
      }),
    };
  }
}
