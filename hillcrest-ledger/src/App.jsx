import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, CartesianGrid } from "recharts";

/* ───────── ALL 387 TRANSACTIONS ───────── */
const TX_RAW = [
{"id":1,"date":"2024-06-01","item":"Sofa","price":399,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":2,"date":"2024-06-01","item":"Coffee Table","price":75,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":3,"date":"2024-06-01","item":"Console","price":80,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":4,"date":"2024-06-01","item":"Island Table + 2 Chairs","price":120,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":5,"date":"2024-06-01","item":"Logistics Sofa","price":136,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":6,"date":"2024-06-01","item":"Logistics Console","price":84,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":7,"date":"2024-06-01","item":"Logistics Derek","price":30,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":8,"date":"2024-06-01","item":"Motion Sensor Lights","price":25,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":9,"date":"2024-06-01","item":"Sandpaper + Danish Oil","price":60,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":10,"date":"2024-06-01","item":"Muji Mop","price":28,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":11,"date":"2024-06-01","item":"Kent Ridge Lamp","price":25,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":12,"date":"2024-06-01","item":"Evedal Lamp","price":250,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":13,"date":"2024-06-01","item":"2 Months Deposit (GLC)","price":3500,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":14,"date":"2024-06-01","item":"Mistral Fan x 2","price":130,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":15,"date":"2024-06-01","item":"Toilet Additions","price":52.32,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":16,"date":"2024-06-01","item":"Tissue Paper Holder Pepe","price":8,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":17,"date":"2024-06-01","item":"Bedsheet set","price":249.6,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":18,"date":"2024-06-01","item":"Blinds","price":650,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":19,"date":"2024-06-01","item":"Hangers x 100","price":40.4,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":20,"date":"2024-06-01","item":"Bedframe","price":80,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":21,"date":"2024-06-01","item":"Shopee Haul","price":479.88,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":22,"date":"2024-06-01","item":"Shopee Supermarket","price":180.92,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":23,"date":"2024-06-01","item":"Steamer Iron","price":32.54,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":24,"date":"2024-06-01","item":"2 Months Deposit (KT)","price":2000,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},
{"id":25,"date":"2024-06-01","item":"Projector + Stand","price":2699,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},
{"id":26,"date":"2024-06-01","item":"Red Chairs","price":12,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},
{"id":27,"date":"2024-06-01","item":"IKEA","price":2063,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},
{"id":28,"date":"2024-06-01","item":"Clock","price":35,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},
{"id":29,"date":"2024-06-01","item":"Shopee","price":716.42,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},
{"id":30,"date":"2024-06-01","item":"Stanley Adventure Quencher","price":45,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},
{"id":31,"date":"2024-06-01","item":"Vacuum","price":260,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},
{"id":32,"date":"2024-06-01","item":"Dyson Pure Cool","price":158.1,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},
{"id":33,"date":"2024-06-01","item":"Shower Curtain Rail","price":34,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},
{"id":34,"date":"2024-06-01","item":"Aircon Servicing","price":66,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},
{"id":35,"date":"2024-06-01","item":"Shopee Haul","price":226.88,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":36,"date":"2024-06-01","item":"Drawer Organiser","price":26.4,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":37,"date":"2024-06-01","item":"Grab Food","price":18.5,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":38,"date":"2024-06-01","item":"Living Area Rug","price":170.2,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":39,"date":"2024-06-01","item":"Air Freshener Scent","price":63,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":40,"date":"2024-07-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-07"},
{"id":41,"date":"2024-07-01","item":"Seraya Energy","price":52.52,"paidBy":"GLC","type":"Electricity","remarks":"","period":"2024-07"},
{"id":42,"date":"2024-07-01","item":"Fairprice","price":33.81,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-07"},
{"id":43,"date":"2024-07-01","item":"Shopee Pods","price":38.6,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-07"},
{"id":44,"date":"2024-07-01","item":"Panda Mart","price":65.55,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-07"},
{"id":45,"date":"2024-07-01","item":"Grab Food","price":38.73,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-07"},
{"id":46,"date":"2024-07-01","item":"Fairprice","price":87.72,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-07"},
{"id":47,"date":"2024-07-01","item":"Remy","price":180,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-07"},
{"id":48,"date":"2024-07-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-07"},
{"id":49,"date":"2024-07-01","item":"IKEA","price":143,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-07"},
{"id":50,"date":"2024-07-01","item":"Food Panda","price":40.54,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-07"},
{"id":51,"date":"2024-08-01","item":"Food Panda","price":53.48,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},
{"id":52,"date":"2024-08-01","item":"Food Panda","price":26.58,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},
{"id":53,"date":"2024-08-01","item":"Brighton Vet","price":113,"paidBy":"GLC","type":"Cat","remarks":"","period":"2024-08"},
{"id":54,"date":"2024-08-01","item":"Cat Litter","price":49,"paidBy":"GLC","type":"Cat","remarks":"","period":"2024-08"},
{"id":55,"date":"2024-08-01","item":"Brighton Vet Toffee","price":181.3,"paidBy":"GLC","type":"Cat","remarks":"","period":"2024-08"},
{"id":56,"date":"2024-08-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-08"},
{"id":57,"date":"2024-08-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-08"},
{"id":58,"date":"2024-08-01","item":"Grab Supermarket","price":105.89,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},
{"id":59,"date":"2024-08-01","item":"Fairprice","price":29.09,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},
{"id":60,"date":"2024-08-01","item":"Food Panda","price":56,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},
{"id":61,"date":"2024-08-01","item":"Shopee pods","price":67,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},
{"id":62,"date":"2024-08-01","item":"Panda Mart","price":33,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},
{"id":63,"date":"2024-08-01","item":"Remy","price":300,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-08"},
{"id":64,"date":"2024-08-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-08"},
{"id":65,"date":"2024-08-01","item":"Geneco","price":97.41,"paidBy":"KT","type":"Electricity","remarks":"","period":"2024-08"},
{"id":66,"date":"2024-08-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-08"},
{"id":67,"date":"2024-08-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-08"},
{"id":68,"date":"2024-08-01","item":"Panda Mart","price":56.96,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},
{"id":69,"date":"2024-08-01","item":"Panda Mart","price":78.84,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},
{"id":70,"date":"2024-08-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":87.67,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},
{"id":71,"date":"2024-08-01","item":"Finest @ Thomson Plaza","price":5.13,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},
{"id":72,"date":"2024-08-01","item":"Finest @ Thomson Plaza","price":3.2,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},
{"id":73,"date":"2024-08-01","item":"Panda Mart","price":97.24,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},
{"id":74,"date":"2024-08-01","item":"Finest @ Thomson Plaza","price":47.5,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},
{"id":75,"date":"2024-09-01","item":"Food Panda","price":41.55,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},
{"id":76,"date":"2024-09-01","item":"Panda Mart","price":44.57,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},
{"id":77,"date":"2024-09-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-09"},
{"id":78,"date":"2024-09-01","item":"Cat Litter","price":49,"paidBy":"GLC","type":"Cat","remarks":"","period":"2024-09"},
{"id":79,"date":"2024-09-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-09"},
{"id":80,"date":"2024-09-01","item":"Brighton Vet","price":101.35,"paidBy":"GLC","type":"Cat","remarks":"","period":"2024-09"},
{"id":81,"date":"2024-09-01","item":"Panda Mart","price":67.03,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},
{"id":82,"date":"2024-09-01","item":"Fairprice","price":64.28,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},
{"id":83,"date":"2024-09-01","item":"Food Panda","price":52.79,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},
{"id":84,"date":"2024-09-01","item":"Shopee pods + Swiffer","price":79.3,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},
{"id":85,"date":"2024-09-01","item":"Panda Mart","price":57,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},
{"id":86,"date":"2024-09-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-09"},
{"id":87,"date":"2024-09-01","item":"Geneco","price":101.72,"paidBy":"KT","type":"Electricity","remarks":"","period":"2024-09"},
{"id":88,"date":"2024-09-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":87.15,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},
{"id":89,"date":"2024-09-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-09"},
{"id":90,"date":"2024-09-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-09"},
{"id":91,"date":"2024-09-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":48.07,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},
{"id":92,"date":"2024-09-01","item":"Finest @ Thomson Plaza","price":5.83,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},
{"id":93,"date":"2024-09-01","item":"Food Panda","price":50.39,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},
{"id":94,"date":"2024-09-01","item":"Panda Mart","price":77.38,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},
{"id":95,"date":"2024-09-01","item":"Food Panda","price":46.43,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},
{"id":96,"date":"2024-09-01","item":"Finest @ Thomson Plaza","price":75.76,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},
{"id":97,"date":"2024-09-01","item":"Food Panda","price":99.91,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},
{"id":98,"date":"2024-10-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-10"},
{"id":99,"date":"2024-10-01","item":"Fairprice (Grocery)","price":78.68,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-10"},
{"id":100,"date":"2024-10-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-10"},
{"id":101,"date":"2024-10-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-10"},
{"id":102,"date":"2024-10-01","item":"Geneco","price":9.09,"paidBy":"KT","type":"Electricity","remarks":"","period":"2024-10"},
{"id":103,"date":"2024-11-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-11"},
{"id":104,"date":"2024-11-01","item":"Food Panda","price":40.76,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-11"},
{"id":105,"date":"2024-11-01","item":"Fairprice (Grocery)","price":77.04,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-11"},
{"id":106,"date":"2024-11-01","item":"Food Panda","price":55.28,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-11"},
{"id":107,"date":"2024-11-01","item":"Panda Mart","price":70.39,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-11"},
{"id":108,"date":"2024-11-01","item":"Food Panda","price":93.48,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-11"},
{"id":109,"date":"2024-11-01","item":"Remy","price":69,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-11"},
{"id":110,"date":"2024-11-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-11"},
{"id":111,"date":"2024-11-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":84.89,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":112,"date":"2024-11-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":60.99,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":113,"date":"2024-11-01","item":"Geneco","price":165.63,"paidBy":"KT","type":"Electricity","remarks":"","period":"2024-11"},
{"id":114,"date":"2024-11-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-11"},
{"id":115,"date":"2024-11-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-11"},
{"id":116,"date":"2024-11-01","item":"Finest @ Thomson Plaza","price":16.33,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":117,"date":"2024-11-01","item":"PandaMart / Foodpanda","price":85.91,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":118,"date":"2024-11-01","item":"PandaMart / Foodpanda","price":84.06,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":119,"date":"2024-11-01","item":"Panda Mart","price":42.73,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":120,"date":"2024-11-01","item":"Finest @ Thomson Plaza","price":24.01,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":121,"date":"2024-11-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":46.67,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":122,"date":"2024-11-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":42.3,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":123,"date":"2024-11-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":49.96,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":124,"date":"2024-11-01","item":"Panda Mart","price":63.61,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":125,"date":"2024-11-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":100.74,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":126,"date":"2024-11-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":30.98,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":127,"date":"2024-11-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":120.53,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":128,"date":"2024-11-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":46.46,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":129,"date":"2024-12-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-12"},
{"id":130,"date":"2024-12-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-12"},
{"id":131,"date":"2024-12-01","item":"Geneco","price":343.2,"paidBy":"KT","type":"Electricity","remarks":"","period":"2024-12"},
{"id":132,"date":"2024-12-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-12"},
{"id":133,"date":"2024-12-01","item":"Food Panda","price":48.49,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-12"},
{"id":134,"date":"2024-12-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-12"},
{"id":135,"date":"2024-12-01","item":"Fairprice (Grocery)","price":47.42,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-12"},
{"id":136,"date":"2024-12-01","item":"Panda Mart","price":79.91,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-12"},
{"id":137,"date":"2024-12-01","item":"Food Panda","price":28.89,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-12"},
{"id":138,"date":"2024-12-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":94.36,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},
{"id":139,"date":"2024-12-01","item":"Finest @ Thomson Plaza","price":3.18,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},
{"id":140,"date":"2024-12-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":65.64,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},
{"id":141,"date":"2024-12-01","item":"Food Panda","price":47.15,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},
{"id":142,"date":"2024-12-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":87.36,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},
{"id":143,"date":"2024-12-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-12"},
{"id":144,"date":"2024-12-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":107.81,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},
{"id":145,"date":"2024-12-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":46.01,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},
{"id":146,"date":"2024-12-01","item":"Panda Mart","price":74.16,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},
{"id":147,"date":"2024-12-01","item":"FOODPANDA SINGAPORE  SINGAPORE","price":100.96,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},
{"id":148,"date":"2025-01-31","item":"Remy (Jan 31)","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-01"},
{"id":149,"date":"2025-01-01","item":"Food Panda","price":63.78,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},
{"id":150,"date":"2025-01-01","item":"Food Panda","price":72.22,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},
{"id":151,"date":"2025-01-01","item":"Panda Mart","price":81.06,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},
{"id":152,"date":"2025-01-01","item":"Fairprice","price":50.4,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},
{"id":153,"date":"2025-01-01","item":"Food Panda","price":60.7,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},
{"id":154,"date":"2025-01-01","item":"Shopee pods","price":103.9,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},
{"id":155,"date":"2025-01-01","item":"Christmas Present KT","price":300,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-01"},
{"id":156,"date":"2025-01-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-01"},
{"id":157,"date":"2025-01-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-01"},
{"id":158,"date":"2025-01-01","item":"Seraya Energy","price":165.86,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-01"},
{"id":159,"date":"2025-01-01","item":"Food Panda","price":120.35,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-01"},
{"id":160,"date":"2025-02-01","item":"Remy","price":150,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-02"},
{"id":161,"date":"2025-02-01","item":"Food Panda","price":60.4,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},
{"id":162,"date":"2025-02-01","item":"Food Panda","price":26.54,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},
{"id":163,"date":"2025-02-01","item":"Food Panda","price":55.38,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},
{"id":164,"date":"2025-02-01","item":"Panda Mart","price":70.78,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},
{"id":165,"date":"2025-02-01","item":"Grab Supermarket","price":90.2,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},
{"id":166,"date":"2025-02-01","item":"Shopee pods","price":38.3,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},
{"id":167,"date":"2025-02-01","item":"Fairprice","price":35,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},
{"id":168,"date":"2025-02-01","item":"Panda Mart","price":50,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},
{"id":169,"date":"2025-02-01","item":"Food Panda","price":100,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},
{"id":170,"date":"2025-02-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-02"},
{"id":171,"date":"2025-02-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-02"},
{"id":172,"date":"2025-02-01","item":"Seraya Energy","price":156.24,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-02"},
{"id":173,"date":"2025-02-01","item":"Finest @ Thomson Plaza","price":14.6,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-02"},
{"id":174,"date":"2025-02-01","item":"Food Panda","price":50,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-02"},
{"id":175,"date":"2025-03-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-03"},
{"id":176,"date":"2025-03-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-03"},
{"id":177,"date":"2025-03-01","item":"Food Panda","price":40.14,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},
{"id":178,"date":"2025-03-01","item":"Food Panda","price":65.6,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},
{"id":179,"date":"2025-03-01","item":"Panda Mart","price":52.3,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},
{"id":180,"date":"2025-03-01","item":"Food Panda","price":32.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},
{"id":181,"date":"2025-03-01","item":"Fairprice","price":33.8,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},
{"id":182,"date":"2025-03-01","item":"Shopee pods","price":38.3,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},
{"id":183,"date":"2025-03-01","item":"Food Panda","price":71.2,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},
{"id":184,"date":"2025-03-01","item":"Panda Mart","price":80,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},
{"id":185,"date":"2025-03-01","item":"Cat Litter","price":69,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-03"},
{"id":186,"date":"2025-03-01","item":"Direct Asia","price":0.2,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-03"},
{"id":187,"date":"2025-03-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-03"},
{"id":188,"date":"2025-03-01","item":"Seraya Energy","price":149.79,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-03"},
{"id":189,"date":"2025-03-01","item":"Finest @ Thomson Plaza","price":42.47,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-03"},
{"id":190,"date":"2025-03-01","item":"Food Panda","price":78,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-03"},
{"id":191,"date":"2025-03-01","item":"Food Panda","price":25.3,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-03"},
{"id":192,"date":"2025-04-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-04"},
{"id":193,"date":"2025-04-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-04"},
{"id":194,"date":"2025-04-01","item":"Food Panda","price":68.62,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},
{"id":195,"date":"2025-04-01","item":"Panda Mart","price":110,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},
{"id":196,"date":"2025-04-01","item":"Food Panda","price":36.43,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},
{"id":197,"date":"2025-04-01","item":"Fairprice","price":43.52,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},
{"id":198,"date":"2025-04-01","item":"Shopee pods","price":38.4,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},
{"id":199,"date":"2025-04-01","item":"Panda Mart","price":72.6,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},
{"id":200,"date":"2025-04-01","item":"Cat Litter","price":70,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-04"},
{"id":201,"date":"2025-04-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-04"},
{"id":202,"date":"2025-04-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-04"},
{"id":203,"date":"2025-04-01","item":"Seraya Energy","price":114.56,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-04"},
{"id":204,"date":"2025-05-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-05"},
{"id":205,"date":"2025-05-01","item":"Food Panda","price":41.22,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},
{"id":206,"date":"2025-05-01","item":"Food Panda","price":65.32,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},
{"id":207,"date":"2025-05-01","item":"Food Panda","price":55.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},
{"id":208,"date":"2025-05-01","item":"Shopee pods","price":39.6,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},
{"id":209,"date":"2025-05-01","item":"Panda Mart","price":58.95,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},
{"id":210,"date":"2025-05-01","item":"Fairprice","price":60.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},
{"id":211,"date":"2025-05-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-05"},
{"id":212,"date":"2025-05-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-05"},
{"id":213,"date":"2025-05-01","item":"Seraya Energy","price":145.37,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-05"},
{"id":214,"date":"2025-05-01","item":"Food Panda","price":40.26,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-05"},
{"id":215,"date":"2025-05-01","item":"Food Panda","price":49.6,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-05"},
{"id":216,"date":"2025-05-01","item":"Finest @ Thomson Plaza","price":22.2,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-05"},
{"id":217,"date":"2025-05-01","item":"Finest @ Thomson Plaza","price":22.4,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-05"},
{"id":218,"date":"2025-06-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-06"},
{"id":219,"date":"2025-06-01","item":"Food Panda","price":28.42,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-06"},
{"id":220,"date":"2025-06-01","item":"Panda Mart","price":30,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-06"},
{"id":221,"date":"2025-06-01","item":"Cat Litter","price":58,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-06"},
{"id":222,"date":"2025-06-01","item":"Panda Mart","price":66,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-06"},
{"id":223,"date":"2025-06-01","item":"Shopee pods","price":39,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-06"},
{"id":224,"date":"2025-06-01","item":"Fairprice","price":100,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-06"},
{"id":225,"date":"2025-06-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-06"},
{"id":226,"date":"2025-06-01","item":"Seraya Energy","price":131.63,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-06"},
{"id":227,"date":"2025-06-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-06"},
{"id":228,"date":"2025-06-01","item":"Finest @ Thomson Plaza","price":7.46,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-06"},
{"id":229,"date":"2025-06-01","item":"PandaMart / Foodpanda","price":33.54,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-06"},
{"id":230,"date":"2025-06-01","item":"PandaMart / Foodpanda","price":33.2,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-06"},
{"id":231,"date":"2025-06-01","item":"Finest @ Thomson Plaza","price":5.68,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-06"},
{"id":232,"date":"2025-07-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-07"},
{"id":233,"date":"2025-07-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-07"},
{"id":234,"date":"2025-07-01","item":"Food Panda","price":28.42,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-07"},
{"id":235,"date":"2025-07-01","item":"Panda Mart","price":51.66,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-07"},
{"id":236,"date":"2025-07-01","item":"Fairprice","price":47.4,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-07"},
{"id":237,"date":"2025-07-01","item":"Food Panda","price":112.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-07"},
{"id":238,"date":"2025-07-01","item":"Shopee pods","price":30,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-07"},
{"id":239,"date":"2025-07-01","item":"Brighton Vet","price":150,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-07"},
{"id":240,"date":"2025-07-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-07"},
{"id":241,"date":"2025-07-01","item":"Seraya Energy","price":103.49,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-07"},
{"id":242,"date":"2025-07-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-07"},
{"id":243,"date":"2025-07-01","item":"Food Panda","price":30.22,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-07"},
{"id":244,"date":"2025-07-01","item":"Finest @ Thomson Plaza","price":24.73,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-07"},
{"id":245,"date":"2025-08-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-08"},
{"id":246,"date":"2025-08-01","item":"Food Panda","price":56.14,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-08"},
{"id":247,"date":"2025-08-01","item":"Fairprice","price":24.84,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-08"},
{"id":248,"date":"2025-08-01","item":"Shopee pods","price":36.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-08"},
{"id":249,"date":"2025-08-01","item":"Food Panda","price":50,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-08"},
{"id":250,"date":"2025-08-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-08"},
{"id":251,"date":"2025-08-01","item":"Seraya Energy","price":101.37,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-08"},
{"id":252,"date":"2025-08-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-08"},
{"id":253,"date":"2025-08-01","item":"Food Panda","price":50.2,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-08"},
{"id":254,"date":"2025-08-01","item":"Finest @ Thomson Plaza","price":100,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-08"},
{"id":255,"date":"2025-09-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-09"},
{"id":256,"date":"2025-09-01","item":"Food Panda","price":58.93,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},
{"id":257,"date":"2025-09-01","item":"Panda Mart","price":63.68,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},
{"id":258,"date":"2025-09-01","item":"Fairprice","price":80,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},
{"id":259,"date":"2025-09-01","item":"Shopee pods","price":35,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},
{"id":260,"date":"2025-09-01","item":"Brighton Vet","price":132,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-09"},
{"id":261,"date":"2025-09-01","item":"Panda Mart","price":50,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},
{"id":262,"date":"2025-09-01","item":"Panda Mart","price":100,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},
{"id":263,"date":"2025-09-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-09"},
{"id":264,"date":"2025-09-01","item":"Seraya Energy","price":151.12,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-09"},
{"id":265,"date":"2025-09-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-09"},
{"id":266,"date":"2025-09-01","item":"Finest @ Thomson Plaza","price":14.16,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":267,"date":"2025-09-01","item":"PandaMart / Foodpanda","price":90.38,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":268,"date":"2025-09-01","item":"PandaMart / Foodpanda","price":78.76,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":269,"date":"2025-09-01","item":"PandaMart / Foodpanda","price":58.48,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":270,"date":"2025-09-01","item":"PandaMart / Foodpanda","price":46.38,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":271,"date":"2025-09-01","item":"PandaMart / Foodpanda","price":62.9,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":272,"date":"2025-09-01","item":"Finest @ Thomson Plaza","price":32.54,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":273,"date":"2025-09-01","item":"Finest @ Thomson Plaza","price":14.02,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":274,"date":"2025-09-01","item":"Finest @ Thomson Plaza","price":80.01,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":275,"date":"2025-09-01","item":"PandaMart / Foodpanda","price":80,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":276,"date":"2025-09-01","item":"Finest @ Thomson Plaza","price":20,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":277,"date":"2025-10-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-10"},
{"id":278,"date":"2025-10-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-10"},
{"id":279,"date":"2025-10-01","item":"Food Panda","price":72.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},
{"id":280,"date":"2025-10-01","item":"Fairprice","price":57.45,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},
{"id":281,"date":"2025-10-01","item":"Shopee pods","price":40.9,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},
{"id":282,"date":"2025-10-01","item":"Panda Mart","price":90,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},
{"id":283,"date":"2025-10-01","item":"Panda Mart","price":26.8,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},
{"id":284,"date":"2025-10-01","item":"Food Panda","price":90,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},
{"id":285,"date":"2025-10-01","item":"Fairprice","price":43.8,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},
{"id":286,"date":"2025-10-01","item":"Panda Mart","price":100,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},
{"id":287,"date":"2025-10-01","item":"Brighton Vet","price":166.5,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-10"},
{"id":288,"date":"2025-10-01","item":"Shopee Pods","price":80,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},
{"id":289,"date":"2025-10-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-10"},
{"id":290,"date":"2025-10-01","item":"Seraya Energy","price":143.51,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-10"},
{"id":291,"date":"2025-10-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-10"},
{"id":292,"date":"2025-10-01","item":"Finest @ Thomson Plaza","price":7.33,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},
{"id":293,"date":"2025-10-01","item":"PandaMart / Foodpanda","price":39.8,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},
{"id":294,"date":"2025-10-01","item":"PandaMart / Foodpanda","price":56.22,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},
{"id":295,"date":"2025-10-01","item":"PandaMart / Foodpanda","price":68.56,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},
{"id":296,"date":"2025-10-01","item":"PandaMart / Foodpanda","price":47.91,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},
{"id":297,"date":"2025-10-01","item":"PandaMart / Foodpanda","price":47.91,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},
{"id":298,"date":"2025-10-01","item":"PandaMart / Foodpanda","price":78.92,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},
{"id":299,"date":"2025-10-01","item":"PandaMart / Foodpanda","price":38.37,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},
{"id":300,"date":"2025-10-01","item":"Finest @ Thomson Plaza","price":5.49,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},
{"id":301,"date":"2025-10-01","item":"Finest @ Thomson Plaza","price":0.12,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},
{"id":302,"date":"2025-11-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-11"},
{"id":303,"date":"2025-11-01","item":"Food Panda","price":43.23,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-11"},
{"id":304,"date":"2025-11-01","item":"Fairprice","price":50,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-11"},
{"id":305,"date":"2025-11-01","item":"Panda Mart","price":66.95,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-11"},
{"id":306,"date":"2025-11-01","item":"Cat Litter","price":70,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-11"},
{"id":307,"date":"2025-11-01","item":"Shopee pods","price":50,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-11"},
{"id":308,"date":"2025-11-01","item":"Panda Mart","price":100,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-11"},
{"id":309,"date":"2025-11-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-11"},
{"id":310,"date":"2025-11-01","item":"Seraya Energy","price":113.35,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-11"},
{"id":311,"date":"2025-11-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-11"},
{"id":312,"date":"2025-11-01","item":"PandaMart / Foodpanda","price":42.3,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},
{"id":313,"date":"2025-11-01","item":"PandaMart / Foodpanda","price":83.87,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},
{"id":314,"date":"2025-11-01","item":"PandaMart / Foodpanda","price":50.46,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},
{"id":315,"date":"2025-11-01","item":"PandaMart / Foodpanda","price":50.6,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},
{"id":316,"date":"2025-11-01","item":"PandaMart / Foodpanda","price":60.42,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},
{"id":317,"date":"2025-11-01","item":"Finest @ Thomson Plaza","price":26.23,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},
{"id":318,"date":"2025-11-01","item":"Finest @ Thomson Plaza","price":31,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},
{"id":319,"date":"2025-11-01","item":"PandaMart / Foodpanda","price":80.51,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},
{"id":320,"date":"2025-11-01","item":"PandaMart / Foodpanda","price":60,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},
{"id":321,"date":"2025-11-01","item":"Food Panda","price":30,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},
{"id":322,"date":"2025-12-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-12"},
{"id":323,"date":"2025-12-01","item":"Fairprice","price":35.25,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-12"},
{"id":324,"date":"2025-12-01","item":"Food Panda","price":63.12,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-12"},
{"id":325,"date":"2025-12-28","item":"Wine for Julias bday","price":0,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-12"},
{"id":326,"date":"2025-12-01","item":"Direct Asia","price":0,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-12"},
{"id":327,"date":"2025-12-01","item":"Seraya Energy","price":142.43,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-12"},
{"id":328,"date":"2025-12-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-12"},
{"id":329,"date":"2025-12-01","item":"Finest @ Thomson Plaza","price":20,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},
{"id":330,"date":"2025-12-01","item":"PandaMart / Foodpanda","price":82.42,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},
{"id":331,"date":"2025-12-01","item":"PandaMart / Foodpanda","price":65.32,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},
{"id":332,"date":"2025-12-01","item":"PandaMart / Foodpanda","price":64.4,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},
{"id":333,"date":"2025-12-01","item":"PandaMart / Foodpanda","price":50.6,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},
{"id":334,"date":"2025-12-01","item":"PandaMart / Foodpanda","price":54.22,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},
{"id":335,"date":"2025-12-01","item":"PandaMart / Foodpanda","price":101.55,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},
{"id":336,"date":"2025-12-01","item":"PandaMart / Foodpanda","price":64.66,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},
{"id":337,"date":"2025-12-01","item":"Finest @ Thomson Plaza","price":136.555,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},
{"id":338,"date":"2026-01-02","item":"Fairprice+Toothpaste+Daiso","price":32.06,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-01"},
{"id":339,"date":"2026-01-07","item":"Urban Company","price":30,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-01"},
{"id":340,"date":"2026-01-16","item":"Fairprice","price":9.89,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-01"},
{"id":341,"date":"2026-01-13","item":"Splendor + Bb liz gift","price":38.9,"paidBy":"GLC","type":"Misc","remarks":"split even la","period":"2026-01"},
{"id":342,"date":"2026-01-18","item":"Brighton Vet","price":46.5,"paidBy":"GLC","type":"Cat","remarks":"","period":"2026-01"},
{"id":343,"date":"2026-01-01","item":"Shopee pods","price":15.06,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-01"},
{"id":344,"date":"2026-01-24","item":"Cat collar and Airtag","price":16.93,"paidBy":"GLC","type":"Cat","remarks":"","period":"2026-01"},
{"id":345,"date":"2026-01-02","item":"Finest @ Thomson Plaza","price":7.1,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},
{"id":346,"date":"2026-01-02","item":"PandaMart / Foodpanda","price":37.43,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},
{"id":347,"date":"2026-01-05","item":"Finest @ Thomson Plaza","price":3.58,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},
{"id":348,"date":"2026-01-06","item":"PandaMart / Foodpanda","price":96.11,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},
{"id":349,"date":"2026-01-13","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2026-01"},
{"id":350,"date":"2026-01-13","item":"Seraya Energy","price":203.85,"paidBy":"KT","type":"Electricity","remarks":"","period":"2026-01"},
{"id":351,"date":"2026-01-14","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2026-01"},
{"id":352,"date":"2026-01-14","item":"PandaMart / Foodpanda","price":94.17,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},
{"id":353,"date":"2026-01-16","item":"Finest @ Thomson Plaza","price":7.1,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},
{"id":354,"date":"2026-01-16","item":"PandaMart / Foodpanda","price":94.17,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},
{"id":355,"date":"2026-01-16","item":"PandaMart / Foodpanda","price":53.42,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},
{"id":356,"date":"2026-01-19","item":"PandaMart / Foodpanda","price":57.87,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},
{"id":357,"date":"2026-01-26","item":"PandaMart / Foodpanda","price":36.45,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},
{"id":358,"date":"2026-02-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2026-02"},
{"id":359,"date":"2026-02-01","item":"Shopee pods","price":25.97,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-02"},
{"id":360,"date":"2026-02-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2026-02"},
{"id":361,"date":"2026-02-01","item":"Seraya Energy","price":203.85,"paidBy":"KT","type":"Electricity","remarks":"","period":"2026-02"},
{"id":362,"date":"2026-02-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2026-02"},
{"id":363,"date":"2026-02-01","item":"Finest @ Thomson Plaza","price":7.1,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-02"},
{"id":364,"date":"2026-02-01","item":"PandaMart / Foodpanda","price":53.42,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-02"},
{"id":365,"date":"2026-02-01","item":"PandaMart / Foodpanda","price":57.87,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-02"},
{"id":366,"date":"2026-02-01","item":"PandaMart / Foodpanda","price":47.2,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-02"},
{"id":367,"date":"2026-03-05","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2026-03"},
{"id":368,"date":"2026-03-15","item":"BBQ (mom helped to get)","price":11.45,"paidBy":"GLC","type":"Misc","remarks":"","period":"2026-03"},
{"id":369,"date":"2026-03-13","item":"BBQ (MCST)","price":16.35,"paidBy":"GLC","type":"Misc","remarks":"Deposit $100 (pending why this amount)","period":"2026-03"},
{"id":370,"date":"2026-03-13","item":"Butcher Box","price":105.8,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-03"},
{"id":371,"date":"2026-03-11","item":"Food Panda","price":30.72,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-03"},
{"id":372,"date":"2026-03-11","item":"Butcher Box","price":87,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-03"},
{"id":373,"date":"2026-03-18","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2026-03"},
{"id":374,"date":"2026-03-08","item":"Fairprice","price":57.55,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-03"},
];

const MONTHLY_META = [
{"period":"2024-06","bf_glc":6715.66,"bf_kt":8088.52,"balance_owed":-686.43,"total_shared":14804.18},
{"period":"2024-07","bf_glc":1896.93,"bf_kt":1583.54,"balance_owed":156.695,"total_shared":3480.47},
{"period":"2024-08","bf_glc":2489.34,"bf_kt":2225.53,"balance_owed":-118.095,"total_shared":4214.87},
{"period":"2024-09","bf_glc":2631.87,"bf_kt":1844.72,"balance_owed":393.575,"total_shared":4476.59},
{"period":"2024-10","bf_glc":1478.68,"bf_kt":1525.18,"balance_owed":-23.25,"total_shared":3003.86},
{"period":"2024-11","bf_glc":2205.95,"bf_kt":3350.89,"balance_owed":-572.47,"total_shared":5556.84},
{"period":"2024-12","bf_glc":2079.71,"bf_kt":2122.37,"balance_owed":-21.33,"total_shared":4202.08},
{"period":"2025-01","bf_glc":807.06,"bf_kt":438.29,"balance_owed":184.385,"total_shared":1245.35},
{"period":"2025-02","bf_glc":676.6,"bf_kt":372.92,"balance_owed":151.84,"total_shared":1049.52},
{"period":"2025-03","bf_glc":632.84,"bf_kt":331.75,"balance_owed":150.545,"total_shared":964.59},
{"period":"2025-04","bf_glc":589.57,"bf_kt":266.64,"balance_owed":161.465,"total_shared":856.21},
{"period":"2025-05","bf_glc":396.09,"bf_kt":431.91,"balance_owed":-17.91,"total_shared":828},
{"period":"2025-06","bf_glc":396.42,"bf_kt":363.59,"balance_owed":16.415,"total_shared":760.01},
{"period":"2025-07","bf_glc":569.98,"bf_kt":310.52,"balance_owed":129.73,"total_shared":880.5},
{"period":"2025-08","bf_glc":242.48,"bf_kt":403.65,"balance_owed":-80.585,"total_shared":646.13},
{"period":"2025-09","bf_glc":594.61,"bf_kt":860.84,"balance_owed":-133.115,"total_shared":1455.45},
{"period":"2025-10","bf_glc":1016.95,"bf_kt":686.22,"balance_owed":165.365,"total_shared":1703.17},
{"period":"2025-11","bf_glc":455.18,"bf_kt":830.82,"balance_owed":-187.82,"total_shared":1286},
{"period":"2025-12","bf_glc":173.365,"bf_kt":894.61,"balance_owed":-360.6225,"total_shared":1067.975},
{"period":"2026-01","bf_glc":189.33,"bf_kt":843.33,"balance_owed":-327,"total_shared":1032.66},
{"period":"2026-02","bf_glc":100.97,"bf_kt":521.52,"balance_owed":-210.275,"total_shared":622.49},
{"period":"2026-03","bf_glc":401.32,"bf_kt":57.55,"balance_owed":171.885,"total_shared":458.87},
];

const TYPES = ["Grocery","Misc","Electricity","Household goods","Cat","Rent"];
const TYPE_META = {
  Grocery:{color:"#7a8c6e",icon:"\u{1F6D2}"},Misc:{color:"#b89a7a",icon:"\u{1F4E6}"},
  Electricity:{color:"#c9a84c",icon:"\u26A1"},"Household goods":{color:"#7a9aad",icon:"\u{1F3E0}"},
  Cat:{color:"#c48b9f",icon:"\u{1F431}"},Rent:{color:"#9b8ab5",icon:"\u{1F3E1}"},
};
const fmt = n => "$"+Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");
const fmtK = n => n>=1000?"$"+(n/1000).toFixed(1)+"k":"$"+n.toFixed(0);
const pLabel = p => {const[y,m]=p.split("-");const mn=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return mn[+m]+" '"+y.slice(2);};

const Badge = ({who}) => (
  <span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:.5,fontFamily:"'Outfit',sans-serif",background:who==="KT"?"#e8ded3":"#dce5dc",color:who==="KT"?"#8b7355":"#5c7a5c"}}>{who==="KT"?"Kenneth":"Gracelynn"}</span>
);

const Card = ({children,style={}}) => (
  <div style={{background:"#fff",borderRadius:14,padding:"20px 22px",border:"1px solid #ede7df",boxShadow:"0 1px 3px rgba(0,0,0,0.03)",marginBottom:12,...style}}>{children}</div>
);
const Label = ({children}) => <p style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"#bbb0a2",margin:"0 0 12px",fontWeight:500}}>{children}</p>;

const TABS = ["overview","insights","transactions"];

export default function App(){
  const [tab,setTab]=useState("overview");
  const [filterPeriod,setFilterPeriod]=useState("all");
  const [filterPaidBy,setFilterPaidBy]=useState("All");
  const [filterType,setFilterType]=useState("All");
  const [sortField,setSortField]=useState("date");
  const [sortDir,setSortDir]=useState("desc");
  const [search,setSearch]=useState("");

  const periods = useMemo(()=>[...new Set(TX_RAW.map(t=>t.period))].sort(),[]);

  const txs = useMemo(()=>{
    let list = TX_RAW.filter(t=>t.price>0);
    if(filterPeriod!=="all") list=list.filter(t=>t.period===filterPeriod);
    if(filterPaidBy!=="All") list=list.filter(t=>t.paidBy===filterPaidBy);
    if(filterType!=="All") list=list.filter(t=>t.type===filterType);
    if(search) list=list.filter(t=>t.item.toLowerCase().includes(search.toLowerCase()));
    list.sort((a,b)=>{
      if(sortField==="price") return sortDir==="asc"?a.price-b.price:b.price-a.price;
      return sortDir==="asc"?String(a[sortField]).localeCompare(String(b[sortField])):String(b[sortField]).localeCompare(String(a[sortField]));
    });
    return list;
  },[filterPeriod,filterPaidBy,filterType,sortField,sortDir,search]);

  // Stats (always over full data for overview/insights, filtered for transactions tab)
  const allTx = TX_RAW.filter(t=>t.price>0);
  const stats = useMemo(()=>{
    const src = tab==="transactions"?txs:allTx;
    const glcT=src.filter(t=>t.paidBy==="GLC").reduce((s,t)=>s+t.price,0);
    const ktT=src.filter(t=>t.paidBy==="KT").reduce((s,t)=>s+t.price,0);
    const byType={};src.forEach(t=>{byType[t.type]=(byType[t.type]||0)+t.price;});
    return {glcT,ktT,total:glcT+ktT,byType};
  },[txs,tab]);

  // Monthly trend
  const monthlyTrend = useMemo(()=>periods.map(p=>{
    const mt = allTx.filter(t=>t.period===p);
    return {period:pLabel(p),raw:p,total:mt.reduce((s,t)=>s+t.price,0),glc:mt.filter(t=>t.paidBy==="GLC").reduce((s,t)=>s+t.price,0),kt:mt.filter(t=>t.paidBy==="KT").reduce((s,t)=>s+t.price,0)};
  }),[]);

  // Exclude June 2024 (move-in) for "normal" monthly avg
  const normalMonths = monthlyTrend.filter(m=>m.raw!=="2024-06");
  const avgMonthly = normalMonths.reduce((s,m)=>s+m.total,0)/normalMonths.length;

  // Top merchants
  const merchants = useMemo(()=>{
    const map={};
    allTx.forEach(t=>{
      // Normalize merchant names
      let name=t.item.replace(/FOODPANDA SINGAPORE\s+SINGAPORE/gi,"Foodpanda").replace(/PandaMart \/ Foodpanda/gi,"PandaMart").replace(/Panda Mart/gi,"PandaMart").replace(/Food Panda/gi,"Foodpanda");
      if(!map[name]) map[name]={name,total:0,count:0};
      map[name].total+=t.price;map[name].count++;
    });
    return Object.values(map).sort((a,b)=>b.total-a.total);
  },[]);

  // Category trend (excl move-in)
  const catTrend = useMemo(()=>{
    const normalTx=allTx.filter(t=>t.period!=="2024-06");
    return TYPES.map(type=>{
      const items=normalTx.filter(t=>t.type===type);
      const total=items.reduce((s,t)=>s+t.price,0);
      const monthlyAvg=total/normalMonths.length;
      return {type,total,monthlyAvg,count:items.length};
    }).sort((a,b)=>b.total-a.total);
  },[]);

  // Balance history
  const balanceHistory = MONTHLY_META.map(m=>({period:pLabel(m.period),owed:m.balance_owed}));

  // Biggest single purchases
  const biggestTx = [...allTx].sort((a,b)=>b.price-a.price).slice(0,10);

  const toggleSort = f => {if(sortField===f) setSortDir(d=>d==="asc"?"desc":"asc"); else {setSortField(f);setSortDir("desc");}};
  const formatDate = d => {const dt=new Date(d+"T00:00:00");return dt.toLocaleDateString("en-SG",{day:"numeric",month:"short",year:"2-digit"});};
  const catEntries = Object.entries(stats.byType).sort((a,b)=>b[1]-a[1]);
  const maxCat = catEntries.length>0?catEntries[0][1]:1;

  const tooltipStyle = {background:"#fbf8f4",border:"1px solid #e0d8ce",borderRadius:10,fontSize:12,fontFamily:"'Outfit',sans-serif",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"};

  return (
    <div style={{fontFamily:"'Outfit','Nunito',sans-serif",background:"#f7f3ee",color:"#4a4440",minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,600&display=swap" rel="stylesheet"/>
      <style>{`*,*::before,*::after{box-sizing:border-box}::selection{background:#c8b8a4;color:#fff}input:focus,select:focus{outline:none;border-color:#b8a898!important}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.recharts-cartesian-axis-tick-value{fill:#b0a395!important;font-size:11px!important}`}</style>

      {/* Header */}
      <div style={{padding:"28px 24px 20px",borderBottom:"1px solid #e8e0d6",background:"#fbf8f4"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
            <div>
              <p style={{fontSize:12,letterSpacing:3,textTransform:"uppercase",color:"#b0a395",margin:"0 0 6px",fontWeight:500}}>Hillcrest Arcadia</p>
              <h1 style={{fontSize:26,fontFamily:"'Fraunces',serif",fontWeight:600,color:"#3d3530",margin:0}}>Our Home Ledger</h1>
              <p style={{fontSize:13,color:"#a09890",margin:"4px 0 0",fontWeight:300}}>June 2024 — March 2026 &middot; {allTx.length} entries</p>
            </div>
            <div style={{display:"flex",gap:4,background:"#f0ebe4",borderRadius:10,padding:3}}>
              {TABS.map(v=>(
                <button key={v} onClick={()=>setTab(v)} style={{padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:"inherit",transition:"all .25s",background:tab===v?"#fff":"transparent",color:tab===v?"#5c4f42":"#b0a090",boxShadow:tab===v?"0 1px 4px rgba(0,0,0,.06)":"none",textTransform:"capitalize"}}>{v}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"24px 16px 60px"}}>

        {/* ===== OVERVIEW ===== */}
        {tab==="overview" && (
          <div style={{animation:"fadeIn .35s ease"}}>
            {/* Latest settlement */}
            <Card style={{textAlign:"center",padding:"30px 28px 26px"}}>
              <Label>Latest Settlement · {pLabel(MONTHLY_META[MONTHLY_META.length-1].period)}</Label>
              {(()=>{const m=MONTHLY_META[MONTHLY_META.length-1];return(<>
                <p style={{fontSize:44,fontFamily:"'Fraunces',serif",fontWeight:600,margin:"0 0 8px",color:m.balance_owed>=0?"#b07a5b":"#7a8c6e"}}>{fmt(m.balance_owed)}</p>
                <p style={{fontSize:14,color:"#9a8e82",margin:0,fontWeight:300}}>{m.balance_owed>=0?<><Badge who="KT"/> <span style={{margin:"0 4px"}}>owes</span> <Badge who="GLC"/></>:<><Badge who="GLC"/> <span style={{margin:"0 4px"}}>owes</span> <Badge who="KT"/></>}</p>
              </>);})()}
            </Card>

            {/* All-time stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
              {[{l:"All-time Total",v:fmt(stats.total),c:"#5c4f42"},{l:"Gracelynn",v:fmt(stats.glcT),c:"#7a8c6e"},{l:"Kenneth",v:fmt(stats.ktT),c:"#b07a5b"}].map((c,i)=>(
                <Card key={i} style={{textAlign:"center",padding:"18px 14px"}}>
                  <p style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"#bbb0a2",margin:"0 0 8px",fontWeight:500}}>{c.l}</p>
                  <p style={{fontSize:22,fontFamily:"'Fraunces',serif",fontWeight:600,color:c.c,margin:0}}>{c.v}</p>
                </Card>
              ))}
            </div>

            {/* Monthly spending trend */}
            <Card>
              <Label>Monthly Spending</Label>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyTrend} margin={{top:5,right:5,bottom:5,left:-15}}>
                  <defs>
                    <linearGradient id="gGLC" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a3b896" stopOpacity={.5}/><stop offset="95%" stopColor="#a3b896" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gKT" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d4bfa8" stopOpacity={.5}/><stop offset="95%" stopColor="#d4bfa8" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7df"/>
                  <XAxis dataKey="period" tick={{fontSize:10,fill:"#b0a395"}} interval={2}/>
                  <YAxis tick={{fontSize:10,fill:"#b0a395"}} tickFormatter={fmtK}/>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v)=>"$"+v.toFixed(0)}/>
                  <Area type="monotone" dataKey="glc" name="Gracelynn" stroke="#7a8c6e" fill="url(#gGLC)" strokeWidth={2}/>
                  <Area type="monotone" dataKey="kt" name="Kenneth" stroke="#b89a7a" fill="url(#gKT)" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
              <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:8,fontSize:12,color:"#9a8e82"}}>
                <span><span style={{display:"inline-block",width:10,height:3,background:"#7a8c6e",borderRadius:2,marginRight:6}}/>Gracelynn</span>
                <span><span style={{display:"inline-block",width:10,height:3,background:"#b89a7a",borderRadius:2,marginRight:6}}/>Kenneth</span>
              </div>
            </Card>

            {/* Balance history */}
            <Card>
              <Label>Who Owes Who (each month)</Label>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={balanceHistory} margin={{top:5,right:5,bottom:5,left:-15}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7df"/>
                  <XAxis dataKey="period" tick={{fontSize:10,fill:"#b0a395"}} interval={2}/>
                  <YAxis tick={{fontSize:10,fill:"#b0a395"}} tickFormatter={v=>"$"+v.toFixed(0)}/>
                  <Tooltip contentStyle={tooltipStyle} formatter={v=>[v>0?"KT owes $"+v.toFixed(2):"GLC owes $"+Math.abs(v).toFixed(2),"Balance"]}/>
                  <Bar dataKey="owed" radius={[4,4,0,0]}>
                    {balanceHistory.map((e,i)=><Cell key={i} fill={e.owed>=0?"#d4bfa8":"#a3b896"} opacity={.75}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:8,fontSize:11,color:"#b0a395"}}>
                <span><span style={{display:"inline-block",width:10,height:10,borderRadius:3,background:"#d4bfa8",marginRight:5,opacity:.75}}/>KT owes GLC</span>
                <span><span style={{display:"inline-block",width:10,height:10,borderRadius:3,background:"#a3b896",marginRight:5,opacity:.75}}/>GLC owes KT</span>
              </div>
            </Card>

            {/* Categories */}
            <Card>
              <Label>All-time by Category</Label>
              {catEntries.map(([type,amount])=>{
                const meta=TYPE_META[type]||{color:"#999",icon:"\u2022"};
                const pct=stats.total>0?(amount/stats.total*100):0;
                return(
                  <div key={type} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <span style={{fontSize:13,display:"flex",alignItems:"center",gap:8,color:"#5c4f42"}}><span style={{fontSize:15}}>{meta.icon}</span>{type}</span>
                      <span style={{fontSize:13,fontWeight:500,color:meta.color}}>{fmt(amount)} <span style={{fontSize:11,color:"#c0b5a8",fontWeight:400}}>{pct.toFixed(0)}%</span></span>
                    </div>
                    <div style={{height:5,background:"#f0ebe4",borderRadius:4,overflow:"hidden"}}>
                      <div style={{width:`${(amount/maxCat)*100}%`,height:"100%",background:meta.color,borderRadius:4,opacity:.65,transition:"width .5s"}}/>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        )}

        {/* ===== INSIGHTS ===== */}
        {tab==="insights" && (
          <div style={{animation:"fadeIn .35s ease"}}>
            {/* Key numbers */}
            <Card style={{textAlign:"center",background:"linear-gradient(135deg,#fbf8f4,#fff)"}}>
              <Label>Household at a Glance</Label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:8}}>
                {[
                  {l:"Avg Monthly Spend",v:fmt(avgMonthly),sub:"excl. move-in month"},
                  {l:"22 Months Tracked",v:fmt(stats.total),sub:"total shared expenses"},
                  {l:"Grocery per Month",v:fmt(catTrend.find(c=>c.type==="Grocery")?.monthlyAvg||0),sub:"biggest recurring cost"},
                  {l:"Electricity per Month",v:fmt(catTrend.find(c=>c.type==="Electricity")?.monthlyAvg||0),sub:"Seraya + Geneco"},
                ].map((c,i)=>(
                  <div key={i} style={{padding:"12px 8px"}}>
                    <p style={{fontSize:10,letterSpacing:1.5,textTransform:"uppercase",color:"#bbb0a2",margin:"0 0 6px",fontWeight:500}}>{c.l}</p>
                    <p style={{fontSize:24,fontFamily:"'Fraunces',serif",fontWeight:600,color:"#5c4f42",margin:"0 0 2px"}}>{c.v}</p>
                    <p style={{fontSize:11,color:"#c0b5a8",margin:0}}>{c.sub}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top merchants */}
            <Card>
              <Label>Where the Money Goes (Top 10)</Label>
              {merchants.slice(0,10).map((m,i)=>(
                <div key={m.name} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<9?"1px solid #f5f0ea":"none"}}>
                  <span style={{fontSize:12,color:"#c0b5a8",width:20,textAlign:"right",fontWeight:500}}>{i+1}</span>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:500,color:"#4a4440",margin:0}}>{m.name}</p>
                    <p style={{fontSize:11,color:"#c0b5a8",margin:"2px 0 0"}}>{m.count} transactions</p>
                  </div>
                  <span style={{fontSize:14,fontFamily:"'Fraunces',serif",fontWeight:600,color:"#5c4f42"}}>{fmt(m.total)}</span>
                </div>
              ))}
            </Card>

            {/* Category monthly averages */}
            <Card>
              <Label>Monthly Averages by Category</Label>
              <p style={{fontSize:11,color:"#c0b5a8",margin:"-6px 0 14px",fontStyle:"italic"}}>Excluding June 2024 move-in</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={catTrend} layout="vertical" margin={{top:0,right:10,bottom:0,left:0}}>
                  <XAxis type="number" tick={{fontSize:10,fill:"#b0a395"}} tickFormatter={v=>"$"+v.toFixed(0)}/>
                  <YAxis type="category" dataKey="type" tick={{fontSize:11,fill:"#7a7068"}} width={100}/>
                  <Tooltip contentStyle={tooltipStyle} formatter={v=>"$"+v.toFixed(2)+"/mo"}/>
                  <Bar dataKey="monthlyAvg" name="Monthly Avg" radius={[0,6,6,0]}>
                    {catTrend.map((c,i)=><Cell key={i} fill={(TYPE_META[c.type]||{color:"#ccc"}).color} opacity={.7}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Spending trend YoY */}
            <Card>
              <Label>Monthly Spending Trend (excl. move-in)</Label>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={normalMonths} margin={{top:5,right:5,bottom:5,left:-15}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7df"/>
                  <XAxis dataKey="period" tick={{fontSize:10,fill:"#b0a395"}} interval={2}/>
                  <YAxis tick={{fontSize:10,fill:"#b0a395"}} tickFormatter={fmtK}/>
                  <Tooltip contentStyle={tooltipStyle} formatter={v=>"$"+v.toFixed(0)}/>
                  <Line type="monotone" dataKey="total" stroke="#b89a7a" strokeWidth={2.5} dot={{r:3,fill:"#b89a7a"}} name="Total"/>
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Biggest purchases */}
            <Card>
              <Label>Biggest Single Purchases</Label>
              {biggestTx.map((tx,i)=>{
                const meta=TYPE_META[tx.type]||{color:"#999",icon:"\u2022"};
                return(
                  <div key={tx.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<9?"1px solid #f5f0ea":"none"}}>
                    <span style={{fontSize:18}}>{meta.icon}</span>
                    <div style={{flex:1}}>
                      <p style={{fontSize:13,fontWeight:500,color:"#4a4440",margin:0}}>{tx.item}</p>
                      <p style={{fontSize:11,color:"#c0b5a8",margin:"2px 0 0"}}>{formatDate(tx.date)} &middot; <Badge who={tx.paidBy}/></p>
                    </div>
                    <span style={{fontSize:15,fontFamily:"'Fraunces',serif",fontWeight:600,color:tx.paidBy==="KT"?"#b07a5b":"#7a8c6e"}}>{fmt(tx.price)}</span>
                  </div>
                );
              })}
            </Card>

            {/* Fun facts */}
            <Card style={{background:"linear-gradient(135deg,#f5f0ea,#fbf8f4)"}}>
              <Label>Fun Facts</Label>
              <div style={{fontSize:13,color:"#5c4f42",lineHeight:2}}>
                <p style={{margin:"0 0 8px"}}>{"\u{1F354}"} You've ordered from Foodpanda/PandaMart <strong>{allTx.filter(t=>t.item.toLowerCase().includes("panda")||t.item.toLowerCase().includes("foodpanda")).length} times</strong> — spending <strong>{fmt(allTx.filter(t=>t.item.toLowerCase().includes("panda")||t.item.toLowerCase().includes("foodpanda")).reduce((s,t)=>s+t.price,0))}</strong> total.</p>
                <p style={{margin:"0 0 8px"}}>{"\u{1F431}"} Cat expenses total <strong>{fmt(allTx.filter(t=>t.type==="Cat").reduce((s,t)=>s+t.price,0))}</strong> across Brighton Vet visits, litter, and accessories.</p>
                <p style={{margin:"0 0 8px"}}>{"\u2728"} Remy (cleaning service) costs about <strong>{fmt(allTx.filter(t=>t.item.toLowerCase().includes("remy")).reduce((s,t)=>s+t.price,0)/allTx.filter(t=>t.item.toLowerCase().includes("remy")).length)}/visit</strong> — you've booked {allTx.filter(t=>t.item.toLowerCase().includes("remy")).length} sessions.</p>
                <p style={{margin:"0 0 8px"}}>{"\u26A1"} Electricity ranges from <strong>{fmt(Math.min(...allTx.filter(t=>t.type==="Electricity"&&t.price>10).map(t=>t.price)))}</strong> to <strong>{fmt(Math.max(...allTx.filter(t=>t.type==="Electricity").map(t=>t.price)))}</strong> per month. Nov '24 was the highest.</p>
                <p style={{margin:0}}>{"\u{1F6CB}\uFE0F"} The move-in month (June '24) alone cost <strong>{fmt(monthlyTrend[0]?.total||0)}</strong> — that's {((monthlyTrend[0]?.total||0)/avgMonthly).toFixed(0)}x your average monthly spend.</p>
              </div>
            </Card>
          </div>
        )}

        {/* ===== TRANSACTIONS ===== */}
        {tab==="transactions" && (
          <div style={{animation:"fadeIn .35s ease"}}>
            {/* Filters */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14,alignItems:"center"}}>
              <select value={filterPeriod} onChange={e=>setFilterPeriod(e.target.value)} style={selStyle}>
                <option value="all">All months</option>
                {periods.map(p=><option key={p} value={p}>{pLabel(p)}</option>)}
              </select>
              {["All","KT","GLC"].map(p=>(
                <button key={p} onClick={()=>setFilterPaidBy(p)} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #e0d8ce",background:filterPaidBy===p?"#5c4f42":"#fff",color:filterPaidBy===p?"#f7f3ee":"#9a8e82",fontSize:12,fontWeight:500,fontFamily:"inherit",cursor:"pointer"}}>{p==="All"?"All":p==="KT"?"Kenneth":"Gracelynn"}</button>
              ))}
              <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={selStyle}>
                <option value="All">All categories</option>
                {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{...selStyle,flex:1,minWidth:120}}/>
            </div>

            {/* Summary for filtered */}
            <Card style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <span style={{fontSize:13,color:"#9a8e82"}}><strong style={{color:"#5c4f42"}}>{txs.length}</strong> entries</span>
              <span style={{fontSize:13,color:"#9a8e82"}}>Total: <strong style={{color:"#5c4f42",fontFamily:"'Fraunces',serif"}}>{fmt(stats.total)}</strong></span>
              <span style={{fontSize:13,color:"#7a8c6e"}}>GLC: <strong>{fmt(stats.glcT)}</strong></span>
              <span style={{fontSize:13,color:"#b07a5b"}}>KT: <strong>{fmt(stats.ktT)}</strong></span>
            </Card>

            {/* Sort bar */}
            <div style={{display:"flex",gap:12,padding:"0 4px",marginBottom:8}}>
              {[{f:"date",l:"Date"},{f:"item",l:"Name"},{f:"price",l:"Amount"},{f:"type",l:"Category"}].map(s=>(
                <button key={s.f} onClick={()=>toggleSort(s.f)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:11,letterSpacing:1.5,textTransform:"uppercase",fontWeight:500,color:sortField===s.f?"#5c4f42":"#c0b5a8"}}>{s.l}{sortField===s.f?(sortDir==="asc"?" \u2191":" \u2193"):""}</button>
              ))}
            </div>

            {/* Cards */}
            {txs.map(tx=>{
              const meta=TYPE_META[tx.type]||{color:"#999",icon:"\u2022"};
              return(
                <div key={tx.id} style={{background:"#fff",borderRadius:14,padding:"14px 18px",marginBottom:6,border:"1px solid #ede7df",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:36,height:36,borderRadius:10,background:meta.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{meta.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                      <p style={{fontSize:13,fontWeight:500,color:"#4a4440",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:8}}>{tx.item}</p>
                      <p style={{fontSize:14,fontWeight:600,fontFamily:"'Fraunces',serif",color:tx.paidBy==="KT"?"#b07a5b":"#7a8c6e",margin:0,flexShrink:0}}>{fmt(tx.price)}</p>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:11,color:"#b8ada0"}}>{formatDate(tx.date)}</span>
                      <span style={{fontSize:9,color:"#d8d0c6"}}>&middot;</span>
                      <Badge who={tx.paidBy}/>
                      <span style={{fontSize:9,color:"#d8d0c6"}}>&middot;</span>
                      <span style={{fontSize:11,color:meta.color,fontWeight:500}}>{tx.type}</span>
                      {tx.remarks&&<><span style={{fontSize:9,color:"#d8d0c6"}}>&middot;</span><span style={{fontSize:11,color:"#c0b5a8",fontStyle:"italic"}}>{tx.remarks}</span></>}
                    </div>
                  </div>
                </div>
              );
            })}
            {txs.length===0&&<div style={{padding:"48px 20px",textAlign:"center",color:"#c0b5a8",fontSize:14}}>No matching entries.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

const selStyle = {padding:"7px 12px",borderRadius:8,border:"1px solid #e0d8ce",background:"#fff",color:"#7a7068",fontSize:12,fontFamily:"'Outfit',sans-serif"};
