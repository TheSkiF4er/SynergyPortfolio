# Product API: REST + GraphQL + gRPC

Одна модель Product и один in-memory store демонстрируются через три транспорта: REST/FastAPI, GraphQL и **настоящий protobuf gRPC**.

## gRPC

`product.proto` является источником контракта. Сгенерированные Python bindings (`product_pb2.py`, `product_pb2_grpc.py`) сохранены в репозитории, поэтому для runtime достаточно `grpcio` + `protobuf`.

Для повторной генерации после изменения `.proto`:

```bash
python -m pip install -r requirements-dev.txt
./generate_grpc.sh
```

Запуск:

```bash
python grpc_server.py
python grpc_client.py
```

## REST

```bash
uvicorn rest_app:app --reload --port 8000
```

OpenAPI-контракт: `openapi.yaml`.

## GraphQL

```bash
python graphql_app.py
```

SDL: `schema.graphql`.
