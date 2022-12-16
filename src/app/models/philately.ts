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

export interface CatalogNumber {
  name: string;
  number: string;
}

export const enum UnitType {
  STAMP = 'Stamp',
  BLOCK = 'Block',
  STAMP_SET = 'Stamp set'
}
export interface CollectionUnit {
  type: UnitType;
  catalogNumber: CatalogNumber[];
  denomination: Denomination;
  imageUrl?: string;
  meta?: string[];
  description?: string[];
  prices?: Price[];
}
export interface CollectionRecord {
  origin?: string;
  countryCode: string;
  type: UnitType;
  dateOfIssue: string;
  catalogNumber: CatalogNumber[];
  title: string;
  denomination: Denomination;
  imageUrl?: string;
  prices?: Price[];
  meta?: string[];
  description?: string[];
  units?: CollectionUnit[];
}
