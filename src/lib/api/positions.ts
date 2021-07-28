import type { CommonErrorResponse, MarginTradeTypeEnum, DetailExchangeEnum, AccountTypeEnum, SideEnum, ProductEnum } from './common';
import { objectToParams, baseUrl, getApiToken } from './util';

/** 残高照会 */
const positions = async (request?: PositionsRequest): Promise<Position[]> => {
  const queryParams = new URLSearchParams(objectToParams(request ? request : {}));
  const r = await fetch(`${baseUrl()}/positions?${queryParams}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': getApiToken() },
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

type Position共通 = {
  /** 口座種別 */
  AccountType: AccountTypeEnum;
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

type PositionsResponse = PositionsSuccessResponse | CommonErrorResponse;

export type {
  Position,
  Position現物,
  Position信用,
  Positionオプション,
  Position先物,
};

export {
  positions,
};
