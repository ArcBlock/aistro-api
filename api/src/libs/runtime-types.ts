export type RuntimeResult = {
  field: string;
  ai?: {
    template: string;
    builtinAnswerOriginalId: string;
  };
  variable?: {
    variable: string;
    result: any;
  };
  map?: {
    iterator: string;
    result: (RuntimeResult[] | undefined)[];
  };
  translate?: {
    original: string;
    translation: string;
  };
  blender?: {
    sn: number;
  };
};
