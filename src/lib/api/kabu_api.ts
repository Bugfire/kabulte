import { setValue } from '$lib/storage';
import type { CommonErrorResponse } from './common';
import { baseUrl, getApiToken, API_TOKEN_KEY, API_ENV_KEY } from './util';
import { SideEnum, StockExchangeEnum, DetailExchangeEnum, CashMarginEnum, AccountTypeEnum, MarginTradeTypeEnum } from './common';

/** 銘柄情報 */
type SymbolDef = {
  /** 銘柄コード */
  Symbol: string;
  /** 銘柄名 */
  SymbolName: string;
  /** 銘柄略称 */
  DisplayName: string;
  /** 市場コード */
  Exchange: DetailExchangeEnum;
  /** 市場名称 */
  ExchangeName: string;
  /** 業種コード名: 0050 水産・農林業 etc... */
  BisCategory: string;
  /** 時価総額: detail が false の場合は null */
  TotalMarketValue?: number | null;
  /** 発行済み株式数 (千株): detail が false の場合は null */
  TotalStocks?: number | null;
  /** 売買単位 */
  TradingUnit: number;
  /** 決算期日 */
  FiscalYearEndBasic: number;
  /** 呼値グループ */
  PriceRangeGroup: string;
  /** 一般信用買建フラグ: true のとき一般信用買建可能 */
  KCMarginBuy: boolean;
  /** 一般信用売建フラグ: true のとき一般信用売建可能 */
  KCMarginSell: boolean;
  /** 制度信用買建フラグ: true のとき制度信用買建可能 */
  MarginBuy: boolean;
  /** 制度信用売建フラグ: true のとき制度信用売建可能 */
  MarginSell: boolean;
  /** 値幅上限 */
  UpperLimit: number;
  /** 値幅下限 */
  LowerLimit: number;
  /** 原資産コード: NK225=日経225 */
  Underlyer: string;
  /** 限月-年月 yyyy-mm: 先物・オプションの場合のみ */
  DerivMonth?: string;
  /** 取引開始日: 先物・オプションの場合のみ */
  TradeStart?: number;
  /** 権利行使価格: オプションの場合のみ */
  StrikePrice?: number;
  /** プット/コール区分: 1=Put 2=Call: オプションの場合のみ */
  PutOrCall?: number;
  /** 精算値: 先物銘柄の場合のみ */
  ClearingPrice?: number;
};

/** トークン発行: APIパスワードを渡し、API Token を取得する */
const generateToken = async (apiPassword: string, apiKey: string): Promise<string> => {
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

/** 取引余力(現物) */
const walletCash = async (): Promise<number> => {
  const r = await fetch(`${baseUrl()}/wallet/cash`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getApiToken() },
  });

  const response: WalletCashResponse = await r.json();
  if (r.status !== 200) {
    const errResponse = response as CommonErrorResponse;
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

type WalletCashResponse = WalletCashSuccessResponse | CommonErrorResponse;

/** 取引余力(信用) */
const walletMargin = async (): Promise<number> => {
  const r = await fetch(`${baseUrl()}/wallet/margin`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getApiToken() },
  });

  const response: WalletMarginResponse = await r.json();
  if (r.status !== 200) {
    const errResponse = response as CommonErrorResponse;
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

type WalletMarginResponse = WalletMarginSuccessResponse | CommonErrorResponse;

/** 注文発注 (現物) */
const sendorderStock = async (req: SendorderStockRequest): Promise<void> => {
  const r = await fetch(`${baseUrl()}/sendorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getApiToken() },
    body: JSON.stringify(req),
  });

  const response: SendorderResponse = await r.json();
  if (r.status !== 200) {
    const errResponse = response as CommonErrorResponse;
    console.log(response);
    throw new Error(`発注に失敗しました ${errResponse.Message}`);
  } else {
    return;
  }
};

/** 注文発注 (信用) */
const sendorderMargin = async (req: SendorderMarginRequest): Promise<void> => {
  const r = await fetch(`${baseUrl()}/sendorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getApiToken() },
    body: JSON.stringify(req),
  });

  const response: SendorderResponse = await r.json();
  if (r.status !== 200) {
    const errResponse = response as CommonErrorResponse;
    console.log(response);
    throw new Error(`発注に失敗しました ${errResponse.Message}`);
  } else {
    return;
  }
};

type SendorderRequestCommon = {
  /** 注文パスワード */
  Password: string;
  /** 銘柄コード */
  Symbol: string;
  /** 市場コード */
  Exchange: StockExchangeEnum;
  /** 売買区分 */
  Side: SideEnum;
  /** 口座種別 */
  AccountType: AccountTypeEnum;
  /** 注文数量 */
  Qty: number;
  /** 執行条件 */
  FrontOrderType: FrontOrderTypeEnum;
  /** 注文価格: 成行の場合は 0 を指定すること */
  Price: number;
  /** 注文有効期限 YYYYMMDD, 0 は本日 */
  ExpireDay: number;
  /** 逆指値条件: 面倒なので無視 (FrontRoderType.逆指値 の場合は指定する) */
  // ReverseLimitOrder: {
  // }
};

type SendorderStockRequest = SendorderRequestCommon & {
  /** 商品種別 1:株式 */
  SecurityType: 1;
  /** 信用区分 1:現物 */
  CashMargin: 1;
  /** 受渡区分: 0:指定無し */
  DelivType: 0;
  /** 資産区分: 現物売りは FundTypeEnum.現物売, 現物買はいづれか */
  FundType: FundTypeEnum;
};

type SendorderSuccessResponse = {
  /** 結果コード */
  Result: 0;
  /** 受け付け注文番号 */
  OrderId: string;
};

type SendorderResponse = SendorderSuccessResponse | CommonErrorResponse;

type SendorderMarginRequest = SendorderRequestCommon & {
  /** 商品種別 1:株式 */
  SecurityType: 1;
  /** 信用区分 */
  CashMargin: CashMarginEnum;
  /** 信用取引区分 */
  MarginTradeType: MarginTradeTypeEnum;
  /** 受渡区分: 信用新規は SendorderDelivTypeEnum.指定なし 信用返済は自動振替かお預かり金 */
  DelivType: SendorderDelivTypeEnum;
  /** 決済順序: 信用返済の場合のみ必須 0:日付(ASC)>損益(DSC) 1:日付(ASC)>損益(ASC) 2:日付(DSC)>損益(DSC) 3:日付(DSC)>損益(ASC) 4~7 もあり */
  ClosePositionOrder?: number;
  /** 返済建玉指定: 信用返済の場合のみ必須, ClosePositionOrder と ClosePositions は排他 */
  ClosePositions?: {
    /** 返済建玉ID */
    HoldID: string;
    /** 返済建玉数量 */
    Qty: number;
  }[],
};

/** 受渡区分 */
enum SendorderDelivTypeEnum {
  指定なし = 0,
  自動振替 = 1,
  お預かり金 = 2,
};

/** 資産区分 */
enum FundTypeEnum {
  現物売 = '  ',
  保護 = '02',
  信用代用 = 'AA',
  信用取引 = '11',
};

/** 執行条件 */
enum FrontOrderTypeEnum {
  /** Price: 0 */
  成行 = 10,
  /** Price: 0 */
  寄成_前場 = 13,
  /** Price: 0 */
  寄成_後場 = 14,
  /** Price: 0 */
  引成_前場 = 15,
  /** Price: 0 */
  引成_後場 = 16,
  /** Price: 0 */
  IOC成行 = 17,
  指値 = 20,
  指値_前場 = 21,
  指値_後場 = 22,
  引指_前場 = 23,
  引指_後場 = 24,
  不成_前場 = 25,
  不成_後場 = 26,
  IOC指値 = 27,
  逆指値 = 30,
};

/** 優先市場 */
const primaryexchange = async (symbol: string): Promise<StockExchangeEnum> => {
  const r = await fetch(`${baseUrl()}/primaryexchange/${symbol}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getApiToken() },
  });

  const response: PrimaryExchangeResponse = await r.json();
  if (r.status !== 200) {
    const errResponse = response as CommonErrorResponse;
    console.log(errResponse);
    throw new Error(errResponse.Message);
  } else {
    const sucResponse = response as PrimaryExchangeSuccessResponse;
    return sucResponse.PrimaryExchange;
  }
};

type PrimaryExchangeSuccessResponse = {
  /** 銘柄コード */
  Symbol: string;
  /** 優先市場 */
  PrimaryExchange: StockExchangeEnum;
};

type PrimaryExchangeResponse = PrimaryExchangeSuccessResponse | CommonErrorResponse;

/** 銘柄情報 */
const getSymbol = async (symbol: string): Promise<SymbolDef> => {
  const r = await fetch(`${baseUrl()}/symbol/${symbol}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getApiToken() },
  });

  const response: GetSymbolResponse = await r.json();
  if (r.status !== 200) {
    const errResponse = response as CommonErrorResponse;
    console.log(errResponse);
    throw new Error(errResponse.Message);
  } else {
    return response as SymbolDef;
  }
};

type GetSymbolResponse = SymbolDef | CommonErrorResponse;

// TODO:
//   注文取消

//

export type {
  SendorderStockRequest,
  SendorderMarginRequest,
  SymbolDef,
};

export {
  generateToken,
  walletCash,
  walletMargin,
  sendorderStock,
  sendorderMargin,
  primaryexchange,
  getSymbol,
  CashMarginEnum,
};
