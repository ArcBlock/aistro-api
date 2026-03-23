import Dashboard from '@blocklet/ui-react/lib/Dashboard';
import styled from '@emotion/styled';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import numbro from 'numbro';
import * as React from 'react';
import ReactNumberTicker from 'react-animate-number-ticker';
import 'react-animate-number-ticker/dist/index.css';

import axios from '../../../libs/api';
import { useSubscription } from '../../../libs/ws';

function Home() {
  const [data, setData] = React.useState<any>({});

  const getAdminData = async () => {
    try {
      const data = await axios.get('/api/fortune/report_analysis');
      if (data.data.code === 0) {
        setData(data.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    getAdminData();
  }, []);

  useSubscription('new-fortune-record-added-or-updated', () => {
    getAdminData();
  });

  return (
    <Div
      meta={undefined}
      fallbackUrl={undefined}
      invalidPathFallback={undefined}
      headerAddons={undefined}
      sessionManagerProps={undefined}
      links={undefined}
      showDomainWarningDialog={undefined}>
      <div className="header">
        {Object.keys(data).map((key) => {
          return (
            <React.Fragment key={key}>
              <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                {`${key} 概览`}
              </Typography>
              <List
                sx={{
                  width: '100%',
                  display: 'flex',
                  margin: '10px 0',
                }}>
                <ListItem>
                  <ListItemText
                    primary="总记录数"
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <ReactNumberTicker number={numbro(data[key].totalRecords).format({ thousandSeparated: true })} />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="已完成的"
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <ReactNumberTicker
                        number={numbro(data[key].totalCompleted).format({ thousandSeparated: true })}
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="生成中的"
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <ReactNumberTicker
                        number={numbro(data[key].totalGenerating).format({ thousandSeparated: true })}
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="失败的"
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <ReactNumberTicker number={numbro(data[key].totalError).format({ thousandSeparated: true })} />
                    }
                  />
                </ListItem>
              </List>
            </React.Fragment>
          );
        })}
      </div>
    </Div>
  );
}

export default Home;

const Div = styled(Dashboard as React.FC<any>)`
  background-color: #fff;
  .header {
    margin-top: 20px;
    .MuiListItem-root {
      border-left: 2px solid rgba(0, 0, 0, 0.87);
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      .MuiListItemText-secondary {
        font-weight: bold;
        font-size: 28px;
        color: #333;
      }
    }
  }
`;
