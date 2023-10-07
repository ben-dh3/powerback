export type FieldControl = {
  type: string;
  name: string;
  label: string;
  'aria-label': string;
  required: boolean;
  autoComplete?: string;
  'data-lpignore'?: string;
  feedback?: string;
  pattern?: string;
  role?: string;
  formtext?: string | string[];
};
