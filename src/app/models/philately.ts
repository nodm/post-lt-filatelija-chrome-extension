export interface Denomination {
  value: number;
  currency: string;
}

export interface Price {
  sourceUrl: string;
  value: number;
  currency: string;
  date: string;
}

export const enum CatalogueName {
  POST_LT = 'Lietuvos paštas',
  MICHEL = 'MICHEL',
}
export interface CatalogueNumber {
  name: string;
  number: string;
}

export const enum UnitType {
  STAMP = 'Stamp',
  BLOCK = 'Block',
}

export const enum RecordType {
  STAMP_SET = 'Stamp set',
  STAMP = 'Stamp',
  BLOCK = 'Block',
  BOOKLET = 'Booklet',
}

export interface CollectionUnit {
  type: UnitType;
  issueCatalogueNumber: string;
  catalogueNumbers: CatalogueNumber[];
  denomination?: Denomination;
  postageRate?: string;
  imageUrl?: string;
  meta?: string[];
  description?: string[];
  smallSheet?: [],
  firstDayCover?: [],
  maxicard?: [],
  prices?: Price[];
}

export interface SmallSheet {
  imageUrl?: string;
  meta?: string[],
  denomination?: Denomination;
  origin?: string;
  prices?: Price[];
}

export interface FirstDayCover {
  imageUrl?: string;
  meta?: string[],
  origin?: string;
  prices?: Price[];
}

export interface MaxiCard {
  imageUrl?: string;
  meta?: string[],
  origin?: string;
  prices?: Price[];
}

export interface CollectionRecord {
  countryCode: string;
  type: RecordType;
  dateOfIssue: string;
  issueCatalogueNumber: string;
  catalogueNumbers: CatalogueNumber[];
  title: string;
  denomination?: Denomination;
  postageRate?: string;
  imageUrl?: string;
  meta?: string[];
  description?: string[];
  units?: CollectionUnit[];
  smallSheet?: SmallSheet[],
  firstDayCover?: FirstDayCover[],
  maxicard?: MaxiCard[],
  origin?: string;
  prices?: Price[];
}
