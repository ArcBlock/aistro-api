import { component } from '@blocklet/sdk/lib/middlewares';
import dayjs from 'dayjs';
import { Router } from 'express';

import { generateNatalReport as generateNatalReportAI } from '../ai/reports/natal';
import { generatePredictReport as generatePredictReportAI } from '../ai/reports/predict';
import getHoroscope, { getHoroscopeData, getHoroscopeString } from '../libs/horoscope';
import { parseLanguage } from '../libs/language';
import logger from '../libs/logger';
import User from '../store/models/user';

const router = Router();
/**
 * @api {post} /function-call/report/:type
 * if type is predict : need provide date/dateType
 *
 * NOTE: In the old project this route relied on report.ts's generateReport()
 * and mergeResult() which had deep coupling to the old AIGNE runtime template
 * engine. In the new project we call the local AI report generators directly
 * and return a simplified response.
 */
router.post('/report/:type(predict|natal)', component.verifySig, async (req, res) => {
  const { did: userId } = req.body!;
  const user = await User.findByPk(userId, { rejectOnEmpty: new Error('User not found') });
  const parsedDate = dayjs(req.body.date);
  const formatDate = parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
  if (!user.birthDate || !user.birthPlace)
    return res.json({ content: '', error: 'user birthDate or birthPlace not found' });

  const language = parseLanguage((req.query.language as string) || req.body.language);
  const horoscope = getHoroscopeData(getHoroscope({ birthDate: user.birthDate, birthPlace: user.birthPlace }));
  const stars = getHoroscopeString(horoscope.stars);

  logger.debug('function-call report: before generate', { userId, type: req.params.type });

  if (req.params.type === 'predict') {
    const dateHoroscope = getHoroscopeData(getHoroscope({ birthDate: formatDate, birthPlace: user.birthPlace }));
    const dateStars = getHoroscopeString(dateHoroscope.stars);

    const report = await generatePredictReportAI({
      stars,
      dateStars,
      date: formatDate,
      language,
    });

    const content = `${report.summary}\n${report.sections
      .map((s) => `${s.overview}\n${s.strengths}\n${s.challenges}`)
      .join('\n')}`;

    return res.json({
      content,
      meta: {
        stars: horoscope.stars,
      },
    });
  }

  if (req.params.type === 'natal') {
    const report = await generateNatalReportAI({
      birthDate: user.birthDate,
      stars,
      language,
    });

    const content = report.sections.map((s) => s.description).join('\n');

    return res.json({
      content,
      meta: {
        stars: horoscope.stars,
      },
    });
  }

  return res.json({ content: '' });
});

export default router;
