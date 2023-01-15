/* eslint-disable no-sparse-arrays */
import * as protojs from './protojs.js';

const objectLike1 = {
  '2': [1, 2, 3],
};

const arrayLike1 = [
  undefined,
  [1, 2, 3],
];

const rObjectLike1 = [
  ,
  undefined,
  [, 1, 2, 3],
];

const objectLike2 = {
  '1': {
    '1': 12,
    '2': [
      {
        '6': [false, false, false],
        '7': {
          '1': false,
          '2': 'Hola',
        },
      },
      {
        '6': [true, true, false],
        '7': {
          '1': false,
          '2': 'Test',
        },
      },
      {
        '6': [],
        '7': {
          '1': true,
          '2': 'Bye',
        },
      },
    ],
    '3': 1663,
  },
};

const arrayLike2 = [[
  12,
  [
    [
      undefined, undefined, undefined, undefined, undefined,
      [false, false, false],
      [
        false,
        'Hola',
      ]
    ],
    [
      undefined, undefined, undefined, undefined, undefined,
      [true, true, false],
      [
        false,
        'Test',
      ]
    ],
    [
      undefined, undefined, undefined, undefined, undefined, [],
      [
        true,
        'Bye',
      ]
    ],
  ],
  1663,
]];

const rObjectLike2 = [, [
  ,
  12,
  [
    ,
    [
      , undefined, undefined, undefined, undefined, undefined,
      [, false, false, false],
      [
        ,
        false,
        'Hola',
      ]
    ],
    [
      , undefined, undefined, undefined, undefined, undefined,
      [, true, true, false],
      [
        ,
        false,
        'Test',
      ]
    ],
    [
      , undefined, undefined, undefined, undefined, undefined, [],
      [
        ,
        true,
        'Bye',
      ]
    ],
  ],
  1663,
]];

test('can convert object-like to array-like', () => {
  // [ object-like input, array-like verified output ]
  const entries = [
    [objectLike1, arrayLike1],
    [rObjectLike1, arrayLike1],
    [objectLike2, arrayLike2],
    [rObjectLike2, arrayLike2],
  ];

  entries.forEach(([input, verifiedOutput]) => {
    const converted = protojs.inverseCorrectArrayKeys(input);
    expect(converted).toStrictEqual(verifiedOutput);
  });
});

test('can convert array-like to object-like', () => {
  // [ array-like input, object-like verified output ]
  const entries = [
    [arrayLike1, rObjectLike1],
    [arrayLike2, rObjectLike2],
  ];

  entries.forEach(([input, verifiedOutput]) => {
    const converted = protojs.correctArrayKeys(input);
    expect(converted).toStrictEqual(verifiedOutput);
  });
});

test('empty object can be converted to array-like form', () => {
  const object = {
    1: {},
  };
  const converted = protojs.inverseCorrectArrayKeys(object);
  expect(converted).toStrictEqual([[]]);
});
