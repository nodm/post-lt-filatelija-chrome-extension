import { PhilatelyProductType } from './philately-product-type';

export interface PhilatelyProduct {
  href: string;
  type: PhilatelyProductType;
  title: string;
  imgUrl: string;
  price: {
    value: number;
    currency: string;
  };
  catalogNumber?: string | undefined;
  dateOfIssue?: string;
  year?: number,
  meta?: string[];
  description?: string[],
}
