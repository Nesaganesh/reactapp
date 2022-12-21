export interface emoRequest {
    live?: boolean,
    startAt?: string,
    homeTeamCname?: string,
    awayTeamCname?: string,
    name?: string,
    eventId?: number,
    marketPackageCname?: string,
    keywords?: string,
    includeChildren?: boolean,
    prices?: number[],
    events?: string,
    markets?: string[],
    results?: {
      eventId?: number,
      marketId?: number,
      outcomeId?: number,
      cname?: string
    }[]
  };