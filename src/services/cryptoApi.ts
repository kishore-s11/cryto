import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoApiHeaders = {
  'X-RapidAPI-Key': 'coinranking1.p.rapidapi.com',
  'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
};

const baseUrl = 'https://api.coingecko.com/api/v3';

const createRequest = (url: string) => ({ url });

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getGlobalStats: builder.query({
      query: () => createRequest('/global'),
    }),
    getCryptos: builder.query({
      query: (count) => createRequest(`/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false`),
    }),
    getCryptoDetails: builder.query({
      query: (coinId) => createRequest(`/coins/${coinId}`),
    }),
    getCryptoHistory: builder.query({
      query: ({ coinId, days = 365 }) => createRequest(`/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`),
    }),
    getTrendingCoins: builder.query({
      query: () => createRequest('/search/trending'),
    }),
  }),
});

export const {
  useGetGlobalStatsQuery,
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
  useGetTrendingCoinsQuery,
} = cryptoApi;