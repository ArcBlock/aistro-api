import { Box, Tooltip } from '@mui/material';
import { ReactNode, useState } from 'react';

export default function CopyText({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);

  return (
    <Tooltip title={copied ? 'Copied' : 'Click to Copy'} onClose={() => setCopied(false)} placement="top">
      <Box
        component="span"
        sx={{ cursor: 'pointer' }}
        onClick={
          typeof children === 'string'
            ? () => {
                navigator.clipboard.writeText(children);
                setCopied(true);
              }
            : undefined
        }>
        {children}
      </Box>
    </Tooltip>
  );
}
