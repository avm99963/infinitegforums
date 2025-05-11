import {
  Category,
  Detail,
  Forum,
  LanguageConfiguration,
} from '../../../../domain/forum';

export class ForumsFactory {
  convertProtobufForumInfoListToEntities(
    forums: any,
    displayLanguage: string,
  ): Forum[] {
    return forums.map((rawForumInfo: any) => {
      const productForum = rawForumInfo?.[2];
      return this.convertProtobufProductForumToEntity(
        productForum,
        displayLanguage,
      );
    });
  }

  convertProtobufProductForumToEntity(
    productForum: any,
    displayLanguage: string,
  ): Forum {
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
  ): any {
    return (
      languageConfigurations?.find?.(
        (configuration: any) => configuration[1] === displayLanguage,
      ) ?? languageConfigurations?.[0]
    );
  }

  private convertLanguageConfiguration(
    configuration: any,
  ): LanguageConfiguration {
    return {
      id: configuration?.[1],
      supportedLanguages: [
        ...new Set<string>(
          configuration?.[3].map((lang: any) => lang?.toLowerCase?.()) ?? [],
        ),
      ],
      categories: configuration?.[12]?.map?.((category: any) =>
        this.convertCategory(category),
      ),
      details:
        configuration?.[13]?.map?.((detail: any) =>
          this.convertDetail(detail),
        ) ?? [],
    };
  }

  private convertCategory(category: any): Category {
    return {
      id: category?.[1],
      name: category?.[2],
    };
  }

  private convertDetail(detail: any): Detail {
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
