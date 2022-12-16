window.addEventListener("DOMContentLoaded", () => {
  // eslint-disable-next-line no-undef
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (!request?.command) {
        sendResponse({ error: 'Incorrect command' });
      }

      try {
        const data = getPhilatelyProduct();
        sendResponse({ data });
      } catch (error) {
        sendResponse({ data: null, error: error.message });
      }
    }
  );
});

const PhilatelyProductType = {
  STAMP: 'Stamp',
  FIRST_DAY_COVER: 'First-day cover',
  SMALL_SHEET: 'Small sheet',
  MAXIMUM_CARD: 'Maximum card',
  BOOKLET: 'Booklet',
  ANNUAL_COLLECTION: 'Annual collection',
  OTHER: 'Other',
};

const COLLECTABLE_SELECTOR = 'div#maincontent';
const getPhilatelyProduct = () => {
  const collectableElement = document.querySelector(COLLECTABLE_SELECTOR);
  if (!collectableElement) {
    return null;
  }

  try {
    const product = {
      // eslint-disable-next-line no-restricted-globals
      href: location.href,
      ...parseTitle(collectableElement),
      ...parseImg(collectableElement),
      ...parsePrice(collectableElement),
      ...getDescription(collectableElement),
    };

    return Object.entries(product)
      .filter(([, value]) => Array.isArray(value) ? value.length : Boolean(value))
      .reduce((finalProduct, [key, value]) => ({
        ...finalProduct,
        [key]: value,
      }), {});
  } catch {
    console.info('Chrome extension "Lietuvos paštas Filatelija" throws page parsing error.');
    return null;
  }
};

const TITLE_SELECTOR = 'h1.top';
const parseTitle = (collectableElement) => {
  const titleText = collectableElement.querySelector(TITLE_SELECTOR).textContent.trim();
  const hasDate = !!titleText.match(/^\d/);
  let issueYear = 0;
  let dateOfIssue = '';
  let rawTitle = titleText;

  if (hasDate) {
    const dateString = titleText.substring(0, 10);
    const [year, month, date] = dateString.split(' ');

    try {
      if ([year, month, date].some(v => !v.match(/^[0-9]*$/))) {
        if (year.match(/^[0-9]*$/)) {
          issueYear = parseInt(year, 10);
        }

        throw new TypeError(`Incorrect date ${year}-${month}-${date}`);
      }

      const issueDate = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(date, 10),
        12,
        0,
        0,
        0
      );
      dateOfIssue = issueDate?.toISOString()?.substring(0,10) ?? '';
      issueYear = parseInt(year, 10);
      rawTitle = rawTitle.substring(10)
    } catch (error) {
      console.log('Parsing error:', error, titleText);
    }
  }

  rawTitle = sanitize(rawTitle);

  let type = PhilatelyProductType.STAMP;
  if (rawTitle.includes('PVD') || rawTitle.includes('PDV') || rawTitle.includes('Pirmos dienos vokas')) {
    type = PhilatelyProductType.FIRST_DAY_COVER;
  } else if(rawTitle.includes('ML') || rawTitle.includes('Mažas lapelis')|| rawTitle.includes('Mažas lapeiis')) {
    type = PhilatelyProductType.SMALL_SHEET;
  } else if(rawTitle.includes('KM') || rawTitle.includes('Kartmaksimumas')) {
    type = PhilatelyProductType.MAXIMUM_CARD;
  } else if(rawTitle.includes('Bukletas')) {
    type = PhilatelyProductType.BOOKLET;
  } else if(rawTitle.includes('METŲ PAŠTO ŽENKLŲ RINKINYS')) {
    type = PhilatelyProductType.ANNUAL_COLLECTION;
  }

  const titleWithoutType = [
    'PVD', 'PDV', 'Pirmos dienos vokas',
    'ML', 'Mažas lapelis', 'Mažas lapeiis',
    'KM', 'Kartmaksimumas',
    'PA',
    'Bukletas',
    'Pašto ženklai išimti iš apyvartos',
    'Pašto ženklas išimtas iš apyvartos',
    'Pašto ženklų serija išimta iš apyvartos',
    '\\(\\).',
    '\\(\\)',
  ]
    .reduce((a, w) => a.replace(new RegExp(w, 'g'), ''), rawTitle)
    .trim();
  const [, title = titleWithoutType] = titleWithoutType.match(/^"(.*)?"$/) ?? [];

  return { year: issueYear, dateOfIssue, type, title };
};

const IMAGE_SELECTOR = '.item .img > img'
const parseImg = (productElement) => {
  const imgUrl = [
    // eslint-disable-next-line no-restricted-globals
    location.origin,
    encodeURI(
      productElement.querySelector(IMAGE_SELECTOR)
        ?.getAttribute('src')
        ?.replace('/320x', '/1280x')
    ),
  ].join('/');

  return { imgUrl };
};

const PRICE_SELECTOR = '.item .price > h2';
const parsePrice = (productElement) => {
  const priceText = productElement.querySelector(PRICE_SELECTOR)?.textContent;
  const [valueText, currency] = priceText.split(' ');
  return {
    price: {
      value: Number(valueText.replace(',', '.')),
      currency: currency?.toUpperCase(),
    },
  };
};

const DESCRIPTION_SELECTOR = '.item .desc';
const getDescription = (productElement) => {
  const descriptionLines = [...productElement.querySelectorAll(`${DESCRIPTION_SELECTOR} > p`)]
    .map(element => sanitize(element.textContent));

  return  descriptionLines.reduce((parsedDescription, descriptionLine) => {
    if (!descriptionLine) {
      return parsedDescription;
    }

    if (descriptionLine.includes('DĖMESIO! PAŠTO ŽENKLAI SU LITO NOMINALU NEGALIOJA SIUNTIMO PASLAUGOMS APMOKĖTI')) {
      return parsedDescription;
    }

    const line = sanitize(descriptionLine);

    const [, catalogNumber] =
    line.match(/Nr\. ([0-9-a-zA-Z]*)[.\s]/) ||
    line.match(/Nr\. ([0-9-a-zA-Z]*)$/) ||
    [];

    if (catalogNumber) {
      return {
        catalogNumber,
        meta: parsedDescription.meta,
        description: parsedDescription.description,
      };
    }

    if (line.match(/(?:\s|^)(Dail\.|Ofsetas\.|Lape|Tiražas|Spausdino)(?=\s|$)/)) {
      return {
        catalogNumber: parsedDescription.catalogNumber,
        meta: [...parsedDescription.meta, line],
        description: parsedDescription.description,
      };
    }

    return {
      catalogNumber: parsedDescription.catalogNumber,
      meta: parsedDescription.meta,
      description: [...parsedDescription.description, line],
    };
  }, {
    catalogNumber: undefined,
    meta: [],
    description: [],
  });
};

const sanitize = (str) => {
  return str
    .replace(/[/\n/\t]+/g, '')
    .trim()
    .replace(/,,/g, '"')
    .replace(/''/g, '"')
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/„/g, '"')
    // eslint-disable-next-line no-irregular-whitespace
    .replace(/ /g, '');
};
