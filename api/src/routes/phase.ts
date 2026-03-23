import { auth, user } from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';
import Joi from 'joi';

import getHoroscope, {
  BIRTH_DATE_SCHEMA,
  BIRTH_PLACE_SCHEMA,
  HOROSCOPE_DATA_SCHEMA,
  getHoroscopeData,
} from '../libs/horoscope';
import { nextReportDetailId } from '../store/models/report-detail';
import { HoroscopeChartData, HoroscopeStars } from '../store/models/user';

const HOROSCOPE_DATA_SCHEMA_WITH_DEFAULT_HOROSCOPE = HOROSCOPE_DATA_SCHEMA.default((parent: any) => {
  return getHoroscopeData(getHoroscope(parent));
});

const router = Router();

const phaseByDateBodySchema = Joi.object<{
  date: string;
  user: {
    birthDate: string;
    birthPlace: { address: string; longitude: number; latitude: number };
    horoscope: { stars: HoroscopeStars; chartData: HoroscopeChartData };
  };
}>({
  date: Joi.string().isoDate().required(),
  user: Joi.object({
    birthDate: BIRTH_DATE_SCHEMA.required(),
    birthPlace: BIRTH_PLACE_SCHEMA.required(),
    horoscope: HOROSCOPE_DATA_SCHEMA_WITH_DEFAULT_HOROSCOPE,
  }).required(),
});

router.post('/report', user(), auth(), async (req, res) => {
  await phaseByDateBodySchema.validateAsync(req.body, { stripUnknown: true });

  res.json({
    id: nextReportDetailId(),
    sections: [
      {
        title: 'Moon in Cancer',
        content:
          'The energy of family warmth, comfort, care for loved ones. There is increased contact with the emotions and the body, which is favorable for self-exploration.',
        image: 'https://www.aistro.io/image-bin/uploads/613384d3cd2d57e5bd4668cf64cd3e3b.jpeg',
      },
      {
        title: 'Mercury Retrograde',
        content:
          'Mercury rules communication, information, electronics and travel. When Mercury is retrograde, it is often associated with communication confusion, technical problems, traffic delays, misunderstandings, and rethinking decisions',
        image: 'https://www.aistro.io/image-bin/uploads/5a36d072b5ae518e478b7737d58cdb5d.png',
      },
      {
        title: 'Mercury Retrograde',
        content:
          'Mercury rules communication, information, electronics and travel. When Mercury is retrograde, it is often associated with communication confusion, technical problems, traffic delays, misunderstandings, and rethinking decisions',
        image: 'https://www.aistro.io/image-bin/uploads/cdca4c623c4b59a26f35cf043140996a.jpeg',
      },
      {
        title: 'Mercury Retrograde',
        content:
          'Mercury rules communication, information, electronics and travel. When Mercury is retrograde, it is often associated with communication confusion, technical problems, traffic delays, misunderstandings, and rethinking decisions',
        image: 'https://www.aistro.io/image-bin/uploads/937ad04bf69b1e839f57b7f354c409cc.jpeg',
      },
    ],
  });
});

export default router;
