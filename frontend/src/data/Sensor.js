// src/data/Sensor.js

export const DUMMY_MACHINE_SENSORS = {
  // ── 5 LOW RISK ──────────────────────────────────────────────
  "UNIT_FD001_01": { sensor2: 642.58, sensor3: 1581.22, sensor4: 1398.91, sensor7: 554.42, sensor8: 2388.08, sensor9: 9056.40, sensor11: 47.23, sensor12: 521.79, sensor13: 2388.06, sensor14: 8130.11, sensor15: 8.4024, sensor17: 393.0, sensor20: 38.81, sensor21: 23.3552 },
  "UNIT_FD001_02": { sensor2: 642.55, sensor3: 1586.59, sensor4: 1410.83, sensor7: 553.52, sensor8: 2388.10, sensor9: 9044.77, sensor11: 47.67, sensor12: 521.74, sensor13: 2388.09, sensor14: 8126.90, sensor15: 8.4505, sensor17: 391.0, sensor20: 38.81, sensor21: 23.2618 },
  "UNIT_FD001_03": { sensor2: 642.88, sensor3: 1589.75, sensor4: 1418.89, sensor7: 552.59, sensor8: 2388.16, sensor9: 9049.26, sensor11: 47.88, sensor12: 520.83, sensor13: 2388.14, sensor14: 8131.46, sensor15: 8.4119, sensor17: 395.0, sensor20: 38.93, sensor21: 23.2740 },
  "UNIT_FD001_04": { sensor2: 642.78, sensor3: 1594.53, sensor4: 1406.88, sensor7: 552.64, sensor8: 2388.13, sensor9: 9051.30, sensor11: 47.65, sensor12: 521.88, sensor13: 2388.11, sensor14: 8133.64, sensor15: 8.4634, sensor17: 395.0, sensor20: 38.58, sensor21: 23.2581 },
  "UNIT_FD001_05": { sensor2: 642.27, sensor3: 1589.94, sensor4: 1419.36, sensor7: 553.29, sensor8: 2388.10, sensor9: 9053.99, sensor11: 47.46, sensor12: 521.00, sensor13: 2388.15, sensor14: 8125.74, sensor15: 8.4362, sensor17: 394.0, sensor20: 38.75, sensor21: 23.4117 },

  // ── 4 MEDIUM RISK ───────────────────────────────────────────
  "UNIT_MR_01": { sensor2: 643.05, sensor3: 1601.94, sensor4: 1428.49, sensor7: 551.73, sensor8: 2388.14, sensor9: 9085.83, sensor11: 48.51, sensor12: 519.56, sensor13: 2388.15, sensor14: 8179.02, sensor15: 8.6452, sensor17: 390.0, sensor20: 39.21, sensor21: 23.6269 },
  "UNIT_MR_02": { sensor2: 643.10, sensor3: 1605.59, sensor4: 1433.57, sensor7: 551.42, sensor8: 2388.10, sensor9: 9091.99, sensor11: 48.67, sensor12: 519.32, sensor13: 2388.07, sensor14: 8189.19, sensor15: 8.6628, sensor17: 390.0, sensor20: 39.31, sensor21: 23.6763 },
  "UNIT_MR_03": { sensor2: 643.27, sensor3: 1609.61, sensor4: 1438.27, sensor7: 551.08, sensor8: 2388.13, sensor9: 9097.57, sensor11: 48.84, sensor12: 518.97, sensor13: 2388.16, sensor14: 8198.76, sensor15: 8.6893, sensor17: 389.0, sensor20: 39.45, sensor21: 23.7315 },
  "UNIT_MR_04": { sensor2: 643.42, sensor3: 1613.90, sensor4: 1443.64, sensor7: 550.75, sensor8: 2388.17, sensor9: 9104.24, sensor11: 49.03, sensor12: 518.53, sensor13: 2388.02, sensor14: 8209.74, sensor15: 8.7182, sensor17: 388.0, sensor20: 39.61, sensor21: 23.7861 },

  // ── 7 HIGH RISK ─────────────────────────────────────────────
  "UNIT_HR_01": { sensor2: 643.80, sensor3: 1615.40, sensor4: 1455.80, sensor7: 548.20, sensor8: 2388.30, sensor9: 9135.60, sensor11: 49.80, sensor12: 516.20, sensor13: 2388.40, sensor14: 8258.40, sensor15: 8.89, sensor17: 387.0, sensor20: 39.90, sensor21: 24.15 },
  "UNIT_HR_02": { sensor2: 644.10, sensor3: 1622.70, sensor4: 1468.10, sensor7: 547.60, sensor8: 2388.50, sensor9: 9154.80, sensor11: 50.20, sensor12: 515.10, sensor13: 2388.50, sensor14: 8275.20, sensor15: 8.97, sensor17: 386.0, sensor20: 40.20, sensor21: 24.42 },
  "UNIT_HR_03": { sensor2: 643.90, sensor3: 1618.50, sensor4: 1473.20, sensor7: 548.00, sensor8: 2388.40, sensor9: 9160.30, sensor11: 50.50, sensor12: 514.70, sensor13: 2388.60, sensor14: 8298.70, sensor15: 9.03, sensor17: 385.0, sensor20: 40.50, sensor21: 24.63 },
  "UNIT_HR_04": { sensor2: 644.30, sensor3: 1630.20, sensor4: 1481.40, sensor7: 546.90, sensor8: 2388.70, sensor9: 9178.10, sensor11: 51.10, sensor12: 513.90, sensor13: 2388.80, sensor14: 8325.50, sensor15: 9.12, sensor17: 384.0, sensor20: 40.80, sensor21: 24.88 },
  "UNIT_HR_05": { sensor2: 644.50, sensor3: 1638.90, sensor4: 1495.70, sensor7: 546.10, sensor8: 2388.80, sensor9: 9195.40, sensor11: 51.80, sensor12: 512.60, sensor13: 2388.90, sensor14: 8358.90, sensor15: 9.24, sensor17: 383.0, sensor20: 41.10, sensor21: 25.12 },
  "UNIT_HR_06": { sensor2: 644.80, sensor3: 1645.50, sensor4: 1504.30, sensor7: 545.50, sensor8: 2389.00, sensor9: 9218.70, sensor11: 52.40, sensor12: 511.80, sensor13: 2389.10, sensor14: 8390.60, sensor15: 9.36, sensor17: 382.0, sensor20: 41.50, sensor21: 25.45 },
  "UNIT_HR_07": { sensor2: 645.10, sensor3: 1652.30, sensor4: 1515.90, sensor7: 544.80, sensor8: 2389.20, sensor9: 9241.30, sensor11: 53.10, sensor12: 510.90, sensor13: 2389.30, sensor14: 8425.10, sensor15: 9.51, sensor17: 381.0, sensor20: 41.90, sensor21: 25.82 },
};

export const MACHINE_UNITS = Object.keys(DUMMY_MACHINE_SENSORS);

// Known risk levels per unit (used for UI labels before prediction runs)
export const UNIT_RISK_HINT = {
  "UNIT_FD001_01": "low", "UNIT_FD001_02": "low", "UNIT_FD001_03": "low",
  "UNIT_FD001_04": "low", "UNIT_FD001_05": "low",
  "UNIT_MR_01": "medium", "UNIT_MR_02": "medium", "UNIT_MR_03": "medium", "UNIT_MR_04": "medium",
  "UNIT_HR_01": "high", "UNIT_HR_02": "high", "UNIT_HR_03": "high", "UNIT_HR_04": "high",
  "UNIT_HR_05": "high", "UNIT_HR_06": "high", "UNIT_HR_07": "high",
};