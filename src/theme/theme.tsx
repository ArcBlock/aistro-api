import { createTheme, inputBaseClasses, inputClasses } from '@mui/material';

export const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: { variant: 'standard' },
      variants: [
        {
          props: {},
          style: ({ theme }) =>
            theme.unstable_sx({
              [`.${inputClasses.root}`]: {
                ':before,:after': { display: 'none' },
              },
              [`.${inputBaseClasses.input}`]: {
                m: 0,
                p: 0,
                lineHeight: 1,
              },
            }),
        },
      ],
    },
  },
});
