import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import dsbridge from 'dsbridge';

import Share from '../icons/share1.svg?react';
import { isInAistroClient } from '../libs/utils';
import ReadMoreText from './readmore-text';

const Card = styled(Box)`
  .content {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #ffffff;
    text-align: left;
    word-break: break-word;
    white-space: break-spaces;
  }

  .image {
    width: 120px;
    height: 0px;
  }

  .action {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 1;
    text-align: center;

    .ask {
      color: #9e5bf3;
      cursor: pointer;
      padding: 0 8px;
    }

    .share {
      color: #ffffff;
      cursor: pointer;
      padding: 8px;
    }
  }
`;

function Item({ image, content, index }: { image?: string; content: string; index: number }) {
  const { t } = useLocaleContext();
  const inPhone = isInAistroClient();

  return (
    <Card>
      <Box className="content" mt={2}>
        <ReadMoreText text={content} />
      </Box>

      <Box display="flex" position="relative" width={1} justifyContent="space-between">
        <Box className="image" sx={{ order: 2 }}>
          {image && <img src={image} alt="" />}
        </Box>

        <Box sx={{ order: index % 2 === 0 ? 3 : 1 }}>
          <Box mt={2.5} className="action" display="flex">
            {/* <Box
                className="ask"
                display="flex"
                alignItems="center"
                onClick={() => {
                  dsbridge.call('openShareContent');
                }}>
                <SvgIcon component={Ask} viewBox="0 0 14 15" style={{ width: 14, height: 14, marginRight: 8 }} />
                <Box>{t('my.ask')}</Box>
              </Box>

              <Divider orientation="vertical" variant="middle" flexItem sx={{ background: 'rgba(255, 255, 255, 0.2)' }} /> */}

            {inPhone && (
              <Box
                className="share"
                display="flex"
                alignItems="center"
                onClick={() => {
                  dsbridge.call('openShareContent', JSON.stringify({ msg: content }));
                }}>
                <SvgIcon
                  component={Share}
                  viewBox="0 0 14 15"
                  style={{ width: 14, height: 14, marginRight: 8, color: '#fff' }}
                />
                <Box>{t('my.share')}</Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default Item;
