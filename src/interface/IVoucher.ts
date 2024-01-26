export interface IVoucher {
  _idvoucher: string;
  codevc: string;
  status: string;
  decrease: number;
  expiry: string; //hạn sử dụng
  conditions: string; /// điều kiện
}
