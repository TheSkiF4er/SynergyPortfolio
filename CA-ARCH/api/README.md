# Product API — REST / GraphQL / gRPC

Product содержит 10 полей: `id`, `sku`, `title`, `description`, `category`, `price`, `currency`, `stock_qty`, `status`, `seller_id`. Все реализации используют in-memory `ProductStore` и поддерживают create/get/filter/update/delete.

- REST: `uvicorn rest_app:app --app-dir CA-ARCH/api --port 8000`
- GraphQL: установить `requirements.txt`, затем `uvicorn graphql_app:app --app-dir CA-ARCH/api --port 8001`
- gRPC: `python CA-ARCH/api/grpc_server.py`, во втором терминале `python CA-ARCH/api/grpc_client.py`
