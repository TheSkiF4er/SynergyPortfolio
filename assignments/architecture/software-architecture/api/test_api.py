from concurrent import futures
import grpc
import pytest
from fastapi.testclient import TestClient

import product_pb2
import product_pb2_grpc
from grpc_server import ProductService
from rest_app import app as rest_app


def payload(sku='T-1'):
    return {
        'sku': sku,
        'title': 'Test product',
        'description': 'Educational API test',
        'category': 'digital',
        'price': 199.0,
        'currency': 'RUB',
        'stock_qty': 2,
        'status': 'active',
        'seller_id': 'seller-test',
    }


def test_rest_crud():
    client = TestClient(rest_app)
    created = client.post('/products', json=payload('REST-1'))
    assert created.status_code == 201
    product = created.json()
    product_id = product['id']
    assert client.get(f'/products/{product_id}').json()['sku'] == 'REST-1'
    assert client.patch(f'/products/{product_id}', json={'title': 'Updated'}).json()['title'] == 'Updated'
    assert client.delete(f'/products/{product_id}').status_code == 204
    assert client.get(f'/products/{product_id}').status_code == 404


def test_grpc_protobuf_crud():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=2))
    product_pb2_grpc.add_ProductServiceServicer_to_server(ProductService(), server)
    port = server.add_insecure_port('127.0.0.1:0')
    server.start()
    try:
        with grpc.insecure_channel(f'127.0.0.1:{port}') as channel:
            stub = product_pb2_grpc.ProductServiceStub(channel)
            created = stub.Create(product_pb2.ProductRequest(**payload('GRPC-1')))
            assert created.id and created.sku == 'GRPC-1'
            assert stub.Get(product_pb2.IdRequest(id=created.id)).title == 'Test product'
            listed = stub.List(product_pb2.ProductFilter(category='digital'))
            assert any(item.id == created.id for item in listed.items)
            updated = stub.Update(product_pb2.UpdateRequest(id=created.id, product=product_pb2.ProductRequest(title='Updated by gRPC')))
            assert updated.title == 'Updated by gRPC'
            assert stub.Delete(product_pb2.IdRequest(id=created.id)).deleted is True
    finally:
        server.stop(0).wait()


def test_graphql_crud_when_dependency_available():
    pytest.importorskip('graphql')
    from graphql_app import app as graphql_app
    client = TestClient(graphql_app)
    create_query = '''mutation($input: ProductInput!){ createProduct(input:$input){ id sku title } }'''
    response = client.post('/graphql', json={'query': create_query, 'variables': {'input': payload('GQL-1')}})
    assert response.status_code == 200
    created = response.json()['data']['createProduct']
    assert created['sku'] == 'GQL-1'
    product_id = created['id']
    query = '''query($id: ID!){ product(id:$id){ id sku title } }'''
    fetched = client.post('/graphql', json={'query': query, 'variables': {'id': product_id}})
    assert fetched.json()['data']['product']['id'] == product_id
    delete_query = '''mutation($id:ID!){ deleteProduct(id:$id) }'''
    deleted = client.post('/graphql', json={'query': delete_query, 'variables': {'id': product_id}})
    assert deleted.json()['data']['deleteProduct'] is True
