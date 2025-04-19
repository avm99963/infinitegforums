export interface Category {
  id: string;
  name: string;
}

export interface Option {
  id: string;
  name: string;
}

export interface Detail {
  id: string;
  name: string;
  options: Option[];
}

export interface LanguageConfiguration {
  id: string;
  name: string;
  categories: Category[];
  details: Detail[];
}

export interface Forum {
  id: string;
  name: string;
  languageConfigurations: LanguageConfiguration[];
}
