# 14 — MySQL: схема интернет-магазина

Созданы `clients`, `products`, `material`, `orders`, внешние ключи и минимум три тестовые записи в каждую справочную таблицу. Методичка перечисляет у `orders` три FK-поля, но итоговый запрос требует дату заказа, поэтому добавлено поле `order_date`.

```bash
mysql -u root -p < schema.sql
mysql -u root -p synergy_php < query.sql
```
