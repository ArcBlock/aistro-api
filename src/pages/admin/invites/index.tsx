import Toast from '@arcblock/ux/lib/Toast';
import Dashboard from '@blocklet/ui-react/lib/Dashboard';
import styled from '@emotion/styled';
import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useMemo, useState } from 'react';
import { useAsync } from 'react-use';

import Invite from '../../../../api/src/store/models/invite';
import CopyText from '../../../components/copy-text';
import { getErrorMessage } from '../../../libs/api';
import { generateInvites, getInvites, updateInvite } from '../../../libs/invites';
import useDialog from '../../../libs/use-dialog';

export default function InvitesPage() {
  const [paginationModel, setPaginationModel] = useState<{
    page: number;
    size: number;
    public?: boolean;
    used?: boolean;
  }>({
    page: 1,
    size: 20,
    public: undefined,
    used: undefined,
  });

  const result = useAsync(() => getInvites(paginationModel), [paginationModel]);

  const columns = useColumns();

  const { dialog, showDialog } = useDialog();

  return (
    <Root
      // FIXME: remove following undefined props after issue https://github.com/ArcBlock/ux/issues/1136 solved
      meta={undefined}
      fallbackUrl={undefined}
      invalidPathFallback={undefined}
      headerAddons={undefined}
      sessionManagerProps={undefined}
      links={undefined}
      showDomainWarningDialog={undefined}>
      {dialog}

      <Box position="sticky" top={0} zIndex={1} bgcolor="white">
        <Toolbar disableGutters>
          <ToggleButtonGroup
            size="small"
            value={paginationModel.public}
            exclusive
            onChange={(_, value) =>
              setPaginationModel({
                ...paginationModel,
                public: typeof value === 'boolean' ? value : undefined,
              })
            }>
            <ToggleButton value>Public</ToggleButton>
            <ToggleButton value={false}>Private</ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            sx={{ ml: 2 }}
            size="small"
            exclusive
            value={paginationModel.used}
            onChange={(_, value) =>
              setPaginationModel({
                ...paginationModel,
                used: typeof value === 'boolean' ? value : undefined,
              })
            }>
            <ToggleButton value>Used</ToggleButton>
            <ToggleButton value={false}>Unused</ToggleButton>
          </ToggleButtonGroup>

          <Box flex={1} />

          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => {
              const form = { count: 20, public: false, usedCount: 0 };

              showDialog({
                maxWidth: 'sm',
                fullWidth: true,
                title: 'Generate invite codes',
                content: (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                    <TextField
                      size="small"
                      label="Number"
                      defaultValue={form.count}
                      onChange={(e) => (form.count = Number(Number(e.target.value).toFixed(0)))}
                    />
                    <TextField
                      size="small"
                      label="Number of random bans"
                      defaultValue={form.usedCount}
                      onChange={(e) => (form.usedCount = Number(Number(e.target.value).toFixed(0)))}
                    />
                    <FormControlLabel
                      defaultChecked={form.public}
                      onChange={(_, checked) => (form.public = checked)}
                      control={<Switch />}
                      label="Public"
                    />
                  </Box>
                ),
                onOk: async () => {
                  try {
                    await generateInvites(form);
                    setPaginationModel({ ...paginationModel });
                    Toast.success('Generated');
                  } catch (error) {
                    Toast.error(getErrorMessage(error));
                    throw error;
                  }
                },
              });
            }}>
            Generate
          </Button>
        </Toolbar>
      </Box>

      <Box>
        <DataGrid
          loading={result.loading}
          rows={result.value?.list ?? []}
          columns={columns}
          getRowId={(v) => v.id}
          autoHeight
          rowCount={result.value?.count ?? 0}
          pageSizeOptions={[10]}
          paginationModel={{
            page: paginationModel.page - 1,
            pageSize: paginationModel.size,
          }}
          disableColumnMenu
          hideFooterSelectedRowCount
          paginationMode="server"
          onPaginationModelChange={({ pageSize, page }) =>
            setPaginationModel({
              ...paginationModel,
              page: page + 1,
              size: pageSize,
            })
          }
          processRowUpdate={(updatedRow) => updateInvite(updatedRow.id, updatedRow)}
          onProcessRowUpdateError={(error) => Toast.error(getErrorMessage(error))}
        />
      </Box>
    </Root>
  );
}

const useColumns = () => {
  return useMemo<GridColDef<Invite>[]>(
    () => [
      {
        field: 'code',
        headerName: 'Code',
        flex: 1,
        sortable: false,
        renderCell: ({ row }) => <CopyText>{row.code}</CopyText>,
      },
      {
        flex: 1,
        field: 'note',
        headerName: 'Note',
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        editable: true,
      },
      {
        flex: 1,
        field: 'updatedAt',
        headerName: 'Updated At',
        headerAlign: 'center',
        align: 'center',
        sortable: false,
      },
      {
        width: 100,
        field: 'public',
        headerName: 'Public',
        headerAlign: 'center',
        align: 'center',
        sortable: false,
      },
      {
        width: 100,
        field: 'userId',
        headerName: 'Used',
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        valueGetter: ({ row }: { row: Invite }) => (row.userId ? 'true' : 'false'),
      },
    ],
    [],
  );
};

const Root = styled(Dashboard as React.FC<any>)`
  width: 100%;
  background-color: white;

  > .dashboard-body > .dashboard-main {
    > .dashboard-content {
    }

    > .dashboard-footer {
      margin-top: 0;
      padding: 0;

      .logo-container {
        svg {
          height: 100%;
        }
      }
    }
  }
`;
