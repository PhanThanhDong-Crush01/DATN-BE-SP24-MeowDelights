export interface Voucher {
  _idvoucher: number;
  codevc: number;
  status: string;
  decrease: number;
  expiry: string; //hạn sử dụng
  conditions: number;
}
