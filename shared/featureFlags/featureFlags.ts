export const FLAGS = {
  development: {
    "BLC-275": false,
    "BLC-420": true,
  },

  production: {
    "BLC-275": false,
    "BLC-420": false,
  },

  local: {
    "BLC-275": false, // BLC-275: hides 'FAILED' payments
    "BLC-420": true, // BLC-420: Enables the lease type selection section
  },
};
