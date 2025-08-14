# 🎭 Demo Accounts for Zion Track - Harare Zimbabwe South Stake

## 🚀 **Ready-to-Use Demo Credentials**

Use these accounts to test different role-based access levels:

### **1. 👑 Stake Leader Account**
- **Email**: `stake.leader@harare.zw`
- **Password**: `StakeLeader123!`
- **Role**: Stake Leader
- **Access**: All 7 units in Harare Zimbabwe South Stake
- **Features**: Admin panel, user management, all reports

### **2. 🏛️ Unit Leader Account (Harare 1st Ward)**
- **Email**: `bishop.harare1@harare.zw`
- **Password**: `Bishop123!`
- **Role**: Unit Leader
- **Unit**: Harare 1st Ward
- **Access**: Harare 1st Ward management only

### **3. 🏛️ Unit Leader Account (Chitungwiza Ward)**
- **Email**: `bishop.chitungwiza@harare.zw`
- **Password**: `Bishop123!`
- **Role**: Unit Leader
- **Unit**: Chitungwiza Ward
- **Access**: Chitungwiza Ward management only

### **4. 👀 Viewer Account**
- **Email**: `clerk.harare2@harare.zw`
- **Password**: `Clerk123!`
- **Role**: Viewer
- **Unit**: Harare 2nd Ward
- **Access**: Read-only access to Harare 2nd Ward

### **5. 🌟 YSA Branch Leader Account**
- **Email**: `ysa.president@harare.zw`
- **Password**: `YSA123!`
- **Role**: Unit Leader
- **Unit**: Young Single Adult Branch
- **Access**: YSA Branch management only

## 📋 **How to Create Demo Accounts**

### **Step 1: Run Demo Setup**
1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase-demo-users.sql`
3. This shows you the credentials and setup instructions

### **Step 2: Create Accounts**
1. Visit: http://localhost:3000
2. Click: "Get Started"
3. Use the credentials above to sign up
4. Select the appropriate role and unit for each account

### **Step 3: Test Role-Based Access**
- **Stake Leader**: Should see admin panel, all units
- **Unit Leaders**: Should see only their assigned unit
- **Viewer**: Should have read-only access

## 🏛️ **Available Units in Harare Zimbabwe South Stake**

1. **Harare 1st Ward**
2. **Harare 2nd Ward**
3. **Harare 3rd Ward**
4. **Chitungwiza Ward**
5. **Norton Ward**
6. **Ruwa Ward**
7. **Young Single Adult Branch**

## 🎯 **Testing Scenarios**

### **Scenario 1: Stake Leadership**
- Sign in as: `stake.leader@harare.zw`
- Expected: Access to all units, admin panel, user management

### **Scenario 2: Ward Leadership**
- Sign in as: `bishop.harare1@harare.zw`
- Expected: Access to Harare 1st Ward only, management features

### **Scenario 3: Read-Only Access**
- Sign in as: `clerk.harare2@harare.zw`
- Expected: View-only access to Harare 2nd Ward data

### **Scenario 4: Branch Leadership**
- Sign in as: `ysa.president@harare.zw`
- Expected: Full access to YSA Branch, different from ward structure

## 🔐 **Security Notes**

- These are **demo accounts only** - use for testing
- Passwords follow strong password requirements
- Each account demonstrates different permission levels
- Real deployment should use actual church leader emails

## 🚀 **Quick Start**

1. **Run**: `supabase-demo-users.sql` in Supabase
2. **Visit**: http://localhost:3000
3. **Sign up**: Using any of the demo credentials above
4. **Test**: Different roles and access levels

Your Harare Zimbabwe South Stake leadership dashboard is ready for comprehensive testing!
