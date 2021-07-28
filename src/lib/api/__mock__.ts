import { rest } from 'msw';

const DELAY_MSEC = 300;
const MOCK_BASE_URL = 'http://mock/kabusapi';
const handlers = [];

const tokenResponse = {
  ResultCode: 0,
  Token: "xxxxxxxxxxxxxxxxxxxxxxx"
};

handlers.push(rest.post(`${MOCK_BASE_URL}/token`, (_req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.delay(DELAY_MSEC),
    ctx.json(tokenResponse),
  );
}));

const walletCashResponse = {
  StockAccountWallet: 12345678.0
};

handlers.push(rest.get(`${MOCK_BASE_URL}/wallet/cash`, (_req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.delay(DELAY_MSEC),
    ctx.json(walletCashResponse),
  );
}));

const walletMarginResponse = {
  MarginAccountWallet: 123456789.0,
  DepositkeepRate: 0.0,
  ConsignmentDepositRate: null,
  CashOfConsignmentDepositRate: null
};

handlers.push(rest.get(`${MOCK_BASE_URL}/wallet/margin`, (_req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.delay(DELAY_MSEC),
    ctx.json(walletMarginResponse),
  );
}));

const ordersStockResponse = [
  {
    "ID": "20210726X1",
    "State": 5,
    "OrderState": 5,
    "OrdType": 1,
    "RecvTime": "2021-01-02T03:04:05.123456+09:00",
    "Symbol": "1234",
    "SymbolName": "銘柄1234",
    "Exchange": 9,
    "ExchangeName": "SOR",
    "Price": 0.0,
    "OrderQty": 0.0,
    "CumQty": 0.0,
    "Side": "2",
    "AccountType": 4,
    "DelivType": 2,
    "ExpireDay": 20210727,
    "Details": [
      {
        "SeqNum": 1,
        "ID": "20210726X1",
        "RecType": 1,
        "ExchangeID": null,
        "State": 3,
        "TransactTime": "2021-07-26T23:35:22.558862+09:00",
        "OrdType": 1,
        "Price": 0.0,
        "Qty": 1.0,
        "ExecutionID": null,
        "ExecutionDay": null,
        "DelivDay": 20210729,
        "Commission": 0.0,
        "CommissionTax": 0.0
      },
      {
        "SeqNum": 4,
        "ID": "20210726X2",
        "RecType": 4,
        "ExchangeID": null,
        "State": 3,
        "TransactTime": "2021-07-27T00:07:11.002596+09:00",
        "OrdType": 1,
        "Price": 0.0,
        "Qty": 1.0,
        "ExecutionID": null,
        "ExecutionDay": null,
        "DelivDay": 20210729,
        "Commission": 0.0,
        "CommissionTax": 0.0
      },
      {
        "SeqNum": 5,
        "ID": "20210726X3",
        "RecType": 6,
        "ExchangeID": null,
        "State": 3,
        "TransactTime": "2021-07-27T00:07:10.986995+09:00",
        "OrdType": null,
        "Price": null,
        "Qty": 1.0,
        "ExecutionID": null,
        "ExecutionDay": null,
        "DelivDay": 20210729,
        "Commission": 0.0,
        "CommissionTax": 0.0
      }
    ]
  }
];

const ordersMarginResponse = [
  {
    "CashMargin": 2,
    "MarginTradeType": 2,
    "MarginPremium": 0.0,
    "ID": "20210723A01N41341794",
    "State": 5,
    "OrderState": 5,
    "OrdType": 1,
    "RecvTime": "2021-07-24T01:04:28.711196+09:00",
    "Symbol": "4567",
    "SymbolName": "ほげほげほげ",
    "Exchange": 9,
    "ExchangeName": "SOR",
    "Price": 0.0,
    "OrderQty": 100.0,
    "CumQty": 100.0,
    "Side": "1",
    "AccountType": 4,
    "DelivType": 0,
    "ExpireDay": 20210726,
    "Details": [
      {
        "SeqNum": 1,
        "ID": "20210723A01N41341794",
        "RecType": 1,
        "ExchangeID": null,
        "State": 3,
        "TransactTime": "2021-07-24T01:04:28.711196+09:00",
        "OrdType": 1,
        "Price": 0.0,
        "Qty": 100.0,
        "ExecutionID": null,
        "ExecutionDay": null,
        "DelivDay": 20210728,
        "Commission": 0.0,
        "CommissionTax": 0.0
      },
      {
        "SeqNum": 4,
        "ID": "20210723B01N41341795",
        "RecType": 4,
        "ExchangeID": "nF_ReL3fS7mDK1BhZldhSwA",
        "State": 3,
        "TransactTime": "2021-07-26T07:55:22.232+09:00",
        "OrdType": 1,
        "Price": 0.0,
        "Qty": 100.0,
        "ExecutionID": null,
        "ExecutionDay": null,
        "DelivDay": 20210728,
        "Commission": 0.0,
        "CommissionTax": 0.0
      },
      {
        "SeqNum": 5,
        "ID": "20210726E01N41559946",
        "RecType": 8,
        "ExchangeID": "169",
        "State": 3,
        "TransactTime": "2021-07-26T09:00:00.053+09:00",
        "OrdType": 0,
        "Price": 1189.0,
        "Qty": 100.0,
        "ExecutionID": "E20210726003ZN",
        "ExecutionDay": "2021-07-26T09:00:00.053+09:00",
        "DelivDay": 20210728,
        "Commission": 0.0,
        "CommissionTax": 0.0
      }
    ]
  },
  {
    "CashMargin": 2,
    "MarginTradeType": 2,
    "MarginPremium": null,
    "ID": "20210723A01N41341804",
    "State": 5,
    "OrderState": 5,
    "OrdType": 1,
    "RecvTime": "2021-07-24T01:06:46.244322+09:00",
    "Symbol": "4567",
    "SymbolName": "ほげほげほげ",
    "Exchange": 9,
    "ExchangeName": "SOR",
    "Price": 0.0,
    "OrderQty": 100.0,
    "CumQty": 100.0,
    "Side": "2",
    "AccountType": 4,
    "DelivType": 0,
    "ExpireDay": 20210726,
    "Details": [
      {
        "SeqNum": 1,
        "ID": "20210723A01N41341804",
        "RecType": 1,
        "ExchangeID": null,
        "State": 3,
        "TransactTime": "2021-07-24T01:06:46.244322+09:00",
        "OrdType": 1,
        "Price": 0.0,
        "Qty": 100.0,
        "ExecutionID": null,
        "ExecutionDay": null,
        "DelivDay": 20210728,
        "Commission": 0.0,
        "CommissionTax": 0.0
      },
      {
        "SeqNum": 4,
        "ID": "20210723B01N41341805",
        "RecType": 4,
        "ExchangeID": "oP4UniiKSrq_n9GMrGDpWgA",
        "State": 3,
        "TransactTime": "2021-07-26T07:55:22.287+09:00",
        "OrdType": 1,
        "Price": 0.0,
        "Qty": 100.0,
        "ExecutionID": null,
        "ExecutionDay": null,
        "DelivDay": 20210728,
        "Commission": 0.0,
        "CommissionTax": 0.0
      },
      {
        "SeqNum": 5,
        "ID": "20210726E01N41559977",
        "RecType": 8,
        "ExchangeID": "7",
        "State": 3,
        "TransactTime": "2021-07-26T09:00:00.053+09:00",
        "OrdType": 0,
        "Price": 1189.0,
        "Qty": 100.0,
        "ExecutionID": "E20210726004G5",
        "ExecutionDay": "2021-07-26T09:00:00.053+09:00",
        "DelivDay": 20210728,
        "Commission": 0.0,
        "CommissionTax": 0.0
      }]
  }
];

handlers.push(rest.get(`${MOCK_BASE_URL}/orders`, (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.delay(DELAY_MSEC),
    ctx.json(req.url.search === '?product=1' ? ordersStockResponse : ordersMarginResponse),
  );
}));

const positionsStockResponse = [
  {
    "ExecutionID": null,
    "AccountType": 4,
    "Symbol": "1111",
    "SymbolName": "銘柄1111",
    "Exchange": 1,
    "ExchangeName": "東証１部",
    "Price": 123.0,
    "LeavesQty": 100.0,
    "HoldQty": 0.0,
    "Side": "2",
    "CurrentPrice": 456.0,
    "Valuation": 45600.0,
    "ProfitLoss": 33300.0,
    "ProfitLossRate": 200.0000000
  },
  {
    "ExecutionID": null,
    "AccountType": 4,
    "Symbol": "2222",
    "SymbolName": "メイガラガラガラガラガラ",
    "Exchange": 1,
    "ExchangeName": "東証１部",
    "Price": 1000.0,
    "LeavesQty": 1.0,
    "HoldQty": 0.0,
    "Side": "2",
    "CurrentPrice": 500.0,
    "Valuation": 1000.0,
    "ProfitLoss": -500.0,
    "ProfitLossRate": -100.0000
  },
  {
    "ExecutionID": null,
    "AccountType": 4,
    "Symbol": "3333",
    "SymbolName": "じゅげむじゅげむ",
    "Exchange": 1,
    "ExchangeName": "東証１部",
    "Price": 908.0,
    "LeavesQty": 1.0,
    "HoldQty": 0.0,
    "Side": "2",
    "CurrentPrice": 1060.0,
    "Valuation": 1060.0,
    "ProfitLoss": 152.0,
    "ProfitLossRate": 16.740088105726872246696035240
  },
  {
    "ExecutionID": null,
    "AccountType": 4,
    "Symbol": "5555",
    "SymbolName": "ゆったりとした銘柄",
    "Exchange": 1,
    "ExchangeName": "東証２部",
    "Price": 572.0,
    "LeavesQty": 1.0,
    "HoldQty": 0.0,
    "Side": "2",
    "CurrentPrice": 635.0,
    "Valuation": 635.0,
    "ProfitLoss": 63.0,
    "ProfitLossRate": 11.013986013986013986013986010
  },
  {
    "ExecutionID": null,
    "AccountType": 4,
    "Symbol": "6666",
    "SymbolName": "なんとかなる銘柄",
    "Exchange": 1,
    "ExchangeName": "東証２部",
    "Price": 1018.0,
    "LeavesQty": 100.0,
    "HoldQty": 0.0,
    "Side": "2",
    "CurrentPrice": 1035.0,
    "Valuation": 103500.0,
    "ProfitLoss": 1700.0,
    "ProfitLossRate": 1.669941060903732809430255400
  },
  {
    "ExecutionID": null,
    "AccountType": 4,
    "Symbol": "7777",
    "SymbolName": "普通の銘柄",
    "Exchange": 1,
    "ExchangeName": "東証１部",
    "Price": 1636.0,
    "LeavesQty": 2.0,
    "HoldQty": 0.0,
    "Side": "2",
    "CurrentPrice": 1687.0,
    "Valuation": 3374.0,
    "ProfitLoss": 102.0,
    "ProfitLossRate": 3.1173594132029339853300733500
  },
  {
    "ExecutionID": null,
    "AccountType": 4,
    "Symbol": "8888",
    "SymbolName": "とても長い名前の銘柄です、とても長い名前の銘柄です",
    "Exchange": 1,
    "ExchangeName": "東証JQス",
    "Price": 911.0,
    "LeavesQty": 100.0,
    "HoldQty": 0.0,
    "Side": "2",
    "CurrentPrice": 935.0,
    "Valuation": 93500.0,
    "ProfitLoss": 2400.0,
    "ProfitLossRate": 2.634467618002195389681668500
  },
  {
    "ExecutionID": null,
    "AccountType": 4,
    "Symbol": "9999",
    "SymbolName": "何か",
    "Exchange": 1,
    "ExchangeName": "東証１部",
    "Price": 1560.0,
    "LeavesQty": 100.0,
    "HoldQty": 0.0,
    "Side": "2",
    "CurrentPrice": 2011.0,
    "Valuation": 201100.0,
    "ProfitLoss": 45100.0,
    "ProfitLossRate": 28.910256410256410256410256410
  }
];

const positionsMarginResponse = [
  {
    "MarginTradeType": 2,
    "ExecutionDay": 20210726,
    "Expenses": 14.0,
    "Commission": 0.0,
    "CommissionTax": 0.0,
    "ExpireDay": 20310724,
    "ExecutionID": "E20210726003ZN",
    "AccountType": 4,
    "Symbol": "4567",
    "SymbolName": "ほげほげほげ",
    "Exchange": 1,
    "ExchangeName": "東証１部",
    "Price": 1189.0,
    "LeavesQty": 100.0,
    "HoldQty": 0.0,
    "Side": "1",
    "CurrentPrice": 1199.0,
    "Valuation": 119900.0,
    "ProfitLoss": -1014.0,
    "ProfitLossRate": -0.345
  },
  {
    "MarginTradeType": 2,
    "ExecutionDay": 20210726,
    "Expenses": 27.0,
    "Commission": 0.0,
    "CommissionTax": 0.0,
    "ExpireDay": 20310724,
    "ExecutionID": "E20210726XXX5",
    "AccountType": 4,
    "Symbol": "4567",
    "SymbolName": "ほげほげほげ",
    "Exchange": 1,
    "ExchangeName": "東証１部",
    "Price": 1189.0,
    "LeavesQty": 100.0,
    "HoldQty": 0.0,
    "Side": "2",
    "CurrentPrice": 1199.0,
    "Valuation": 119900.0,
    "ProfitLoss": 973.0,
    "ProfitLossRate": 0.123
  }
];

handlers.push(rest.get(`${MOCK_BASE_URL}/positions`, (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.delay(DELAY_MSEC),
    ctx.json(req.url.search === '?product=1' ? positionsStockResponse : positionsMarginResponse),
  );
}));

export { handlers };
