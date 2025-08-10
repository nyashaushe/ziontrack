export type Unit = {
  id: string
  name: string
  type: "ward" | "branch"
  stake: string
}

export const UNITS: Unit[] = [
  { id: "domboramwari-branch", name: "Domboramwari Branch", type: "branch", stake: "Harare Zimbabwe Stake" },
  { id: "epworth-ward", name: "Epworth Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { id: "queensdale-ward", name: "Queensdale Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { id: "mbare-1-ward", name: "Mbare 1 Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { id: "mbare-2-ward", name: "Mbare 2 Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { id: "highfield-ward", name: "Highfield Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { id: "glenview-2nd-ward", name: "Glenview 2nd Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { id: "kambuzuma-branch", name: "Kambuzuma Branch", type: "branch", stake: "Harare Zimbabwe Stake" },
  { id: "solomio-branch", name: "Solomio", type: "branch", stake: "Harare Zimbabwe Stake" },
]
