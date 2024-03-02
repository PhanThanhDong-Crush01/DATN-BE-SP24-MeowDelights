export interface IVoucher {
  _id: string;
  name: string;
  status: string;
  decrease: number;
  quantity: number;
  expiry: string; //hạn sử dụng
  conditions: string; /// điều kiện
  idTypeVoucher: string;
}
