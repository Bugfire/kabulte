import type { CommonErrorResponse, MarginTradeTypeEnum, DetailExchangeEnum, AccountTypeEnum, SideEnum, ProductEnum, CashMarginEnum } from './common';
import { objectToParams, baseUrl, getApiToken } from './util';

/** 注文照会 */
const orders = async (request?: OrdersRequest): Promise<Order[]> => {
  const queryParams = new URLSearchParams(objectToParams(request ? request : {}));
  const r = await fetch(`${baseUrl()}/orders?${queryParams}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getApiToken() },
  });

  const response: OrdersResponse = await r.json();
  if (!Array.isArray(response)) {
    console.log(response);
    throw new Error(response.Message);
  }
  return response;
};

type OrdersRequest = {
  /** 取得する商品区分 */
  product?: ProductEnum;
  /** 注文番号 */
  id?: string;
  /** yyyyMMddHHmmss */
  updtime?: string;
  /** 注文詳細抑止: true もしくは未指定の場合は詳細を出力する */
  details?: boolean;
  /** 銘柄コード */
  symbol?: string;
  /** 状態 */
  state?: OrderStateEnum;
  /** 売買区分 */
  side?: SideEnum;
  /** 取引区分 */
  cashmargin?: CashMarginEnum;
};

/** 状態 */
enum OrderStateEnum {
  待機 = 1,
  処理中 = 2,
  処理済 = 3,
  訂正取消送信中 = 4,
  終了 = 5,
};

/** 執行条件 */
enum OrderTypeEnum {
  '' = 0,
  ザラバ = 1,
  寄り = 2,
  引け = 3,
  不成 = 4,
  対当指値 = 5,
  IOC = 6,
};

/** 有効期間条件 */
enum TimeInForceEnum {
  FAS = 1,
  FAK = 2,
  FOK = 3,
};

/** 受渡区分 */
enum DelivTypeEnum {
  自動振替 = 1,
  お預かり金 = 2,
};

/** 明細種別 */
enum RecTypeEnum {
  受付 = 1,
  繰越 = 2,
  期限切れ = 3,
  発注 = 4,
  訂正 = 5,
  取消 = 6,
  失効 = 7,
  約定 = 8,
};

/** 状態 */
enum DetalStateEnum {
  待機 = 1,
  処理中 = 2,
  処理済 = 3,
  エラー = 4,
  削除済み = 5,
};

type Order共通 = {
  /** 注文番号 */
  ID: string;
  /** 状態 */
  State: OrderStateEnum;
  /** 状態(Stateとどっちやねん) */
  OrderState: OrderStateEnum;
  /** 執行条件 */
  OrdType: OrderTypeEnum;
  /** 受注日時 */
  RecvTime: string;
  /** 銘柄コード */
  Symbol: string;
  /** 銘柄名 */
  SymbolName: string;
  /** 市場コード */
  Exchange: DetailExchangeEnum;
  /** 市場名 */
  ExchangeName: string;
  /** 値段 */
  Price: number;
  /** 発注数量: 注文期限切れと失効の場合は OrderQty は 0にならない。Detail の RecType をみること */
  OrderQty: number;
  /** 約定数量 */
  CumQty: number;
  /** 売買区分 */
  Side: SideEnum;
  /** 取引区分 */
  CashMargin: CashMarginEnum;
  /** 口座種別 */
  AccountType: AccountTypeEnum;
  /** 受渡区分 */
  DelivType: DelivTypeEnum;
  /** 注文有効期限 */
  ExpireDay: number;
  /** 注文詳細 */
  Details: OrderDetail[];
};

type OrderDetail = {
  /** 生成順序 */
  SeqNum: number;
  /** 注文詳細番号 */
  ID: string;
  /** 明細種別 */
  RecType: RecTypeEnum;
  /** 取引所番号 */
  ExchangeID: string;
  /** 状態 */
  State: DetalStateEnum;
  /** 処理時刻 */
  TransactTime: string;
  /** 執行条件 */
  OrdType: OrderTypeEnum;
  /** 値段 */
  Price: number;
  /** 数量 */
  Qty: number;
  /** 約定番号 */
  ExecutionID: string;
  /** 約定日時 */
  ExecutionDay: string;
  /** 受渡日 */
  DelivDay: number;
  /** 手数料 (RecType=8: 約定の時のみ) */
  Commission?: number;
  /** 手数料消費税 (RecType=8: 約定の時のみ) */
  CommissionTax?: number;
};

type Order現物 = Order共通 & {
};

type Order信用 = Order共通 & {
  /** 信用取引区分 */
  MarginTradeType: MarginTradeTypeEnum;
  /** プレミアム料 (注文中数量 + 約定済数量) * 単位プレミアム料、として計算されます */
  MarginPremium: number | 'None';
};

type Orderオプション = Order共通 & {
  /** 有効期間条件 */
  TimeInForce: TimeInForceEnum;
};

type Order先物 = Order共通 & {
  /** 有効期間条件 */
  TimeInForce: TimeInForceEnum;
};

type Order = Order現物 | Order信用 | Orderオプション | Order先物;
type OrdersSuccessResponse = Order[];

type OrdersResponse = OrdersSuccessResponse | CommonErrorResponse;

export type {
  Order,
  Order現物,
  Order信用,
  Orderオプション,
  Order先物,
  OrdersResponse,
};

export {
  orders,
  OrderStateEnum,
  RecTypeEnum,
  DetalStateEnum,
  OrderTypeEnum,
}
