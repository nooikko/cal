export interface BaseParams {
  orgId: string;
}

export interface PageParams {
  params: Promise<BaseParams>;
}
