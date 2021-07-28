import { setValue, getValue } from '$lib/storage';
import type { ApiEnv } from '$lib/const';
import { getApiHost } from '$lib/const';

/** 以下SessionStore/Cookie に保持する時のキー */

/** API Token */
const API_TOKEN_KEY = 'API_TOKEN';
/** API Env */
const API_ENV_KEY = "API_ENV";

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

/** API Token を保持しているか返す。有効かどうかは使ってみないとわからない */
const hasAPIToken = (): boolean => {
  const apiKey = getValue(API_TOKEN_KEY);
  return apiKey !== null && apiKey !== '';
};

/** API Token を削除する */
const clearAPIToken = (): void => {
  setValue(API_TOKEN_KEY, '');
};

/** API Host を取得する */
const getApiEnv = (): ApiEnv => {
  const apiEnv = getValue(API_ENV_KEY);
  switch (apiEnv) {
    default:
    case 'prod':
      return 'prod';
    case 'dev':
      return 'dev';
    case 'mock':
      return 'mock';
  }
};

/** API の URL prefix を取得する */
const baseUrl = (): string => {
  return `${getApiHost(getApiEnv())}/kabusapi`;
}

/** APIキーを取得します */
const getAPIKey = (): string => {
  const apiKey = getValue(API_TOKEN_KEY);
  if (apiKey === null || apiKey === '') {
    throw new Error('APIキーが未設定です');
  }
  return apiKey;
};

/** トークン発行: APIパスワードを渡し、API Token を取得する */
const getAPIToken = async (apiPassword: string, apiKey: string): Promise<string> => {
  setValue(API_TOKEN_KEY, '');
  setValue(API_ENV_KEY, apiKey);

  const r = await fetch(`${baseUrl()}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify({ APIpassword: apiPassword } as TokenRequest),
  });

  const response: TokenResponse = await r.json();
  if (response.ResultCode !== 0) {
    console.error(response);
    throw Error(response.Message);
  }
  setValue(API_TOKEN_KEY, response.Token);
  return response.Token;
};

type TokenRequest = {
  APIpassword: string;
};

type TokenSuccessResponse = {
  ResultCode: 0;
  Token: string;
};

type TokenErrorResponse = {
  /** 他のコードもあるかもしれないが、とりあえず 0 以外であればコード的には十分 */
  ResultCode: 4001007;
  Message: string;
};

type TokenResponse = TokenSuccessResponse | TokenErrorResponse;

const objectToParams = (object: Record<string, unknown>): Record<string, string> => {
  const r: Record<string, string> = {};
  Object.keys(object).forEach(key => {
    r[key] = `${object[key]}`;
  });
  return r;
};

/** 残高照会 */
const positions = async (request?: PositionsRequest): Promise<Position[]> => {
  const queryParams = new URLSearchParams(objectToParams(request ? request : {}));
  const r = await fetch(`${baseUrl()}/positions?${queryParams}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getAPIKey() },
  });

  const response: PositionsResponse = await r.json();
  if (!Array.isArray(response)) {
    console.log(response);
    throw new Error(response.Message);
  }
  return response;
};

type PositionsRequest = {
  /** 取得する商品区分 */
  product?: ProductEnum,
  /** 銘柄コード */
  symbol?: string;
  /** 売買区分 */
  side?: SideEnum,
  /** 追加情報指定フラグ: 現在値・評価金額・評価損益額・評価損益率 */
  addinfo?: boolean;
};

/** 市場コード */
enum PositionExchangeEnum {
  東証 = 1,
  名証 = 3,
  福証 = 5,
  札証 = 6,
  日通し = 2,
  日中 = 23,
  夜間 = 24,
};

type Position共通 = {
  /** 口座種別 */
  AccountType: AccountTypeEnum;
  /** 銘柄コード */
  Symbol: string;
  /** 銘柄名 */
  SymbolName: string;
  /** 市場コード */
  Exchange: PositionExchangeEnum;
  /** 市場名 */
  ExchangeName: string;
  /** 値段 */
  Price: number;
  /** 残数量 */
  LeavesQty: number;
  /** 拘束数量（保有数量） */
  HoldQty: number;
  /** 売買区分 */
  Side: SideEnum;
  /** 現在値: 追加情報フラグがfalseの場合はnull */
  CurrentPrice: number | null;
  /** 評価金額: 追加情報フラグがfalseの場合はnull */
  Valuation: number | null;
  /** 評価損益額: 追加情報フラグがfalseの場合はnull */
  ProfitLoss: number | null;
  /** 評価損益率: 追加情報フラグがfalseの場合はnull */
  ProfitLossRate: number | null;
};

type Position現物 = Position共通 & {
  /** 約定番号: 現物の場合は null */
  ExecutionID: null;
  /** 約定日(建玉日): 現物の場合は null、ドキュメントにはあるが実際には undefined */
  // ExecutionDay: null;
};

type Position信用 = Position共通 & {
  /** 約定番号 */
  ExecutionID: string;
  /** 約定日(建玉日): 信用・先物・オプションの場合のみ */
  ExecutionDay: number;
  /** 諸経費: 信用・先物・オプションの場合のみ */
  Expenses: number;
  /** 手数料: 信用・先物・オプションの場合のみ */
  Commission: number;
  /** 手数料消費税: 信用・先物・オプションの場合のみ */
  CommissionTax: number;
  /** 返済期日: 信用・先物・オプションの場合のみ */
  ExpireDay: number;
  /** 信用取引区分 */
  MarginTradeType: MarginTradeTypeEnum;
};

type Positionオプション = Position共通 & {
  /** 約定番号 */
  ExecutionID: string;
  /** 銘柄種別: 先物・オプション銘柄の場合のみ */
  SecurityType?: number;
  /** 約定日(建玉日): 信用・先物・オプションの場合のみ */
  ExecutionDay: number;
  /** 諸経費: 信用・先物・オプションの場合のみ */
  Expenses: number;
  /** 手数料: 信用・先物・オプションの場合のみ */
  Commission: number;
  /** 手数料消費税: 信用・先物・オプションの場合のみ */
  CommissionTax: number;
  /** 返済期日: 信用・先物・オプションの場合のみ */
  ExpireDay: number;
};

type Position先物 = Position共通 & {
  /** 約定番号 */
  ExecutionID: string;
  /** 銘柄種別: 先物・オプション銘柄の場合のみ */
  SecurityType?: number;
  /** 約定日(建玉日): 信用・先物・オプションの場合のみ */
  ExecutionDay: number;
  /** 諸経費: 信用・先物・オプションの場合のみ */
  Expenses: number;
  /** 手数料: 信用・先物・オプションの場合のみ */
  Commission: number;
  /** 手数料消費税: 信用・先物・オプションの場合のみ */
  CommissionTax: number;
  /** 返済期日: 信用・先物・オプションの場合のみ */
  ExpireDay: number;
};

type Position = Position現物 | Position信用 | Positionオプション | Position先物;
type PositionsSuccessResponse = Position[];
type PositionsErrorResponse = {
  Code: number;
  Message: string;
};

type PositionsResponse = PositionsSuccessResponse | PositionsErrorResponse;

/** 注文照会 */
const orders = async (request?: OrdersRequest): Promise<Order[]> => {
  const queryParams = new URLSearchParams(objectToParams(request ? request : {}));
  const r = await fetch(`${baseUrl()}/orders?${queryParams}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getAPIKey() },
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

/** 市場コード */
enum OrderExchangeEnum {
  東証 = 1,
  名証 = 3,
  福証 = 5,
  札証 = 6,
  SOR = 9,
  日通し = 2,
  日中 = 23,
  夜間 = 24,
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

type OrdersErrorResponse = {
  Code: number;
  Message: string;
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
  Exchange: OrderExchangeEnum;
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

type OrdersResponse = OrdersSuccessResponse | OrdersErrorResponse;

/** 取引余力(現物) */
const walletCash = async (): Promise<number> => {
  const r = await fetch(`${baseUrl()}/wallet/cash`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getAPIKey() },
  });

  const response: WalletCashResponse = await r.json();
  if (r.status !== 200) {
    const errResponse = response as WalletCashErrorResponse;
    console.log(response);
    throw new Error(errResponse.Message);
  } else {
    const sucResponse = response as WalletCashSuccessResponse;
    return sucResponse.StockAccountWallet;
  }
};

type WalletCashSuccessResponse = {
  StockAccountWallet: number;
};

type WalletCashErrorResponse = {
  Code: number;
  Message: string;
}

type WalletCashResponse = WalletCashSuccessResponse | WalletCashErrorResponse;

/** 取引余力(信用) */
const walletMargin = async (): Promise<number> => {
  const r = await fetch(`${baseUrl()}/wallet/margin`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getAPIKey() },
  });

  const response: WalletMarginResponse = await r.json();
  if (r.status !== 200) {
    const errResponse = response as WalletMarginErrorResponse;
    console.log(response);
    throw new Error(errResponse.Message);
  } else {
    const sucResponse = response as WalletMarginSuccessResponse;
    return sucResponse.MarginAccountWallet;
  }
};

type WalletMarginSuccessResponse = {
  MarginAccountWallet: number;
  DepositkeepRate: number;
  ConsignmentDepositRate: number | 'None';
  CashOfConsignmentDepositRate: number | 'None';
};

type WalletMarginErrorResponse = {
  Code: number;
  Message: string;
}

type WalletMarginResponse = WalletMarginSuccessResponse | WalletMarginErrorResponse;

//

export type {
  Position,
  Position現物,
  Position信用,
  Positionオプション,
  Position先物,
  Order,
  Order現物,
  Order信用,
  Orderオプション,
  Order先物,
};

export {
  hasAPIToken,
  getAPIToken,
  clearAPIToken,
  getApiEnv,
  positions,
  orders,
  walletCash,
  walletMargin,
  SideEnum,
  SideEnumRev,
  ProductEnum,
  CashMarginEnum,
  OrderStateEnum,
  MarginTradeTypeEnum,
  RecTypeEnum,
  DetalStateEnum,
  OrderTypeEnum,
};

// TODO:
//   発注(現物・信用), 注文取消
//   取引余力(現物)
//   取引余力(信用)
//   優先市場
