import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';

import { useSessionContext } from '../contexts/session';

function ReadMoreText({ text }: { text: string }) {
  const { t } = useLocaleContext();
  const { session } = useSessionContext();

  return (
    <div>
      <Typography>
        {text.slice(0, -1)}...
        {session.user && (
          <Button variant="text" href="aistro://aistro.io/f" style={{ cursor: 'pointer' }}>
            {t('common.viewMoreAistro')}
          </Button>
        )}
        {!session.user && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Button
            variant="text"
            onClick={() => {
              session.login();
            }}
            size="small"
            style={{ cursor: 'pointer' }}>
            {t('common.loginViewMore')}
          </Button>
        )}
      </Typography>
    </div>
  );
}

export default ReadMoreText;
