export const defaultPredictReportTemplate = {
  _runtime: {
    fields: [
      {
        field: 'title',
        ai: {
          template: 'report/predict-title',
          parameters: [
            { field: 'date', variable: 'report.meta.date' },
            { field: 'dateType', variable: 'report.meta.dateType' },
            { field: 'stars', variable: 'user.horoscope.starsJsonString' },
            { field: 'dateStars', variable: 'report.meta.dateStarsJsonString' },
            { field: 'birthDate', variable: 'user.birthDate' },
          ],
        },
      },
      {
        field: 'summary',
        ai: {
          template: 'report/predict-summary',
          parameters: [
            { field: 'date', variable: 'report.date' },
            { field: 'dateType', variable: 'report.dateType' },
            { field: 'stars', variable: 'user.horoscope.starsJsonString' },
            { field: 'dateStars', variable: 'report.meta.dateStarsJsonString' },
          ],
        },
      },
      { field: 'date', variable: 'report.meta.date' },
      { field: 'dateType', variable: 'report.meta.dateType' },
      {
        field: 'sections',
        map: {
          iterator: 'report.sections',
          fields: [
            { field: 'icon', variable: '$item.icon' },
            { field: 'image', variable: '$item.image' },
            { field: 'title', variable: '$item.title' },
            { field: 'topic', variable: '$item.topic' },
            {
              field: 'content',
              ai: {
                template: 'report/predict-overview',
                parameters: [
                  { field: 'topic', variable: '$item.topic' },
                  { field: 'date', variable: 'report.meta.date' },
                  { field: 'dateType', variable: 'report.meta.dateType' },
                  { field: 'birthDate', variable: 'user.birthDate' },
                  { field: 'stars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'dateStars', variable: 'report.meta.dateStarsJsonString' },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  _details_: {
    _runtime: {
      fields: [
        { field: 'icon', variable: 'reportDetail.icon' },
        { field: 'iconTitle', variable: 'reportDetail.iconTitle' },
        { field: 'title', variable: 'reportDetail.title' },
        { field: 'subtitle', variable: 'reportDetail.subtitle' },
      ],
    },
    sections: [
      {
        _id: '1',
        type: 1,
        content: '',
        image: '',
        inset: 'right',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '',
        _runtime: {
          fields: [
            {
              field: 'content',
              ai: {
                template: 'report/predict-overview',
                parameters: [
                  { field: 'dateType', variable: 'report.meta.dateType' },
                  { field: 'topic', variable: 'reportDetail.title' },
                  { field: 'date', variable: 'report.meta.date' },
                  { field: 'birthDate', variable: 'user.birthDate' },
                  { field: 'stars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'dateStars', variable: 'report.meta.dateStarsJsonString' },
                ],
              },
            },
          ],
        },
      },
      {
        _id: '6',
        type: 1,
        content: '',
        image: '',
        inset: 'middle',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '',
        _runtime: {
          fields: [{ field: 'image', variable: 'reportDetail.image' }],
        },
      },
      {
        _id: '2',
        type: 1,
        content: '',
        image: '',
        inset: 'right',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '',
        _runtime: {
          fields: [
            {
              field: 'content',
              ai: {
                template: 'report/predict-houses',
                parameters: [
                  { field: 'topic', variable: 'reportDetail.title' },
                  { field: 'date', variable: 'report.meta.date' },
                  { field: 'birthDate', variable: 'user.birthDate' },
                  { field: 'stars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'dateStars', variable: 'report.meta.dateStarsJsonString' },
                ],
              },
            },
          ],
        },
      },
      {
        _id: '3',
        type: 2,
        chartType: 'transit',
        description: '',
        birthDate: '',
        latitude: '',
        longitude: '',
        darkTheme: true,
        transitDate: '',
        _runtime: {
          fields: [
            { field: 'birthDate', variable: 'user.birthDate' },
            { field: 'longitude', variable: 'user.birthPlace.longitude' },
            { field: 'latitude', variable: 'user.birthPlace.latitude' },
            { field: 'transitDate', variable: 'report.meta.date' },
          ],
        },
      },
      {
        _id: '4',
        type: 1,
        content: '',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '#D4C9FF',
        _runtime: {
          fields: [
            { field: 'sectionTitle', translate: 'GIFT' },
            { field: 'sectionIcon', variable: 'icons.gift' },
            {
              field: 'content',
              ai: {
                template: 'report/predict-strengths',
                parameters: [
                  { field: 'topic', variable: 'reportDetail.title' },
                  { field: 'date', variable: 'report.meta.date' },
                  { field: 'birthDate', variable: 'user.birthDate' },
                  { field: 'stars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'dateStars', variable: 'report.meta.dateStarsJsonString' },
                ],
              },
            },
          ],
        },
      },
      {
        _id: '5',
        type: 1,
        content: '',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '#D4C9FF',
        _runtime: {
          fields: [
            { field: 'sectionTitle', translate: 'CHALLENGE' },
            { field: 'sectionIcon', variable: 'icons.challenge' },
            {
              field: 'content',
              ai: {
                template: 'report/predict-challenges',
                parameters: [
                  { field: 'topic', variable: 'reportDetail.title' },
                  { field: 'date', variable: 'report.meta.date' },
                  { field: 'birthDate', variable: 'user.birthDate' },
                  { field: 'stars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'dateStars', variable: 'report.meta.dateStarsJsonString' },
                ],
              },
            },
          ],
        },
      },
    ],
  },
};

export const defaultNatalReportTemplate = {
  _runtime: {
    fields: [
      {
        field: 'title',
        ai: {
          template: 'report/natal-title',
          parameters: [
            { field: 'stars', variable: 'user.horoscope.starsJsonString' },
            { field: 'birthDate', variable: 'user.birthDate' },
            { field: 'longitude', variable: 'user.birthPlace.longitude' },
            { field: 'latitude', variable: 'user.birthPlace.latitude' },
          ],
        },
      },
      {
        field: 'sections',
        map: {
          iterator: 'report.sections',
          fields: [
            { field: 'icon', variable: '$item.icon' },
            { field: 'image', variable: '$item.image' },
            { field: 'iconTitle', variable: '$item.iconTitle' },
            { field: 'title', variable: '$item.title' },
            { field: 'topic', variable: '$item.topic' },
            { field: 'subtitle', variable: '$item.subtitle' },
            {
              field: 'content',
              ai: {
                template: 'report/natal-description',
                parameters: [
                  { field: 'stars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'topic', variable: '$item.topic' },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  _details_: {
    _runtime: {
      fields: [
        { field: 'icon', variable: 'reportDetail.icon' },
        { field: 'iconTitle', variable: 'reportDetail.iconTitle' },
        { field: 'title', variable: 'reportDetail.title' },
        { field: 'subtitle', variable: 'reportDetail.subtitle' },
      ],
    },
    sections: [
      {
        _id: '1',
        type: 1,
        content: '',
        image: '',
        inset: 'right',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '',
        _runtime: {
          fields: [
            {
              field: 'content',
              ai: {
                template: 'report/natal-description',
                parameters: [
                  { field: 'stars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'topic', variable: 'reportDetail.meta.topic' },
                ],
              },
            },
          ],
        },
      },
      {
        _id: '2',
        type: 1,
        content: '',
        image: '',
        inset: 'middle',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '',
        _runtime: {
          fields: [{ field: 'image', variable: 'reportDetail.image' }],
        },
      },
      {
        _id: '5',
        type: 1,
        content: '',
        image: '',
        inset: 'right',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '',
        _runtime: {
          fields: [
            {
              field: 'content',
              ai: {
                template: 'report/natal-description',
                parameters: [
                  { field: 'stars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'topic', variable: 'reportDetail.meta.topic' },
                ],
              },
            },
          ],
        },
      },
      {
        _id: '9',
        type: 1,
        content: '',
        image: '',
        inset: 'middle',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '',
        _runtime: {
          fields: [{ field: 'image', variable: 'reportDetail.image' }],
        },
      },
      {
        _id: '6',
        type: 1,
        content: '',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '#D4C9FF',
        _runtime: {
          fields: [
            { field: 'sectionTitle', translate: 'GIFT' },
            { field: 'sectionIcon', variable: 'icons.gift' },
            {
              field: 'content',
              ai: {
                template: 'report/natal-gift',
                parameters: [
                  { field: 'stars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'topic', variable: 'reportDetail.meta.topic' },
                ],
              },
            },
          ],
        },
      },
      {
        _id: '7',
        type: 1,
        content: '',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '#D4C9FF',
        _runtime: {
          fields: [
            { field: 'sectionTitle', translate: 'CHALLENGE' },
            { field: 'sectionIcon', variable: 'icons.challenge' },
            {
              field: 'content',
              ai: {
                template: 'report/natal-challenge',
                parameters: [
                  { field: 'stars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'topic', variable: 'reportDetail.meta.topic' },
                ],
              },
            },
          ],
        },
      },
      {
        _id: '8',
        type: 7,
        content: '',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '',
        _runtime: { fields: [] },
      },
    ],
  },
};

export const defaultSynastryReportTemplate = {
  _runtime: {
    fields: [
      {
        field: 'title',
        ai: {
          template: 'report/synastry-title',
          parameters: [
            { field: 'userStars', variable: 'user.horoscope.starsJsonString' },
            { field: 'secondaryUserStars', variable: 'secondaryUser.horoscope.starsJsonString' },
          ],
        },
      },
      {
        field: 'sections',
        map: {
          iterator: 'report.sections',
          fields: [
            { field: 'icon', variable: '$item.icon' },
            { field: 'image', variable: '$item.image' },
            { field: 'iconTitle', variable: '$item.iconTitle' },
            { field: 'title', variable: '$item.title' },
            { field: 'topic', variable: '$item.topic' },
            {
              field: 'content',
              ai: {
                template: 'report/synastry-description',
                parameters: [
                  { field: 'star', variable: '$item.topic' },
                  { field: 'userStars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'secondaryUserStars', variable: 'secondaryUser.horoscope.starsJsonString' },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  _details_: {
    _runtime: {
      fields: [
        { field: 'icon', variable: 'reportDetail.icon' },
        { field: 'iconTitle', variable: 'reportDetail.iconTitle' },
        { field: 'title', variable: 'reportDetail.title' },
        { field: 'subtitle', variable: 'reportDetail.subtitle' },
      ],
    },
    sections: [
      {
        _id: '1',
        type: 1,
        content: '',
        image: '',
        inset: 'right',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '',
        _runtime: {
          fields: [
            {
              field: 'content',
              ai: {
                template: 'report/synastry-description',
                parameters: [
                  { field: 'star', variable: 'reportDetail.meta.topic' },
                  { field: 'userStars', variable: 'user.horoscope.starsJsonString' },
                  { field: 'secondaryUserStars', variable: 'secondaryUser.horoscope.starsJsonString' },
                ],
              },
            },
          ],
        },
      },
      {
        _id: '2',
        type: 1,
        content: '',
        image: '',
        inset: 'middle',
        sectionTitle: '',
        sectionIcon: '',
        contentColor: '',
        titleColor: '',
        _runtime: {
          fields: [{ field: 'image', variable: 'reportDetail.image' }],
        },
      },
    ],
  },
};
