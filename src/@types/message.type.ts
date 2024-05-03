export type ResponseData<Data> = {
  typeError: string;
  data?: Data | null;
  message: string;
  status: string;
};
