# Moroccan Money Conversion

This context defines the language used by a Morocco-first utility for understanding values across global currencies and Moroccan money units.

## Language

**Global Conversion**:
A value calculation between Moroccan Dirham and one supported foreign currency. Moroccan Dirham is always one side of the pair.
_Avoid_: Currency exchange, foreign exchange

**Conversion Pair**:
The two currencies in a Global Conversion, consisting of Moroccan Dirham and one supported foreign currency.
_Avoid_: Arbitrary currency pair, exchange pair

**Moroccan Unit Conversion**:
A value-equivalence calculation among Moroccan Dirham, Ryal, and Franc. It uses fixed local conventions rather than a market rate.
_Avoid_: Heritage currency conversion, local currency exchange

**Moroccan Unit**:
One of the locally understood denominations supported by Moroccan Unit Conversion.
_Avoid_: Heritage currency

**Ryal**:
A Moroccan Unit valued by this product at twenty Ryal per Moroccan Dirham.
_Avoid_: Riyal, RYL currency

**Franc**:
A Moroccan Unit valued by this product at one hundred Franc per Moroccan Dirham.
_Avoid_: FRN currency, Moroccan Franc currency

**Fresh Rate**:
A live rate fetched successfully within the previous six hours.
_Avoid_: Current rate, real-time rate

**Stale Rate**:
The last successfully fetched rate when it is more than six hours old. It remains usable and must retain its original timestamp.
_Avoid_: Live rate, current rate

**Estimated Rate**:
A bundled approximate rate used only when no fetched rate is available.
_Avoid_: Default rate, live rate
