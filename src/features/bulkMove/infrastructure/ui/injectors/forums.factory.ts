import { Forum } from '../../../../../domain/forum';

export class ForumsFactory {
  convertProtobufListToEntities(forums: any, displayLanguage: string): Forum[] {
    return forums.map((rawForumInfo: any) =>
      this.convertProtobufToEntity(rawForumInfo, displayLanguage),
    );
  }

  convertProtobufToEntity(forumInfo: any, displayLanguage: string) {
    const productForum = forumInfo[2];
    const languageConfigurations = productForum?.[10];
    const defaultLanguageConfiguration = this.getDefaultLanguageConfiguration(
      languageConfigurations,
      displayLanguage,
    );

    return {
      name: defaultLanguageConfiguration?.[4] ?? 'Unknown forum name',
      id: productForum?.[1]?.[1],
      languageConfigurations:
        languageConfigurations?.map?.((configuration: any) =>
          this.convertLanguageConfiguration(configuration),
        ) ?? [],
    };
  }

  private getDefaultLanguageConfiguration(
    languageConfigurations: any,
    displayLanguage: string,
  ) {
    return (
      languageConfigurations?.find?.(
        (configuration: any) => configuration[1] === displayLanguage,
      ) ?? languageConfigurations?.[0]
    );
  }

  private convertLanguageConfiguration(configuration: any) {
    return {
      id: configuration?.[1],
      name: configuration?.[1], // TODO: Change with localized language name
      categories: configuration?.[12]?.map?.((category: any) =>
        this.convertCategory(category),
      ),
      details:
        configuration?.[13]?.map?.((detail: any) =>
          this.convertDetail(detail),
        ) ?? [],
    };
  }

  private convertCategory(category: any) {
    return {
      id: category?.[1],
      name: category?.[2],
    };
  }

  private convertDetail(detail: any) {
    return {
      id: detail?.[1],
      name: detail?.[2],
      options: detail?.[3]?.map?.((option: any) => {
        return {
          id: option?.[1],
          name: option?.[2],
        };
      }),
    };
  }
}
