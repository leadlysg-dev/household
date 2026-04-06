import { useState, useMemo, useCallback, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, LineChart, Line } from "recharts";

/* ═══════════ DATA ═══════════ */
// Keeping TX_RAW compact — same 374 household transactions from before
const TX_RAW = [
{"id":1,"date":"2024-06-01","item":"Sofa","price":399,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":2,"date":"2024-06-01","item":"Coffee Table","price":75,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":3,"date":"2024-06-01","item":"Console","price":80,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":4,"date":"2024-06-01","item":"Island Table + 2 Chairs","price":120,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":5,"date":"2024-06-01","item":"Logistics Sofa","price":136,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":6,"date":"2024-06-01","item":"Logistics Console","price":84,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":7,"date":"2024-06-01","item":"Logistics Derek","price":30,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":8,"date":"2024-06-01","item":"Motion Sensor Lights","price":25,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":9,"date":"2024-06-01","item":"Sandpaper + Danish Oil","price":60,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":10,"date":"2024-06-01","item":"Muji Mop","price":28,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":11,"date":"2024-06-01","item":"Kent Ridge Lamp","price":25,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":12,"date":"2024-06-01","item":"Evedal Lamp","price":250,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":13,"date":"2024-06-01","item":"2 Months Deposit (GLC)","price":3500,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":14,"date":"2024-06-01","item":"Mistral Fan x 2","price":130,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":15,"date":"2024-06-01","item":"Toilet Additions","price":52.32,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":16,"date":"2024-06-01","item":"Tissue Paper Holder Pepe","price":8,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":17,"date":"2024-06-01","item":"Bedsheet set","price":249.6,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":18,"date":"2024-06-01","item":"Blinds","price":650,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":19,"date":"2024-06-01","item":"Hangers x 100","price":40.4,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":20,"date":"2024-06-01","item":"Bedframe","price":80,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":21,"date":"2024-06-01","item":"Shopee Haul","price":479.88,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":22,"date":"2024-06-01","item":"Shopee Supermarket","price":180.92,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":23,"date":"2024-06-01","item":"Steamer Iron","price":32.54,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":24,"date":"2024-06-01","item":"2 Months Deposit (KT)","price":2000,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},{"id":25,"date":"2024-06-01","item":"Projector + Stand","price":2699,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},{"id":26,"date":"2024-06-01","item":"Red Chairs","price":12,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},{"id":27,"date":"2024-06-01","item":"IKEA","price":2063,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},{"id":28,"date":"2024-06-01","item":"Clock","price":35,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},{"id":29,"date":"2024-06-01","item":"Shopee","price":716.42,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},{"id":30,"date":"2024-06-01","item":"Stanley Adventure Quencher","price":45,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},{"id":31,"date":"2024-06-01","item":"Vacuum","price":260,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},{"id":32,"date":"2024-06-01","item":"Dyson Pure Cool","price":158.1,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},{"id":33,"date":"2024-06-01","item":"Shower Curtain Rail","price":34,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},{"id":34,"date":"2024-06-01","item":"Aircon Servicing","price":66,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-06"},{"id":35,"date":"2024-06-01","item":"Shopee Haul","price":226.88,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":36,"date":"2024-06-01","item":"Drawer Organiser","price":26.4,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":37,"date":"2024-06-01","item":"Grab Food","price":18.5,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":38,"date":"2024-06-01","item":"Living Area Rug","price":170.2,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},{"id":39,"date":"2024-06-01","item":"Air Freshener Scent","price":63,"paidBy":"GLC","type":"Household goods","remarks":"","period":"2024-06"},
{"id":40,"date":"2024-07-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-07"},{"id":41,"date":"2024-07-01","item":"Seraya Energy","price":52.52,"paidBy":"GLC","type":"Electricity","remarks":"","period":"2024-07"},{"id":42,"date":"2024-07-01","item":"Fairprice","price":33.81,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-07"},{"id":43,"date":"2024-07-01","item":"Shopee Pods","price":38.6,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-07"},{"id":44,"date":"2024-07-01","item":"Panda Mart","price":65.55,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-07"},{"id":45,"date":"2024-07-01","item":"Grab Food","price":38.73,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-07"},{"id":46,"date":"2024-07-01","item":"Fairprice","price":87.72,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-07"},{"id":47,"date":"2024-07-01","item":"Remy","price":180,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-07"},{"id":48,"date":"2024-07-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-07"},{"id":49,"date":"2024-07-01","item":"IKEA","price":143,"paidBy":"KT","type":"Household goods","remarks":"","period":"2024-07"},{"id":50,"date":"2024-07-01","item":"Food Panda","price":40.54,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-07"},
{"id":51,"date":"2024-08-01","item":"Food Panda","price":53.48,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},{"id":52,"date":"2024-08-01","item":"Food Panda","price":26.58,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},{"id":53,"date":"2024-08-01","item":"Brighton Vet","price":113,"paidBy":"GLC","type":"Cat","remarks":"","period":"2024-08"},{"id":54,"date":"2024-08-01","item":"Cat Litter","price":49,"paidBy":"GLC","type":"Cat","remarks":"","period":"2024-08"},{"id":55,"date":"2024-08-01","item":"Brighton Vet Toffee","price":181.3,"paidBy":"GLC","type":"Cat","remarks":"","period":"2024-08"},{"id":56,"date":"2024-08-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-08"},{"id":57,"date":"2024-08-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-08"},{"id":58,"date":"2024-08-01","item":"Grab Supermarket","price":105.89,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},{"id":59,"date":"2024-08-01","item":"Fairprice","price":29.09,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},{"id":60,"date":"2024-08-01","item":"Food Panda","price":56,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},{"id":61,"date":"2024-08-01","item":"Shopee pods","price":67,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},{"id":62,"date":"2024-08-01","item":"Panda Mart","price":33,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-08"},{"id":63,"date":"2024-08-01","item":"Remy","price":300,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-08"},{"id":64,"date":"2024-08-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-08"},{"id":65,"date":"2024-08-01","item":"Geneco","price":97.41,"paidBy":"KT","type":"Electricity","remarks":"","period":"2024-08"},{"id":66,"date":"2024-08-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-08"},{"id":67,"date":"2024-08-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-08"},{"id":68,"date":"2024-08-01","item":"Panda Mart","price":56.96,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},{"id":69,"date":"2024-08-01","item":"Panda Mart","price":78.84,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},{"id":70,"date":"2024-08-01","item":"FOODPANDA","price":87.67,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},{"id":71,"date":"2024-08-01","item":"Finest @ Thomson Plaza","price":5.13,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},{"id":72,"date":"2024-08-01","item":"Finest @ Thomson Plaza","price":3.2,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},{"id":73,"date":"2024-08-01","item":"Panda Mart","price":97.24,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},{"id":74,"date":"2024-08-01","item":"Finest @ Thomson Plaza","price":47.5,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-08"},
{"id":75,"date":"2024-09-01","item":"Food Panda","price":41.55,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},{"id":76,"date":"2024-09-01","item":"Panda Mart","price":44.57,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},{"id":77,"date":"2024-09-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-09"},{"id":78,"date":"2024-09-01","item":"Cat Litter","price":49,"paidBy":"GLC","type":"Cat","remarks":"","period":"2024-09"},{"id":79,"date":"2024-09-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-09"},{"id":80,"date":"2024-09-01","item":"Brighton Vet","price":101.35,"paidBy":"GLC","type":"Cat","remarks":"","period":"2024-09"},{"id":81,"date":"2024-09-01","item":"Panda Mart","price":67.03,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},{"id":82,"date":"2024-09-01","item":"Fairprice","price":64.28,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},{"id":83,"date":"2024-09-01","item":"Food Panda","price":52.79,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},{"id":84,"date":"2024-09-01","item":"Shopee pods + Swiffer","price":79.3,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},{"id":85,"date":"2024-09-01","item":"Panda Mart","price":57,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-09"},{"id":86,"date":"2024-09-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-09"},{"id":87,"date":"2024-09-01","item":"Geneco","price":101.72,"paidBy":"KT","type":"Electricity","remarks":"","period":"2024-09"},{"id":88,"date":"2024-09-01","item":"FOODPANDA","price":87.15,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},{"id":89,"date":"2024-09-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-09"},{"id":90,"date":"2024-09-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-09"},{"id":91,"date":"2024-09-01","item":"FOODPANDA","price":48.07,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},{"id":92,"date":"2024-09-01","item":"Finest @ Thomson Plaza","price":5.83,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},{"id":93,"date":"2024-09-01","item":"Food Panda","price":50.39,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},{"id":94,"date":"2024-09-01","item":"Panda Mart","price":77.38,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},{"id":95,"date":"2024-09-01","item":"Food Panda","price":46.43,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},{"id":96,"date":"2024-09-01","item":"Finest @ Thomson Plaza","price":75.76,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},{"id":97,"date":"2024-09-01","item":"Food Panda","price":99.91,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-09"},
{"id":98,"date":"2024-10-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-10"},{"id":99,"date":"2024-10-01","item":"Fairprice (Grocery)","price":78.68,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-10"},{"id":100,"date":"2024-10-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-10"},{"id":101,"date":"2024-10-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-10"},{"id":102,"date":"2024-10-01","item":"Geneco","price":9.09,"paidBy":"KT","type":"Electricity","remarks":"","period":"2024-10"},
{"id":103,"date":"2024-11-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-11"},{"id":104,"date":"2024-11-01","item":"Food Panda","price":40.76,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-11"},{"id":105,"date":"2024-11-01","item":"Fairprice (Grocery)","price":77.04,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-11"},{"id":106,"date":"2024-11-01","item":"Food Panda","price":55.28,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-11"},{"id":107,"date":"2024-11-01","item":"Panda Mart","price":70.39,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-11"},{"id":108,"date":"2024-11-01","item":"Food Panda","price":93.48,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-11"},{"id":109,"date":"2024-11-01","item":"Remy","price":69,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-11"},{"id":110,"date":"2024-11-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-11"},{"id":111,"date":"2024-11-01","item":"FOODPANDA","price":84.89,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":112,"date":"2024-11-01","item":"FOODPANDA","price":60.99,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":113,"date":"2024-11-01","item":"Geneco","price":165.63,"paidBy":"KT","type":"Electricity","remarks":"","period":"2024-11"},{"id":114,"date":"2024-11-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-11"},{"id":115,"date":"2024-11-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-11"},{"id":116,"date":"2024-11-01","item":"Finest @ Thomson Plaza","price":16.33,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":117,"date":"2024-11-01","item":"PandaMart","price":85.91,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":118,"date":"2024-11-01","item":"PandaMart","price":84.06,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":119,"date":"2024-11-01","item":"Panda Mart","price":42.73,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":120,"date":"2024-11-01","item":"Finest @ Thomson Plaza","price":24.01,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":121,"date":"2024-11-01","item":"FOODPANDA","price":46.67,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":122,"date":"2024-11-01","item":"FOODPANDA","price":42.3,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":123,"date":"2024-11-01","item":"FOODPANDA","price":49.96,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":124,"date":"2024-11-01","item":"Panda Mart","price":63.61,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":125,"date":"2024-11-01","item":"FOODPANDA","price":100.74,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":126,"date":"2024-11-01","item":"FOODPANDA","price":30.98,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":127,"date":"2024-11-01","item":"FOODPANDA","price":120.53,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},{"id":128,"date":"2024-11-01","item":"FOODPANDA","price":46.46,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-11"},
{"id":129,"date":"2024-12-01","item":"Rent 50%","price":1400,"paidBy":"KT","type":"Rent","remarks":"","period":"2024-12"},{"id":130,"date":"2024-12-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-12"},{"id":131,"date":"2024-12-01","item":"Geneco","price":343.2,"paidBy":"KT","type":"Electricity","remarks":"","period":"2024-12"},{"id":132,"date":"2024-12-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2024-12"},{"id":133,"date":"2024-12-01","item":"Food Panda","price":48.49,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-12"},{"id":134,"date":"2024-12-01","item":"Rent 50%","price":1400,"paidBy":"GLC","type":"Rent","remarks":"","period":"2024-12"},{"id":135,"date":"2024-12-01","item":"Fairprice (Grocery)","price":47.42,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-12"},{"id":136,"date":"2024-12-01","item":"Panda Mart","price":79.91,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-12"},{"id":137,"date":"2024-12-01","item":"Food Panda","price":28.89,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2024-12"},{"id":138,"date":"2024-12-01","item":"FOODPANDA","price":94.36,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},{"id":139,"date":"2024-12-01","item":"Finest @ Thomson Plaza","price":3.18,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},{"id":140,"date":"2024-12-01","item":"FOODPANDA","price":65.64,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},{"id":141,"date":"2024-12-01","item":"Food Panda","price":47.15,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},{"id":142,"date":"2024-12-01","item":"FOODPANDA","price":87.36,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},{"id":143,"date":"2024-12-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2024-12"},{"id":144,"date":"2024-12-01","item":"FOODPANDA","price":107.81,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},{"id":145,"date":"2024-12-01","item":"FOODPANDA","price":46.01,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},{"id":146,"date":"2024-12-01","item":"Panda Mart","price":74.16,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},{"id":147,"date":"2024-12-01","item":"FOODPANDA","price":100.96,"paidBy":"KT","type":"Grocery","remarks":"","period":"2024-12"},
{"id":148,"date":"2025-01-31","item":"Remy (Jan 31)","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-01"},{"id":149,"date":"2025-01-01","item":"Food Panda","price":63.78,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},{"id":150,"date":"2025-01-01","item":"Food Panda","price":72.22,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},{"id":151,"date":"2025-01-01","item":"Panda Mart","price":81.06,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},{"id":152,"date":"2025-01-01","item":"Fairprice","price":50.4,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},{"id":153,"date":"2025-01-01","item":"Food Panda","price":60.7,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},{"id":154,"date":"2025-01-01","item":"Shopee pods","price":103.9,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-01"},{"id":155,"date":"2025-01-01","item":"Christmas Present KT","price":300,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-01"},{"id":156,"date":"2025-01-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-01"},{"id":157,"date":"2025-01-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-01"},{"id":158,"date":"2025-01-01","item":"Seraya Energy","price":165.86,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-01"},{"id":159,"date":"2025-01-01","item":"Food Panda","price":120.35,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-01"},
{"id":160,"date":"2025-02-01","item":"Remy","price":150,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-02"},{"id":161,"date":"2025-02-01","item":"Food Panda","price":60.4,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},{"id":162,"date":"2025-02-01","item":"Food Panda","price":26.54,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},{"id":163,"date":"2025-02-01","item":"Food Panda","price":55.38,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},{"id":164,"date":"2025-02-01","item":"Panda Mart","price":70.78,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},{"id":165,"date":"2025-02-01","item":"Grab Supermarket","price":90.2,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},{"id":166,"date":"2025-02-01","item":"Shopee pods","price":38.3,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},{"id":167,"date":"2025-02-01","item":"Fairprice","price":35,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},{"id":168,"date":"2025-02-01","item":"Panda Mart","price":50,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},{"id":169,"date":"2025-02-01","item":"Food Panda","price":100,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-02"},{"id":170,"date":"2025-02-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-02"},{"id":171,"date":"2025-02-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-02"},{"id":172,"date":"2025-02-01","item":"Seraya Energy","price":156.24,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-02"},{"id":173,"date":"2025-02-01","item":"Finest @ Thomson Plaza","price":14.6,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-02"},{"id":174,"date":"2025-02-01","item":"Food Panda","price":50,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-02"},
{"id":175,"date":"2025-03-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-03"},{"id":176,"date":"2025-03-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-03"},{"id":177,"date":"2025-03-01","item":"Food Panda","price":40.14,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},{"id":178,"date":"2025-03-01","item":"Food Panda","price":65.6,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},{"id":179,"date":"2025-03-01","item":"Panda Mart","price":52.3,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},{"id":180,"date":"2025-03-01","item":"Food Panda","price":32.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},{"id":181,"date":"2025-03-01","item":"Fairprice","price":33.8,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},{"id":182,"date":"2025-03-01","item":"Shopee pods","price":38.3,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},{"id":183,"date":"2025-03-01","item":"Food Panda","price":71.2,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},{"id":184,"date":"2025-03-01","item":"Panda Mart","price":80,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-03"},{"id":185,"date":"2025-03-01","item":"Cat Litter","price":69,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-03"},{"id":186,"date":"2025-03-01","item":"Direct Asia","price":0.2,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-03"},{"id":187,"date":"2025-03-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-03"},{"id":188,"date":"2025-03-01","item":"Seraya Energy","price":149.79,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-03"},{"id":189,"date":"2025-03-01","item":"Finest @ Thomson Plaza","price":42.47,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-03"},{"id":190,"date":"2025-03-01","item":"Food Panda","price":78,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-03"},{"id":191,"date":"2025-03-01","item":"Food Panda","price":25.3,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-03"},
{"id":192,"date":"2025-04-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-04"},{"id":193,"date":"2025-04-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-04"},{"id":194,"date":"2025-04-01","item":"Food Panda","price":68.62,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},{"id":195,"date":"2025-04-01","item":"Panda Mart","price":110,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},{"id":196,"date":"2025-04-01","item":"Food Panda","price":36.43,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},{"id":197,"date":"2025-04-01","item":"Fairprice","price":43.52,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},{"id":198,"date":"2025-04-01","item":"Shopee pods","price":38.4,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},{"id":199,"date":"2025-04-01","item":"Panda Mart","price":72.6,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-04"},{"id":200,"date":"2025-04-01","item":"Cat Litter","price":70,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-04"},{"id":201,"date":"2025-04-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-04"},{"id":202,"date":"2025-04-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-04"},{"id":203,"date":"2025-04-01","item":"Seraya Energy","price":114.56,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-04"},
{"id":204,"date":"2025-05-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-05"},{"id":205,"date":"2025-05-01","item":"Food Panda","price":41.22,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},{"id":206,"date":"2025-05-01","item":"Food Panda","price":65.32,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},{"id":207,"date":"2025-05-01","item":"Food Panda","price":55.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},{"id":208,"date":"2025-05-01","item":"Shopee pods","price":39.6,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},{"id":209,"date":"2025-05-01","item":"Panda Mart","price":58.95,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},{"id":210,"date":"2025-05-01","item":"Fairprice","price":60.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-05"},{"id":211,"date":"2025-05-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-05"},{"id":212,"date":"2025-05-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-05"},{"id":213,"date":"2025-05-01","item":"Seraya Energy","price":145.37,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-05"},{"id":214,"date":"2025-05-01","item":"Food Panda","price":40.26,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-05"},{"id":215,"date":"2025-05-01","item":"Food Panda","price":49.6,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-05"},{"id":216,"date":"2025-05-01","item":"Finest @ Thomson Plaza","price":22.2,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-05"},{"id":217,"date":"2025-05-01","item":"Finest @ Thomson Plaza","price":22.4,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-05"},
{"id":218,"date":"2025-06-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-06"},{"id":219,"date":"2025-06-01","item":"Food Panda","price":28.42,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-06"},{"id":220,"date":"2025-06-01","item":"Panda Mart","price":30,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-06"},{"id":221,"date":"2025-06-01","item":"Cat Litter","price":58,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-06"},{"id":222,"date":"2025-06-01","item":"Panda Mart","price":66,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-06"},{"id":223,"date":"2025-06-01","item":"Shopee pods","price":39,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-06"},{"id":224,"date":"2025-06-01","item":"Fairprice","price":100,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-06"},{"id":225,"date":"2025-06-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-06"},{"id":226,"date":"2025-06-01","item":"Seraya Energy","price":131.63,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-06"},{"id":227,"date":"2025-06-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-06"},{"id":228,"date":"2025-06-01","item":"Finest @ Thomson Plaza","price":7.46,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-06"},{"id":229,"date":"2025-06-01","item":"PandaMart","price":33.54,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-06"},{"id":230,"date":"2025-06-01","item":"PandaMart","price":33.2,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-06"},{"id":231,"date":"2025-06-01","item":"Finest @ Thomson Plaza","price":5.68,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-06"},
{"id":232,"date":"2025-07-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-07"},{"id":233,"date":"2025-07-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-07"},{"id":234,"date":"2025-07-01","item":"Food Panda","price":28.42,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-07"},{"id":235,"date":"2025-07-01","item":"Panda Mart","price":51.66,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-07"},{"id":236,"date":"2025-07-01","item":"Fairprice","price":47.4,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-07"},{"id":237,"date":"2025-07-01","item":"Food Panda","price":112.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-07"},{"id":238,"date":"2025-07-01","item":"Shopee pods","price":30,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-07"},{"id":239,"date":"2025-07-01","item":"Brighton Vet","price":150,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-07"},{"id":240,"date":"2025-07-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-07"},{"id":241,"date":"2025-07-01","item":"Seraya Energy","price":103.49,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-07"},{"id":242,"date":"2025-07-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-07"},{"id":243,"date":"2025-07-01","item":"Food Panda","price":30.22,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-07"},{"id":244,"date":"2025-07-01","item":"Finest @ Thomson Plaza","price":24.73,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-07"},
{"id":245,"date":"2025-08-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-08"},{"id":246,"date":"2025-08-01","item":"Food Panda","price":56.14,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-08"},{"id":247,"date":"2025-08-01","item":"Fairprice","price":24.84,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-08"},{"id":248,"date":"2025-08-01","item":"Shopee pods","price":36.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-08"},{"id":249,"date":"2025-08-01","item":"Food Panda","price":50,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-08"},{"id":250,"date":"2025-08-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-08"},{"id":251,"date":"2025-08-01","item":"Seraya Energy","price":101.37,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-08"},{"id":252,"date":"2025-08-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-08"},{"id":253,"date":"2025-08-01","item":"Food Panda","price":50.2,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-08"},{"id":254,"date":"2025-08-01","item":"Finest @ Thomson Plaza","price":100,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-08"},
{"id":255,"date":"2025-09-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-09"},{"id":256,"date":"2025-09-01","item":"Food Panda","price":58.93,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},{"id":257,"date":"2025-09-01","item":"Panda Mart","price":63.68,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},{"id":258,"date":"2025-09-01","item":"Fairprice","price":80,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},{"id":259,"date":"2025-09-01","item":"Shopee pods","price":35,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},{"id":260,"date":"2025-09-01","item":"Brighton Vet","price":132,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-09"},{"id":261,"date":"2025-09-01","item":"Panda Mart","price":50,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},{"id":262,"date":"2025-09-01","item":"Panda Mart","price":100,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-09"},{"id":263,"date":"2025-09-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-09"},{"id":264,"date":"2025-09-01","item":"Seraya Energy","price":151.12,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-09"},{"id":265,"date":"2025-09-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-09"},{"id":266,"date":"2025-09-01","item":"Finest @ Thomson Plaza","price":14.16,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},{"id":267,"date":"2025-09-01","item":"PandaMart","price":90.38,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},{"id":268,"date":"2025-09-01","item":"PandaMart","price":78.76,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},{"id":269,"date":"2025-09-01","item":"PandaMart","price":58.48,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},{"id":270,"date":"2025-09-01","item":"PandaMart","price":46.38,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},{"id":271,"date":"2025-09-01","item":"PandaMart","price":62.9,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},{"id":272,"date":"2025-09-01","item":"Finest @ Thomson Plaza","price":32.54,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},{"id":273,"date":"2025-09-01","item":"Finest @ Thomson Plaza","price":14.02,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},{"id":274,"date":"2025-09-01","item":"Finest @ Thomson Plaza","price":80.01,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},{"id":275,"date":"2025-09-01","item":"PandaMart","price":80,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},{"id":276,"date":"2025-09-01","item":"Finest @ Thomson Plaza","price":20,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-09"},
{"id":277,"date":"2025-10-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-10"},{"id":278,"date":"2025-10-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-10"},{"id":279,"date":"2025-10-01","item":"Food Panda","price":72.5,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},{"id":280,"date":"2025-10-01","item":"Fairprice","price":57.45,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},{"id":281,"date":"2025-10-01","item":"Shopee pods","price":40.9,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},{"id":282,"date":"2025-10-01","item":"Panda Mart","price":90,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},{"id":283,"date":"2025-10-01","item":"Panda Mart","price":26.8,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},{"id":284,"date":"2025-10-01","item":"Food Panda","price":90,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},{"id":285,"date":"2025-10-01","item":"Fairprice","price":43.8,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},{"id":286,"date":"2025-10-01","item":"Panda Mart","price":100,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},{"id":287,"date":"2025-10-01","item":"Brighton Vet","price":166.5,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-10"},{"id":288,"date":"2025-10-01","item":"Shopee Pods","price":80,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-10"},{"id":289,"date":"2025-10-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-10"},{"id":290,"date":"2025-10-01","item":"Seraya Energy","price":143.51,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-10"},{"id":291,"date":"2025-10-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-10"},{"id":292,"date":"2025-10-01","item":"Finest @ Thomson Plaza","price":7.33,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},{"id":293,"date":"2025-10-01","item":"PandaMart","price":39.8,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},{"id":294,"date":"2025-10-01","item":"PandaMart","price":56.22,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},{"id":295,"date":"2025-10-01","item":"PandaMart","price":68.56,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},{"id":296,"date":"2025-10-01","item":"PandaMart","price":47.91,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},{"id":297,"date":"2025-10-01","item":"PandaMart","price":47.91,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},{"id":298,"date":"2025-10-01","item":"PandaMart","price":78.92,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},{"id":299,"date":"2025-10-01","item":"PandaMart","price":38.37,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},{"id":300,"date":"2025-10-01","item":"Finest @ Thomson Plaza","price":5.49,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},{"id":301,"date":"2025-10-01","item":"Finest @ Thomson Plaza","price":0.12,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-10"},
{"id":302,"date":"2025-11-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-11"},{"id":303,"date":"2025-11-01","item":"Food Panda","price":43.23,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-11"},{"id":304,"date":"2025-11-01","item":"Fairprice","price":50,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-11"},{"id":305,"date":"2025-11-01","item":"Panda Mart","price":66.95,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-11"},{"id":306,"date":"2025-11-01","item":"Cat Litter","price":70,"paidBy":"GLC","type":"Cat","remarks":"","period":"2025-11"},{"id":307,"date":"2025-11-01","item":"Shopee pods","price":50,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-11"},{"id":308,"date":"2025-11-01","item":"Panda Mart","price":100,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-11"},{"id":309,"date":"2025-11-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-11"},{"id":310,"date":"2025-11-01","item":"Seraya Energy","price":113.35,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-11"},{"id":311,"date":"2025-11-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-11"},{"id":312,"date":"2025-11-01","item":"PandaMart","price":42.3,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},{"id":313,"date":"2025-11-01","item":"PandaMart","price":83.87,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},{"id":314,"date":"2025-11-01","item":"PandaMart","price":50.46,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},{"id":315,"date":"2025-11-01","item":"PandaMart","price":50.6,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},{"id":316,"date":"2025-11-01","item":"PandaMart","price":60.42,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},{"id":317,"date":"2025-11-01","item":"Finest @ Thomson Plaza","price":26.23,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},{"id":318,"date":"2025-11-01","item":"Finest @ Thomson Plaza","price":31,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},{"id":319,"date":"2025-11-01","item":"PandaMart","price":80.51,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},{"id":320,"date":"2025-11-01","item":"PandaMart","price":60,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},{"id":321,"date":"2025-11-01","item":"Food Panda","price":30,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-11"},
{"id":322,"date":"2025-12-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2025-12"},{"id":323,"date":"2025-12-01","item":"Fairprice","price":35.25,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-12"},{"id":324,"date":"2025-12-01","item":"Food Panda","price":63.12,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2025-12"},{"id":327,"date":"2025-12-01","item":"Seraya Energy","price":142.43,"paidBy":"KT","type":"Electricity","remarks":"","period":"2025-12"},{"id":328,"date":"2025-12-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2025-12"},{"id":329,"date":"2025-12-01","item":"Finest @ Thomson Plaza","price":20,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},{"id":330,"date":"2025-12-01","item":"PandaMart","price":82.42,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},{"id":331,"date":"2025-12-01","item":"PandaMart","price":65.32,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},{"id":332,"date":"2025-12-01","item":"PandaMart","price":64.4,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},{"id":333,"date":"2025-12-01","item":"PandaMart","price":50.6,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},{"id":334,"date":"2025-12-01","item":"PandaMart","price":54.22,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},{"id":335,"date":"2025-12-01","item":"PandaMart","price":101.55,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},{"id":336,"date":"2025-12-01","item":"PandaMart","price":64.66,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},{"id":337,"date":"2025-12-01","item":"Finest @ Thomson Plaza","price":136.56,"paidBy":"KT","type":"Grocery","remarks":"","period":"2025-12"},
{"id":338,"date":"2026-01-02","item":"Fairprice+Toothpaste+Daiso","price":32.06,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-01"},{"id":339,"date":"2026-01-07","item":"Urban Company","price":30,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-01"},{"id":340,"date":"2026-01-16","item":"Fairprice","price":9.89,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-01"},{"id":341,"date":"2026-01-13","item":"Splendor + Bb liz gift","price":38.9,"paidBy":"GLC","type":"Misc","remarks":"split even la","period":"2026-01"},{"id":342,"date":"2026-01-18","item":"Brighton Vet","price":46.5,"paidBy":"GLC","type":"Cat","remarks":"","period":"2026-01"},{"id":343,"date":"2026-01-01","item":"Shopee pods","price":15.06,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-01"},{"id":344,"date":"2026-01-24","item":"Cat collar and Airtag","price":16.93,"paidBy":"GLC","type":"Cat","remarks":"","period":"2026-01"},{"id":345,"date":"2026-01-02","item":"Finest @ Thomson Plaza","price":7.1,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},{"id":346,"date":"2026-01-02","item":"PandaMart","price":37.43,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},{"id":347,"date":"2026-01-05","item":"Finest @ Thomson Plaza","price":3.58,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},{"id":348,"date":"2026-01-06","item":"PandaMart","price":96.11,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},{"id":349,"date":"2026-01-13","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2026-01"},{"id":350,"date":"2026-01-13","item":"Seraya Energy","price":203.85,"paidBy":"KT","type":"Electricity","remarks":"","period":"2026-01"},{"id":351,"date":"2026-01-14","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2026-01"},{"id":352,"date":"2026-01-14","item":"PandaMart","price":94.17,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},{"id":353,"date":"2026-01-16","item":"Finest @ Thomson Plaza","price":7.1,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},{"id":354,"date":"2026-01-16","item":"PandaMart","price":94.17,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},{"id":355,"date":"2026-01-16","item":"PandaMart","price":53.42,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},{"id":356,"date":"2026-01-19","item":"PandaMart","price":57.87,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},{"id":357,"date":"2026-01-26","item":"PandaMart","price":36.45,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-01"},
{"id":358,"date":"2026-02-01","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2026-02"},{"id":359,"date":"2026-02-01","item":"Shopee pods","price":25.97,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-02"},{"id":360,"date":"2026-02-01","item":"Direct Asia","price":116.09,"paidBy":"KT","type":"Misc","remarks":"","period":"2026-02"},{"id":361,"date":"2026-02-01","item":"Seraya Energy","price":203.85,"paidBy":"KT","type":"Electricity","remarks":"","period":"2026-02"},{"id":362,"date":"2026-02-01","item":"MyRepublic Broadband","price":35.99,"paidBy":"KT","type":"Misc","remarks":"","period":"2026-02"},{"id":363,"date":"2026-02-01","item":"Finest @ Thomson Plaza","price":7.1,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-02"},{"id":364,"date":"2026-02-01","item":"PandaMart","price":53.42,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-02"},{"id":365,"date":"2026-02-01","item":"PandaMart","price":57.87,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-02"},{"id":366,"date":"2026-02-01","item":"PandaMart","price":47.2,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-02"},
{"id":367,"date":"2026-03-05","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2026-03"},{"id":368,"date":"2026-03-15","item":"BBQ (mom helped to get)","price":11.45,"paidBy":"GLC","type":"Misc","remarks":"","period":"2026-03"},{"id":369,"date":"2026-03-13","item":"BBQ (MCST)","price":16.35,"paidBy":"GLC","type":"Misc","remarks":"Deposit $100","period":"2026-03"},{"id":370,"date":"2026-03-13","item":"Butcher Box","price":105.8,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-03"},{"id":371,"date":"2026-03-11","item":"Food Panda","price":30.72,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-03"},{"id":372,"date":"2026-03-11","item":"Butcher Box","price":87,"paidBy":"GLC","type":"Grocery","remarks":"","period":"2026-03"},{"id":373,"date":"2026-03-18","item":"Remy","price":75,"paidBy":"GLC","type":"Misc","remarks":"","period":"2026-03"},{"id":374,"date":"2026-03-08","item":"Fairprice","price":57.55,"paidBy":"KT","type":"Grocery","remarks":"","period":"2026-03"},
];

const MONTHLY_META = [
{"period":"2024-06","balance_owed":-686.43},{"period":"2024-07","balance_owed":156.695},{"period":"2024-08","balance_owed":-118.095},{"period":"2024-09","balance_owed":393.575},{"period":"2024-10","balance_owed":-23.25},{"period":"2024-11","balance_owed":-572.47},{"period":"2024-12","balance_owed":-21.33},{"period":"2025-01","balance_owed":184.385},{"period":"2025-02","balance_owed":151.84},{"period":"2025-03","balance_owed":150.545},{"period":"2025-04","balance_owed":161.465},{"period":"2025-05","balance_owed":-17.91},{"period":"2025-06","balance_owed":16.415},{"period":"2025-07","balance_owed":129.73},{"period":"2025-08","balance_owed":-80.585},{"period":"2025-09","balance_owed":-133.115},{"period":"2025-10","balance_owed":165.365},{"period":"2025-11","balance_owed":-187.82},{"period":"2025-12","balance_owed":-360.6225},{"period":"2026-01","balance_owed":-327},{"period":"2026-02","balance_owed":-210.275},{"period":"2026-03","balance_owed":171.885},
];

/* ═══════════ CONSTANTS ═══════════ */
const HOUSE_TYPES = ["Grocery","Misc","Electricity","Cat","Household goods","Rent"];
const TYPE_META = {Grocery:{c:"#7a8c6e",i:"\u{1F6D2}"},Misc:{c:"#b89a7a",i:"\u{1F4E6}"},Electricity:{c:"#c9a84c",i:"\u26A1"},"Household goods":{c:"#7a9aad",i:"\u{1F3E0}"},Cat:{c:"#c48b9f",i:"\u{1F431}"},Rent:{c:"#9b8ab5",i:"\u{1F3E1}"}};
const fmt = n=>"$"+Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");
const fmtK = n=>n>=1000?"$"+(n/1000).toFixed(1)+"k":"$"+n.toFixed(0);
const pLabel = p=>{const[y,m]=p.split("-");const mn=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return mn[+m]+" '"+y.slice(2);};
const today = ()=>new Date().toISOString().split("T")[0];
const tooltipStyle={background:"#fbf8f4",border:"1px solid #e0d8ce",borderRadius:10,fontSize:12,fontFamily:"'Outfit',sans-serif",boxShadow:"0 2px 8px rgba(0,0,0,.06)"};

/* ═══════════ SHARED COMPONENTS ═══════════ */
const Card=({children,style={}})=><div style={{background:"#fff",borderRadius:14,padding:"20px 22px",border:"1px solid #ede7df",boxShadow:"0 1px 3px rgba(0,0,0,.03)",marginBottom:12,...style}}>{children}</div>;
const Label=({children})=><p style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"#bbb0a2",margin:"0 0 12px",fontWeight:500}}>{children}</p>;
const Badge=({who,color})=><span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:.5,background:who==="KT"?"#e8ded3":color||"#dce5dc",color:who==="KT"?"#8b7355":"#5c7a5c"}}>{who==="KT"?"Kenneth":who==="GLC"?"Gracelynn":who}</span>;
const Btn=({children,active,onClick,style={}})=><button onClick={onClick} style={{padding:"8px 16px",borderRadius:8,border:active?"none":"1px solid #e0d8ce",background:active?"#5c4f42":"#fff",color:active?"#f7f3ee":"#9a8e82",fontSize:12,fontWeight:500,fontFamily:"inherit",cursor:"pointer",transition:"all .2s",...style}}>{children}</button>;
const Inp=({...p})=><input {...p} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid #e0d8ce",background:"#fbf8f4",color:"#5c4f42",fontSize:14,fontFamily:"'Outfit',sans-serif",boxSizing:"border-box",...(p.style||{})}}/>;
const Sel=({...p})=><select {...p} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid #e0d8ce",background:"#fbf8f4",color:"#5c4f42",fontSize:14,fontFamily:"'Outfit',sans-serif",boxSizing:"border-box",...(p.style||{})}}/>;
const Lbl=({children})=><label style={{display:"block",fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:"#b0a395",marginBottom:5,fontWeight:500}}>{children}</label>;

/* ═══════════ MAIN APP ═══════════ */
export default function App(){
  // Account data
  const [houseTx,setHouseTx]=useState(TX_RAW.filter(t=>t.price>0));
  const [loanTx,setLoanTx]=useState([
    {id:1,date:"2025-06-15",description:"Loan for camera",amount:800,type:"Loan",remarks:""},
    {id:2,date:"2025-09-01",description:"Repayment",amount:200,type:"Repayment",remarks:"PayNow"},
    {id:3,date:"2025-12-01",description:"Repayment",amount:150,type:"Repayment",remarks:""},
  ]);
  const [friendsTx,setFriendsTx]=useState([
    {id:1,date:"2026-03-01",item:"Dinner at Burnt Ends",totalAmount:320,paidBy:"GLC",splitWith:["Mei","Sarah","Jun"],glcIncluded:true,splitMethod:"equal",customAmounts:{},remarks:""},
    {id:2,date:"2026-03-10",item:"Grab ride for Sarah",totalAmount:15,paidBy:"GLC",splitWith:["Sarah"],glcIncluded:false,splitMethod:"equal",customAmounts:{},remarks:"paid fully for her"},
  ]);

  // Navigation
  const [activeAccount,setActiveAccount]=useState("household"); // household | loan | friends
  const [activeTab,setActiveTab]=useState("overview"); // overview | entries | add
  const [showSwiper,setShowSwiper]=useState(false);

  // House filters
  const [hPeriod,setHPeriod]=useState("all");
  const [hPaidBy,setHPaidBy]=useState("All");
  const [hType,setHType]=useState("All");
  const [hSearch,setHSearch]=useState("");
  const [hSort,setHSort]=useState("date");
  const [hSortDir,setHSortDir]=useState("desc");

  // Add form state
  const [fDate,setFDate]=useState(today());
  const [fItem,setFItem]=useState("");
  const [fAmount,setFAmount]=useState("");
  const [fPaidBy,setFPaidBy]=useState("KT");
  const [fType,setFType]=useState("Grocery");
  const [fRemarks,setFRemarks]=useState("");
  const [fLoanType,setFLoanType]=useState("Loan");
  const [fSplitWith,setFSplitWith]=useState("");
  const [fSplitNames,setFSplitNames]=useState([]);
  const [fGlcIncluded,setFGlcIncluded]=useState(true);
  const [fSplitMethod,setFSplitMethod]=useState("equal");
  const [editId,setEditId]=useState(null);

  // Delete confirm
  const [delConfirm,setDelConfirm]=useState(null);

  // All known friend names
  const allFriends = useMemo(()=>{
    const s=new Set();
    friendsTx.forEach(t=>t.splitWith.forEach(n=>s.add(n)));
    return [...s].sort();
  },[friendsTx]);

  /* ── Household stats ── */
  const hPeriods = useMemo(()=>[...new Set(houseTx.map(t=>t.period))].sort(),[houseTx]);
  const hFiltered = useMemo(()=>{
    let l=[...houseTx];
    if(hPeriod!=="all") l=l.filter(t=>t.period===hPeriod);
    if(hPaidBy!=="All") l=l.filter(t=>t.paidBy===hPaidBy);
    if(hType!=="All") l=l.filter(t=>t.type===hType);
    if(hSearch) l=l.filter(t=>t.item.toLowerCase().includes(hSearch.toLowerCase()));
    l.sort((a,b)=>{
      if(hSort==="price") return hSortDir==="asc"?a.price-b.price:b.price-a.price;
      return hSortDir==="asc"?String(a[hSort]).localeCompare(String(b[hSort])):String(b[hSort]).localeCompare(String(a[hSort]));
    });
    return l;
  },[houseTx,hPeriod,hPaidBy,hType,hSearch,hSort,hSortDir]);

  const hStats = useMemo(()=>{
    const src=hPeriod==="all"?houseTx:hFiltered;
    const g=src.filter(t=>t.paidBy==="GLC").reduce((s,t)=>s+t.price,0);
    const k=src.filter(t=>t.paidBy==="KT").reduce((s,t)=>s+t.price,0);
    const byType={};src.forEach(t=>{byType[t.type]=(byType[t.type]||0)+t.price;});
    return {glc:g,kt:k,total:g+k,balance:g-k,byType};
  },[houseTx,hFiltered,hPeriod]);

  const monthlyTrend=useMemo(()=>hPeriods.map(p=>{
    const mt=houseTx.filter(t=>t.period===p);
    return{period:pLabel(p),total:mt.reduce((s,t)=>s+t.price,0),glc:mt.filter(t=>t.paidBy==="GLC").reduce((s,t)=>s+t.price,0),kt:mt.filter(t=>t.paidBy==="KT").reduce((s,t)=>s+t.price,0)};
  }),[houseTx,hPeriods]);

  /* ── Loan stats ── */
  const loanBalance = useMemo(()=>{
    return loanTx.reduce((bal,t)=>t.type==="Loan"?bal+t.amount:bal-t.amount,0);
  },[loanTx]);

  /* ── Friends stats ── */
  const friendBalances = useMemo(()=>{
    const bal={};
    friendsTx.forEach(t=>{
      const payers = t.glcIncluded ? ["GLC",...t.splitWith] : t.splitWith;
      const perPerson = t.totalAmount / payers.length;
      t.splitWith.forEach(name=>{
        if(!bal[name]) bal[name]=0;
        if(t.paidBy==="GLC") bal[name]+=perPerson; // friend owes GLC
        else if(t.paidBy===name) bal[name]-=(t.totalAmount-perPerson); // friend paid, GLC owes less? nah — if friend paid, GLC owes her share
      });
    });
    return Object.entries(bal).sort((a,b)=>b[1]-a[1]);
  },[friendsTx]);

  /* ── Form handlers ── */
  const resetForm=()=>{setFDate(today());setFItem("");setFAmount("");setFPaidBy("KT");setFType("Grocery");setFRemarks("");setFLoanType("Loan");setFSplitWith("");setFSplitNames([]);setFGlcIncluded(true);setFSplitMethod("equal");setEditId(null);};

  const handleSave=()=>{
    if(!fDate||!fAmount) return;
    if(activeAccount==="household"){
      if(!fItem) return;
      const tx={id:editId||Date.now(),date:fDate,item:fItem.trim(),price:parseFloat(fAmount),paidBy:fPaidBy,type:fType,remarks:fRemarks.trim(),period:fDate.slice(0,7)};
      if(editId) setHouseTx(p=>p.map(t=>t.id===editId?tx:t));
      else setHouseTx(p=>[...p,tx]);
    } else if(activeAccount==="loan"){
      const tx={id:editId||Date.now(),date:fDate,description:fItem.trim()||fLoanType,amount:parseFloat(fAmount),type:fLoanType,remarks:fRemarks.trim()};
      if(editId) setLoanTx(p=>p.map(t=>t.id===editId?tx:t));
      else setLoanTx(p=>[...p,tx]);
    } else {
      if(!fItem||fSplitNames.length===0) return;
      const tx={id:editId||Date.now(),date:fDate,item:fItem.trim(),totalAmount:parseFloat(fAmount),paidBy:fPaidBy==="GLC"?"GLC":fPaidBy,splitWith:fSplitNames,glcIncluded:fGlcIncluded,splitMethod:fSplitMethod,customAmounts:{},remarks:fRemarks.trim()};
      if(editId) setFriendsTx(p=>p.map(t=>t.id===editId?tx:t));
      else setFriendsTx(p=>[...p,tx]);
    }
    resetForm();
    setActiveTab("entries");
  };

  const handleDelete=(id)=>{
    if(delConfirm===id){
      if(activeAccount==="household") setHouseTx(p=>p.filter(t=>t.id!==id));
      else if(activeAccount==="loan") setLoanTx(p=>p.filter(t=>t.id!==id));
      else setFriendsTx(p=>p.filter(t=>t.id!==id));
      setDelConfirm(null);
    } else setDelConfirm(id);
  };

  const addFriendName=()=>{
    const n=fSplitWith.trim();
    if(n&&!fSplitNames.includes(n)){setFSplitNames(p=>[...p,n]);setFSplitWith("");}
  };

  const toggleHSort=f=>{if(hSort===f) setHSortDir(d=>d==="asc"?"desc":"asc"); else{setHSort(f);setHSortDir("desc");}};
  const formatDate=d=>{const dt=new Date(d+"T00:00:00");return dt.toLocaleDateString("en-SG",{day:"numeric",month:"short",year:"2-digit"});};

  const balanceHistory = MONTHLY_META.map(m=>({period:pLabel(m.period),owed:m.balance_owed}));

  /* ═══════════ RENDER ═══════════ */
  return(
    <div style={{fontFamily:"'Outfit','Nunito',sans-serif",background:"#f7f3ee",color:"#4a4440",minHeight:"100vh",paddingBottom:80}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,600&display=swap" rel="stylesheet"/>
      <style>{`*,*::before,*::after{box-sizing:border-box}::selection{background:#c8b8a4;color:#fff}input:focus,select:focus{outline:none;border-color:#b8a898!important}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.recharts-cartesian-axis-tick-value{fill:#b0a395!important;font-size:10px!important}`}</style>

      {/* ── Header ── */}
      <div style={{padding:"24px 20px 16px",borderBottom:"1px solid #e8e0d6",background:"#fbf8f4"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <p style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"#b0a395",margin:"0 0 4px",fontWeight:500}}>Hillcrest Arcadia</p>
          <h1 style={{fontSize:22,fontFamily:"'Fraunces',serif",fontWeight:600,color:"#3d3530",margin:"0 0 14px"}}>Our Ledger</h1>

          {/* Account switcher */}
          <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
            {[{k:"household",l:"\u{1F3E0} Household",cl:"#7a8c6e"},{k:"loan",l:"\u{1F4B0} Loan Ledger",cl:"#b89a7a"},{k:"friends",l:"\u{1F46D} GLC Friends",cl:"#c48b9f"}].map(a=>(
              <button key={a.k} onClick={()=>{setActiveAccount(a.k);setActiveTab("overview");resetForm();}} style={{
                padding:"8px 16px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap",transition:"all .2s",
                background:activeAccount===a.k?a.cl+"22":"transparent",
                color:activeAccount===a.k?a.cl:"#b0a090",
                borderBottom:activeAccount===a.k?`2px solid ${a.cl}`:"2px solid transparent",
              }}>{a.l}</button>
            ))}
          </div>

          {/* Tab switcher */}
          <div style={{display:"flex",gap:4,background:"#f0ebe4",borderRadius:10,padding:3}}>
            {["overview","entries","add"].map(t=>(
              <button key={t} onClick={()=>{setActiveTab(t);if(t==="add")resetForm();}} style={{
                flex:1,padding:"8px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:"inherit",transition:"all .25s",textTransform:"capitalize",
                background:activeTab===t?"#fff":"transparent",color:activeTab===t?"#5c4f42":"#b0a090",
                boxShadow:activeTab===t?"0 1px 4px rgba(0,0,0,.06)":"none",
              }}>{t==="add"?"+ Add":t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"20px 16px"}}>

        {/* ════════════ HOUSEHOLD ════════════ */}
        {activeAccount==="household"&&activeTab==="overview"&&(
          <div style={{animation:"fadeIn .3s ease"}}>
            <Card style={{textAlign:"center",padding:"28px 24px"}}>
              <Label>Latest · {pLabel(MONTHLY_META[MONTHLY_META.length-1].period)}</Label>
              {(()=>{const m=MONTHLY_META[MONTHLY_META.length-1];return(<>
                <p style={{fontSize:40,fontFamily:"'Fraunces',serif",fontWeight:600,margin:"0 0 6px",color:m.balance_owed>=0?"#b07a5b":"#7a8c6e"}}>{fmt(m.balance_owed)}</p>
                <p style={{fontSize:13,color:"#9a8e82",margin:0}}>{m.balance_owed>=0?<><Badge who="KT"/> owes <Badge who="GLC"/></>:<><Badge who="GLC"/> owes <Badge who="KT"/></>}</p>
              </>);})()}
            </Card>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
              {[{l:"Total",v:fmt(hStats.total),c:"#5c4f42"},{l:"Gracelynn",v:fmt(hStats.glc),c:"#7a8c6e"},{l:"Kenneth",v:fmt(hStats.kt),c:"#b07a5b"}].map((c,i)=>(
                <Card key={i} style={{textAlign:"center",padding:"16px 10px"}}>
                  <p style={{fontSize:10,letterSpacing:1.5,textTransform:"uppercase",color:"#bbb0a2",margin:"0 0 6px",fontWeight:500}}>{c.l}</p>
                  <p style={{fontSize:18,fontFamily:"'Fraunces',serif",fontWeight:600,color:c.c,margin:0}}>{c.v}</p>
                </Card>
              ))}
            </div>

            <Card>
              <Label>Monthly Spending</Label>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyTrend} margin={{top:5,right:5,bottom:5,left:-15}}>
                  <defs>
                    <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a3b896" stopOpacity={.4}/><stop offset="95%" stopColor="#a3b896" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gK" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d4bfa8" stopOpacity={.4}/><stop offset="95%" stopColor="#d4bfa8" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7df"/>
                  <XAxis dataKey="period" tick={{fontSize:9}} interval={3}/>
                  <YAxis tick={{fontSize:9}} tickFormatter={fmtK}/>
                  <Tooltip contentStyle={tooltipStyle} formatter={v=>"$"+v.toFixed(0)}/>
                  <Area type="monotone" dataKey="glc" name="Gracelynn" stroke="#7a8c6e" fill="url(#gG)" strokeWidth={2}/>
                  <Area type="monotone" dataKey="kt" name="Kenneth" stroke="#b89a7a" fill="url(#gK)" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <Label>Balance History</Label>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={balanceHistory} margin={{top:5,right:5,bottom:5,left:-15}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7df"/>
                  <XAxis dataKey="period" tick={{fontSize:9}} interval={3}/>
                  <YAxis tick={{fontSize:9}} tickFormatter={v=>"$"+v.toFixed(0)}/>
                  <Tooltip contentStyle={tooltipStyle} formatter={v=>[v>0?"KT owes $"+v.toFixed(2):"GLC owes $"+Math.abs(v).toFixed(2)]}/>
                  <Bar dataKey="owed" radius={[3,3,0,0]}>{balanceHistory.map((e,i)=><Cell key={i} fill={e.owed>=0?"#d4bfa8":"#a3b896"} opacity={.7}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <Label>By Category</Label>
              {Object.entries(hStats.byType).sort((a,b)=>b[1]-a[1]).map(([type,amt])=>{
                const m=TYPE_META[type]||{c:"#999",i:"\u2022"};const mx=Object.values(hStats.byType).reduce((a,b)=>Math.max(a,b),1);
                return(<div key={type} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13,display:"flex",alignItems:"center",gap:6}}><span>{m.i}</span>{type}</span>
                    <span style={{fontSize:13,fontWeight:500,color:m.c}}>{fmt(amt)}</span>
                  </div>
                  <div style={{height:4,background:"#f0ebe4",borderRadius:3,overflow:"hidden"}}><div style={{width:`${(amt/mx)*100}%`,height:"100%",background:m.c,opacity:.6,borderRadius:3}}/></div>
                </div>);
              })}
            </Card>
          </div>
        )}

        {activeAccount==="household"&&activeTab==="entries"&&(
          <div style={{animation:"fadeIn .3s ease"}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              <Sel value={hPeriod} onChange={e=>setHPeriod(e.target.value)} style={{width:"auto",flex:"0 0 auto"}}><option value="all">All months</option>{hPeriods.map(p=><option key={p} value={p}>{pLabel(p)}</option>)}</Sel>
              {["All","KT","GLC"].map(p=><Btn key={p} active={hPaidBy===p} onClick={()=>setHPaidBy(p)}>{p==="All"?"All":p==="KT"?"KT":"GLC"}</Btn>)}
              <Sel value={hType} onChange={e=>setHType(e.target.value)} style={{width:"auto",flex:"0 0 auto"}}><option value="All">All</option>{HOUSE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</Sel>
            </div>
            <Inp value={hSearch} onChange={e=>setHSearch(e.target.value)} placeholder="Search..." style={{marginBottom:12}}/>

            <div style={{display:"flex",gap:10,marginBottom:8}}>
              {[{f:"date",l:"Date"},{f:"item",l:"Name"},{f:"price",l:"Amt"}].map(s=>(
                <button key={s.f} onClick={()=>toggleHSort(s.f)} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600,color:hSort===s.f?"#5c4f42":"#c0b5a8",fontFamily:"inherit"}}>{s.l}{hSort===s.f?(hSortDir==="asc"?" \u2191":" \u2193"):""}</button>
              ))}
              <span style={{marginLeft:"auto",fontSize:11,color:"#c0b5a8"}}>{hFiltered.length}</span>
            </div>

            {hFiltered.map(tx=>{
              const m=TYPE_META[tx.type]||{c:"#999",i:"\u2022"};
              return(<div key={tx.id} style={{background:"#fff",borderRadius:12,padding:"14px 16px",marginBottom:6,border:"1px solid #ede7df",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:m.c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{m.i}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                    <p style={{fontSize:13,fontWeight:500,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:8}}>{tx.item}</p>
                    <p style={{fontSize:14,fontWeight:600,fontFamily:"'Fraunces',serif",color:tx.paidBy==="KT"?"#b07a5b":"#7a8c6e",margin:0,flexShrink:0}}>{fmt(tx.price)}</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",fontSize:11,color:"#b8ada0"}}>
                    <span>{formatDate(tx.date)}</span><span style={{color:"#ddd"}}>&middot;</span><Badge who={tx.paidBy}/><span style={{color:"#ddd"}}>&middot;</span><span style={{color:m.c}}>{tx.type}</span>
                    {tx.remarks&&<><span style={{color:"#ddd"}}>&middot;</span><span style={{fontStyle:"italic",color:"#c0b5a8"}}>{tx.remarks}</span></>}
                  </div>
                </div>
                <button onClick={()=>handleDelete(tx.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,padding:6,color:delConfirm===tx.id?"#c07070":"#ccc"}}>{delConfirm===tx.id?"Sure?":"\u{1F5D1}"}</button>
              </div>);
            })}
          </div>
        )}

        {/* ════════════ LOAN LEDGER ════════════ */}
        {activeAccount==="loan"&&activeTab==="overview"&&(
          <div style={{animation:"fadeIn .3s ease"}}>
            <Card style={{textAlign:"center",padding:"28px 24px"}}>
              <Label>Outstanding Balance</Label>
              <p style={{fontSize:44,fontFamily:"'Fraunces',serif",fontWeight:600,margin:"0 0 6px",color:loanBalance>0?"#c07070":"#7a8c6e"}}>{fmt(loanBalance)}</p>
              <p style={{fontSize:13,color:"#9a8e82",margin:0}}>{loanBalance>0?"KT owes GLC":"All settled \u2705"}</p>
            </Card>

            <Card>
              <Label>Loan Timeline</Label>
              {[...loanTx].sort((a,b)=>a.date.localeCompare(b.date)).map((tx,i)=>{
                const isLoan=tx.type==="Loan";
                let running=0;[...loanTx].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,i+1).forEach(t=>{running+=t.type==="Loan"?t.amount:-t.amount;});
                return(<div key={tx.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #f5f0ea"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:isLoan?"#c0707018":"#7a8c6e18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{isLoan?"\u{1F4B8}":"\u2705"}</div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:500,margin:0}}>{tx.description}</p>
                    <p style={{fontSize:11,color:"#b8ada0",margin:"2px 0 0"}}>{formatDate(tx.date)}{tx.remarks&&` \u2022 ${tx.remarks}`}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{fontSize:14,fontFamily:"'Fraunces',serif",fontWeight:600,color:isLoan?"#c07070":"#7a8c6e",margin:0}}>{isLoan?"+":"-"}{fmt(tx.amount)}</p>
                    <p style={{fontSize:10,color:"#c0b5a8",margin:"2px 0 0"}}>Bal: {fmt(running)}</p>
                  </div>
                </div>);
              })}
            </Card>
          </div>
        )}

        {activeAccount==="loan"&&activeTab==="entries"&&(
          <div style={{animation:"fadeIn .3s ease"}}>
            {[...loanTx].sort((a,b)=>b.date.localeCompare(a.date)).map(tx=>(
              <div key={tx.id} style={{background:"#fff",borderRadius:12,padding:"14px 16px",marginBottom:6,border:"1px solid #ede7df",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:tx.type==="Loan"?"#c0707018":"#7a8c6e18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{tx.type==="Loan"?"\u{1F4B8}":"\u2705"}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <p style={{fontSize:13,fontWeight:500,margin:0}}>{tx.description}</p>
                    <p style={{fontSize:14,fontFamily:"'Fraunces',serif",fontWeight:600,color:tx.type==="Loan"?"#c07070":"#7a8c6e",margin:0}}>{fmt(tx.amount)}</p>
                  </div>
                  <p style={{fontSize:11,color:"#b8ada0",margin:0}}>{formatDate(tx.date)} &middot; {tx.type}{tx.remarks&&` \u2022 ${tx.remarks}`}</p>
                </div>
                <button onClick={()=>handleDelete(tx.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,padding:6,color:delConfirm===tx.id?"#c07070":"#ccc"}}>{delConfirm===tx.id?"Sure?":"\u{1F5D1}"}</button>
              </div>
            ))}
          </div>
        )}

        {/* ════════════ GLC FRIENDS ════════════ */}
        {activeAccount==="friends"&&activeTab==="overview"&&(
          <div style={{animation:"fadeIn .3s ease"}}>
            <Card>
              <Label>Who Owes Gracelynn</Label>
              {friendBalances.length===0&&<p style={{fontSize:13,color:"#c0b5a8",textAlign:"center",padding:20}}>No splits yet</p>}
              {friendBalances.map(([name,bal])=>(
                <div key={name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:"1px solid #f5f0ea"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:"#c48b9f18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:600,color:"#c48b9f"}}>{name[0]}</div>
                    <span style={{fontSize:14,fontWeight:500}}>{name}</span>
                  </div>
                  <span style={{fontSize:16,fontFamily:"'Fraunces',serif",fontWeight:600,color:bal>0?"#c07070":"#7a8c6e"}}>{bal>0?"+":""}{fmt(bal)}</span>
                </div>
              ))}
            </Card>

            <Card>
              <Label>Recent Splits</Label>
              {[...friendsTx].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,10).map(tx=>(
                <div key={tx.id} style={{padding:"12px 0",borderBottom:"1px solid #f5f0ea"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <p style={{fontSize:13,fontWeight:500,margin:0}}>{tx.item}</p>
                    <p style={{fontSize:14,fontFamily:"'Fraunces',serif",fontWeight:600,color:"#c48b9f",margin:0}}>{fmt(tx.totalAmount)}</p>
                  </div>
                  <p style={{fontSize:11,color:"#b8ada0",margin:0}}>{formatDate(tx.date)} &middot; Paid by {tx.paidBy} &middot; Split with {tx.splitWith.join(", ")}{tx.glcIncluded?" + GLC":""}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {activeAccount==="friends"&&activeTab==="entries"&&(
          <div style={{animation:"fadeIn .3s ease"}}>
            {[...friendsTx].sort((a,b)=>b.date.localeCompare(a.date)).map(tx=>(
              <div key={tx.id} style={{background:"#fff",borderRadius:12,padding:"14px 16px",marginBottom:6,border:"1px solid #ede7df"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <p style={{fontSize:13,fontWeight:500,margin:0}}>{tx.item}</p>
                  <p style={{fontSize:14,fontFamily:"'Fraunces',serif",fontWeight:600,color:"#c48b9f",margin:0}}>{fmt(tx.totalAmount)}</p>
                </div>
                <p style={{fontSize:11,color:"#b8ada0",margin:"0 0 4px"}}>{formatDate(tx.date)} &middot; Paid by {tx.paidBy}{tx.remarks&&` \u2022 ${tx.remarks}`}</p>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {tx.splitWith.map(n=><span key={n} style={{padding:"2px 8px",borderRadius:12,fontSize:10,background:"#c48b9f18",color:"#c48b9f",fontWeight:500}}>{n}</span>)}
                  {tx.glcIncluded&&<span style={{padding:"2px 8px",borderRadius:12,fontSize:10,background:"#dce5dc",color:"#5c7a5c",fontWeight:500}}>+ GLC</span>}
                </div>
                <button onClick={()=>handleDelete(tx.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,padding:"4px 0",color:delConfirm===tx.id?"#c07070":"#ccc",marginTop:6}}>{delConfirm===tx.id?"Tap again to delete":"\u{1F5D1} Delete"}</button>
              </div>
            ))}
          </div>
        )}

        {/* ════════════ UNIVERSAL ADD FORM ════════════ */}
        {activeTab==="add"&&(
          <div style={{animation:"fadeIn .3s ease"}}>
            <Card style={{padding:24}}>
              <p style={{fontSize:16,fontFamily:"'Fraunces',serif",fontWeight:600,color:"#5c4f42",margin:"0 0 20px"}}>
                {activeAccount==="household"?"New Household Entry":activeAccount==="loan"?"New Loan Entry":"New Friends Split"}
              </p>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div><Lbl>Date</Lbl><Inp type="date" value={fDate} onChange={e=>setFDate(e.target.value)}/></div>
                <div><Lbl>Amount ($)</Lbl><Inp type="number" step="0.01" value={fAmount} onChange={e=>setFAmount(e.target.value)} placeholder="0.00"/></div>
              </div>

              <div style={{marginBottom:12}}>
                <Lbl>{activeAccount==="loan"?"Description":"Item"}</Lbl>
                <Inp value={fItem} onChange={e=>setFItem(e.target.value)} placeholder={activeAccount==="loan"?"e.g. Loan for camera":"e.g. Dinner at Burnt Ends"}/>
              </div>

              {/* Household-specific */}
              {activeAccount==="household"&&(<>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  <div>
                    <Lbl>Paid by</Lbl>
                    <div style={{display:"flex",gap:6}}>
                      {["KT","GLC"].map(p=>(
                        <button key={p} onClick={()=>setFPaidBy(p)} style={{flex:1,padding:"10px 0",borderRadius:10,border:fPaidBy===p?"none":"1px solid #e0d8ce",cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:"inherit",background:fPaidBy===p?(p==="KT"?"#d4bfa8":"#a3b896"):"#fff",color:fPaidBy===p?"#fff":"#b0a090"}}>{p==="KT"?"Kenneth":"Gracelynn"}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Lbl>Category</Lbl>
                    <Sel value={fType} onChange={e=>setFType(e.target.value)}>{HOUSE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</Sel>
                  </div>
                </div>
              </>)}

              {/* Loan-specific */}
              {activeAccount==="loan"&&(
                <div style={{marginBottom:12}}>
                  <Lbl>Type</Lbl>
                  <div style={{display:"flex",gap:6}}>
                    {["Loan","Repayment"].map(t=>(
                      <button key={t} onClick={()=>setFLoanType(t)} style={{flex:1,padding:"10px 0",borderRadius:10,border:fLoanType===t?"none":"1px solid #e0d8ce",cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:"inherit",background:fLoanType===t?(t==="Loan"?"#c07070":"#7a8c6e"):"#fff",color:fLoanType===t?"#fff":"#b0a090"}}>{t==="Loan"?"GLC \u2192 KT Loan":"KT \u2192 GLC Repay"}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Friends-specific */}
              {activeAccount==="friends"&&(<>
                <div style={{marginBottom:12}}>
                  <Lbl>Paid by</Lbl>
                  <Inp value={fPaidBy} onChange={e=>setFPaidBy(e.target.value)} placeholder="GLC or friend's name"/>
                </div>
                <div style={{marginBottom:12}}>
                  <Lbl>Split with</Lbl>
                  <div style={{display:"flex",gap:6,marginBottom:8}}>
                    <Inp value={fSplitWith} onChange={e=>setFSplitWith(e.target.value)} placeholder="Type name & press Add" onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addFriendName();}}} style={{flex:1}}/>
                    <button onClick={addFriendName} style={{padding:"10px 16px",borderRadius:10,border:"none",background:"#5c4f42",color:"#f7f3ee",fontSize:13,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>Add</button>
                  </div>
                  {allFriends.length>0&&fSplitNames.length===0&&(
                    <div style={{marginBottom:8}}>
                      <p style={{fontSize:10,color:"#c0b5a8",margin:"0 0 4px"}}>Recent friends:</p>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{allFriends.map(n=>(
                        <button key={n} onClick={()=>setFSplitNames(p=>[...p,n])} style={{padding:"4px 10px",borderRadius:12,border:"1px solid #e0d8ce",background:"#fff",fontSize:11,color:"#9a8e82",cursor:"pointer",fontFamily:"inherit"}}>+ {n}</button>
                      ))}</div>
                    </div>
                  )}
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {fSplitNames.map(n=>(
                      <span key={n} style={{padding:"4px 10px",borderRadius:12,fontSize:12,background:"#c48b9f18",color:"#c48b9f",fontWeight:500,display:"flex",alignItems:"center",gap:4}}>
                        {n}<button onClick={()=>setFSplitNames(p=>p.filter(x=>x!==n))} style={{background:"none",border:"none",cursor:"pointer",color:"#c48b9f",fontSize:14,padding:0}}>&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  <div>
                    <Lbl>GLC included in split?</Lbl>
                    <div style={{display:"flex",gap:6}}>
                      {[true,false].map(v=>(
                        <button key={String(v)} onClick={()=>setFGlcIncluded(v)} style={{flex:1,padding:"10px 0",borderRadius:10,border:fGlcIncluded===v?"none":"1px solid #e0d8ce",cursor:"pointer",fontSize:12,fontWeight:500,fontFamily:"inherit",background:fGlcIncluded===v?"#7a8c6e":"#fff",color:fGlcIncluded===v?"#fff":"#b0a090"}}>{v?"Yes":"No"}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Lbl>Split method</Lbl>
                    <Sel value={fSplitMethod} onChange={e=>setFSplitMethod(e.target.value)}><option value="equal">Equal</option><option value="custom">Custom amounts</option></Sel>
                  </div>
                </div>
              </>)}

              <div style={{marginBottom:16}}>
                <Lbl>Remarks <span style={{fontWeight:300,color:"#c8bfb4"}}>(optional)</span></Lbl>
                <Inp value={fRemarks} onChange={e=>setFRemarks(e.target.value)} placeholder="Any notes?"/>
              </div>

              <button onClick={handleSave} disabled={!fDate||!fAmount||(activeAccount!=="loan"&&!fItem)||(activeAccount==="friends"&&fSplitNames.length===0)} style={{
                width:"100%",padding:"14px",borderRadius:12,border:"none",fontSize:15,fontWeight:600,fontFamily:"inherit",cursor:"pointer",
                background:(!fDate||!fAmount)?"#d8d0c6":"#5c4f42",color:"#f7f3ee",transition:"all .2s",
              }}>Save Entry</button>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
