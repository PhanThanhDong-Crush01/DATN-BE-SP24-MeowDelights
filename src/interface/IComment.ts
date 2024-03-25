export interface IComment {
  _id?: string;
  billId: string;
  productId: string;
  productTypeId: string;
  userId: string;
  img: string;
  star: number;
  title: string;
  comment: string;
  ExistsInStock: boolean;
}
