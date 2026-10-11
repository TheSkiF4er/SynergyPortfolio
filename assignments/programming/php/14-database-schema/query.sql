SELECT c.full_name AS customer, c.phone, m.name AS material, p.name AS product, o.order_date
FROM orders o JOIN clients c ON c.id=o.clientID JOIN products p ON p.id=o.productID JOIN material m ON m.id=o.materialID
ORDER BY o.order_date, o.id;
