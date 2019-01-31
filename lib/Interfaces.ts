import { Fact } from './Fact';

export interface Statistics {
  getDbFact: BaseStat & TimingStat;
  callDatasource: BaseStat
  ensureCache: TimingStat;
  setDBFact: BaseStat;
  updateDBFact: BaseStat;
  totalMS: number;
  approxEngineMS: number;
  totalConditionCount: number;
  invocationStartTime: number
}

export interface BaseStat {
  calls: number;
  ms: number;
}

export interface TimingStat {
  ms: number;
}

export type RainbirdObject = string | number;

/**
 * Returned alongisde Rainbird results.
 */
export interface Metadata {
  [x: string]: {
    data: string;
    dataType: string;
  }[];
}

export interface QueryResult {
  result: Fact[];
  stats: Statistics
  sid: string;
}
