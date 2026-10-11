from __future__ import annotations
from dataclasses import dataclass, asdict, replace
from threading import Lock
from uuid import uuid4

@dataclass(frozen=True)
class Product:
    id: str
    sku: str
    title: str
    description: str
    category: str
    price: float
    currency: str
    stock_qty: int
    status: str
    seller_id: str

class ProductStore:
    def __init__(self):
        self._lock = Lock()
        self._items: dict[str, Product] = {}
    def create(self, data: dict) -> dict:
        price = float(data['price']); stock = int(data.get('stock_qty', 0))
        if price < 0 or stock < 0: raise ValueError('price/stock must be non-negative')
        item = Product(id=str(uuid4()), sku=str(data['sku']), title=str(data['title']), description=str(data.get('description','')), category=str(data.get('category','general')), price=price, currency=str(data.get('currency','RUB')), stock_qty=stock, status=str(data.get('status','active')), seller_id=str(data['seller_id']))
        with self._lock: self._items[item.id] = item
        return asdict(item)
    def get(self, product_id: str) -> dict | None:
        item = self._items.get(product_id); return asdict(item) if item else None
    def list(self, **filters) -> list[dict]:
        items = list(self._items.values())
        for key, value in filters.items():
            if value not in (None, ''): items = [x for x in items if str(getattr(x, key, '')) == str(value)]
        return [asdict(x) for x in items]
    def update(self, product_id: str, patch: dict) -> dict | None:
        with self._lock:
            item = self._items.get(product_id)
            if not item: return None
            allowed = {k:v for k,v in patch.items() if k in Product.__dataclass_fields__ and k != 'id'}
            if 'price' in allowed:
                allowed['price'] = float(allowed['price'])
                if allowed['price'] < 0: raise ValueError('price must be non-negative')
            if 'stock_qty' in allowed:
                allowed['stock_qty'] = int(allowed['stock_qty'])
                if allowed['stock_qty'] < 0: raise ValueError('stock must be non-negative')
            item = replace(item, **allowed); self._items[product_id] = item; return asdict(item)
    def delete(self, product_id: str) -> bool:
        with self._lock: return self._items.pop(product_id, None) is not None
STORE = ProductStore()
