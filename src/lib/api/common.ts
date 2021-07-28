
/** 商品区分 */
enum ProductEnum {
  すべて = 0,
  現物 = 1,
  信用 = 2,
  先物 = 3,
  OP = 4,
};

/** 売買区分 */
enum SideEnum {
  売 = "1",
  買 = "2",
};

/** 市場コード */
enum StockExchangeEnum {
  東証 = 1,
  名証 = 3,
  福証 = 5,
  札証 = 6,
};

/** 市場コード */
enum DetailExchangeEnum {
  東証 = 1,
  名証 = 3,
  福証 = 5,
  札証 = 6,
  SOR = 9,
  日通し = 2,
  日中 = 23,
  夜間 = 24,
};

/** string -> string は逆マップが定義されない */
const SideEnumRev = {};
Object.keys(SideEnum).forEach(v => { SideEnumRev[SideEnum[v]] = v; });

/** 取引区分 */
enum CashMarginEnum {
  新規 = 2,
  返済 = 3,
};

/** 口座種別 */
enum AccountTypeEnum {
  一般 = 2,
  特定 = 4,
  法人 = 12,
};

/** 信用取引区分 */
enum MarginTradeTypeEnum {
  制度信用 = 1,
  一般信用長期 = 2,
  一般信用デイトレ = 3,
};

/** 共通エラー */
type CommonErrorResponse = {
  Code: number;
  Message: string;
};

export type {
  CommonErrorResponse,
};

export {
  ProductEnum,
  SideEnum,
  StockExchangeEnum,
  DetailExchangeEnum,
  SideEnumRev,
  CashMarginEnum,
  AccountTypeEnum,
  MarginTradeTypeEnum,
};
