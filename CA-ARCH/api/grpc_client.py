import grpc
import product_pb2
import product_pb2_grpc

def main(address='127.0.0.1:50051'):
    with grpc.insecure_channel(address) as channel:
        client = product_pb2_grpc.ProductServiceStub(channel)
        created = client.Create(product_pb2.ProductRequest(sku='LAB-1', title='Demo', description='gRPC', category='digital', price=199.0, currency='RUB', stock_qty=10, status='active', seller_id='seller-1'))
        print('created', created)
        print('get', client.Get(product_pb2.IdRequest(id=created.id)))
        print('list', client.List(product_pb2.ProductFilter(category='digital')))
        print('updated', client.Update(product_pb2.UpdateRequest(id=created.id, product=product_pb2.ProductRequest(title='Updated'))))
        print('deleted', client.Delete(product_pb2.IdRequest(id=created.id)))

if __name__ == '__main__': main()
