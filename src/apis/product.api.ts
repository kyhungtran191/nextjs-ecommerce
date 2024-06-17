import { URL } from ".";

const INDEX = `${URL}/products`;

export const ProductAPI = {
  ADMIN: `${INDEX}`,
  PUBLIC: `${INDEX}/public`,
  RELATED: `${INDEX}/related`,
};
