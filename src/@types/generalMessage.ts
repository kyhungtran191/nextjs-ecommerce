export type Response<Data> = {
  typeError: string;
  data: Data | null;
  message: string;
  status: string;
};
