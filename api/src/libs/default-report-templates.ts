export const defaultPredictReportTemplate = {
  _runtime: {
    fields: [
      {
        field: 'title',
        ai: {
          template: '20231102124329-m3BSHg',
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
          template: '20231102124453-VhDVWq',
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
            {
              field: 'image',
              blender: {
                template: 'icons.blender[$item.topic]',
                default: 'icons.blender.predictDefault',
                vip: {
                  template: 'icons.blender.vip[$item.topic]',
                  default: 'icons.blender.predictDefault',
                },
              },
            },
            { field: 'title', variable: '$item.title' },
            { field: 'topic', variable: '$item.topic' },
            {
              field: 'content',
              ai: {
                template: '20231102124538-PNxeoR',
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
                template: '20231102124538-PNxeoR',
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
          fields: [
            {
              field: 'image',
              blender: {
                template: 'icons.blender[reportDetail.meta.topic]',
                default: 'icons.blender.predictDefault',
                vip: {
                  template: 'icons.blender.vip[reportDetail.meta.topic]',
                  default: 'icons.blender.predictDefault',
                },
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
                template: '20231102124702-h44hG0',
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
                template: '20231102124739-GVcACb',
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
                template: '20231102124815-uKn670',
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
          template: '20231102124904-yeCsm3',
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
            {
              field: 'image',
              blender: {
                template: 'icons.blender[$item.sign]',
                vip: { template: 'icons.blender.vip[$item.sign]' },
              },
            },
            { field: 'iconTitle', variable: '$item.iconTitle' },
            { field: 'title', variable: '$item.title' },
            { field: 'topic', variable: '$item.topic' },
            { field: 'subtitle', variable: '$item.subtitle' },
            {
              field: 'content',
              ai: {
                template: '20231102125036-AioDuk',
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
                template: '20231102125036-AioDuk',
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
          fields: [
            {
              field: 'image',
              blender: {
                template: 'icons.blender[reportDetail.sign]',
                vip: { template: 'icons.blender.vip[reportDetail.sign]' },
              },
            },
          ],
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
                template: '20231102131101-iwDYZ2',
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
          fields: [
            {
              field: 'image',
              blender: {
                template: 'icons.blender[reportDetail.sign]',
                vip: { template: 'icons.blender.vip[reportDetail.sign]' },
              },
            },
          ],
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
                template: '20231102125524-sPm9QS',
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
                template: '20231102125915-EFcu5v',
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
