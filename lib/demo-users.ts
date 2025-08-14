// Demo users for testing Harare Zimbabwe South Stake system
import type { CurrentUser } from "@/lib/user-service"

export const DEMO_USERS: Record<string, CurrentUser> = {
  "stake-leader": {
    id: "demo-stake-leader",
    name: "President Mukamuri",
    email: "stake.leader@harare.zw",
    role: "stake-leader",
    units: [
      { id: "harare-1st" },
      { id: "harare-2nd" },
      { id: "harare-3rd" },
      { id: "chitungwiza" },
      { id: "norton" },
      { id: "ruwa" },
      { id: "ysa-branch" }
    ]
  },
  "unit-leader-harare1": {
    id: "demo-bishop-harare1",
    name: "Bishop Chigumira",
    email: "bishop.harare1@harare.zw",
    role: "unit-leader",
    units: [{ id: "harare-1st" }]
  },
  "unit-leader-chitungwiza": {
    id: "demo-bishop-chitungwiza",
    name: "Bishop Mutasa",
    email: "bishop.chitungwiza@harare.zw",
    role: "unit-leader",
    units: [{ id: "chitungwiza" }]
  },
  "viewer-harare2": {
    id: "demo-clerk-harare2",
    name: "Brother Nyamande",
    email: "clerk.harare2@harare.zw",
    role: "viewer",
    units: [{ id: "harare-2nd" }]
  },
  "ysa-leader": {
    id: "demo-ysa-president",
    name: "President Madziva",
    email: "ysa.president@harare.zw",
    role: "unit-leader",
    units: [{ id: "ysa-branch" }]
  }
}

export const DEMO_CREDENTIALS = [
  {
    email: "stake.leader@harare.zw",
    password: "StakeLeader123!",
    role: "Stake Leader",
    description: "Full access to all units in Harare Zimbabwe South Stake",
    userId: "stake-leader"
  },
  {
    email: "bishop.harare1@harare.zw", 
    password: "Bishop123!",
    role: "Unit Leader",
    description: "Bishop of Harare 1st Ward",
    userId: "unit-leader-harare1"
  },
  {
    email: "bishop.chitungwiza@harare.zw",
    password: "Bishop123!",
    role: "Unit Leader", 
    description: "Bishop of Chitungwiza Ward",
    userId: "unit-leader-chitungwiza"
  },
  {
    email: "clerk.harare2@harare.zw",
    password: "Clerk123!",
    role: "Viewer",
    description: "Ward Clerk - Read-only access to Harare 2nd Ward",
    userId: "viewer-harare2"
  },
  {
    email: "ysa.president@harare.zw",
    password: "YSA123!",
    role: "Unit Leader",
    description: "YSA Branch President",
    userId: "ysa-leader"
  }
]
