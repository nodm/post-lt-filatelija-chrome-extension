import { PhilatelyProduct } from '../models/philately-product';
import { PhilatelyProductType } from '../models/philately-product-type';
import { CollectionRecord, CollectionUnit, UnitType } from '../models/philately';

const YEAR_OF_EURO_AREA_JOINT = 2015;

export function mapProduct(product: PhilatelyProduct) {
  switch (product.type) {
    case PhilatelyProductType.STAMP:
      return {};
    default:
      return {};
  }
}

export function mapProductToCollectionRecord(product: PhilatelyProduct): CollectionRecord {
  const year = product.year ?? new Date().getFullYear();

  const unit: CollectionUnit = {
    type: UnitType.STAMP,
    catalogNumber: [{
      name: 'Lietuvos paštas',
      number: product.catalogNumber ?? '',
    }],
    denomination: {
      value: year < YEAR_OF_EURO_AREA_JOINT ? 0 : product.price.value,
      currency: year < YEAR_OF_EURO_AREA_JOINT ? 'LTL' : 'EUR',
    },
  };
  if (product.imgUrl) {
    unit.imageUrl = product.imgUrl;
  }
  if (product.meta) {
    unit.meta = product.meta;
  }
  if (product.description) {
    unit.description = product.description;
  }
  if (product.price) {
    unit.prices = [{
      sourceUrl: product.href,
      value: product.price.value,
      currency: product.price.currency,
      date: new Date().toISOString(),
    }];
  }

  const collectionRecord: CollectionRecord = {
    origin: product.href,
    countryCode: 'LT',
    type: UnitType.STAMP,
    dateOfIssue: product.dateOfIssue ?? '',
    catalogNumber: unit.catalogNumber,
    title: product.title,
    denomination: unit.denomination,
  };
  if (unit?.imageUrl) {
    collectionRecord.imageUrl = unit.imageUrl;
  }
  if (unit?.meta) {
    collectionRecord.meta = unit.meta;
  }
  if (unit?.description) {
    collectionRecord.description = unit.description;
  }
  if (unit?.prices) {
    collectionRecord.prices = unit?.prices;
  }

  if (product.catalogNumber?.includes('-')) {
    const [firstNumberString, lastNumberString] = product.catalogNumber.split('-');
    if (!firstNumberString.match(/^[0-9]*$/) || !lastNumberString.match(/^[0-9]*$/)) {
      return collectionRecord;
    }

    const firstNumber = parseInt(firstNumberString, 10);
    const lastNumber = parseInt(lastNumberString, 10);
    const units: CollectionUnit[] = new Array(lastNumber - firstNumber +1)
      .fill(unit)
      .map((u, i) => ({
        ...u,
        catalogNumber: [{
          name: 'Lietuvos paštas',
          number: (firstNumber +i).toString(),
        }],
      }));

    collectionRecord.units = units;
  }

  return collectionRecord;
}
