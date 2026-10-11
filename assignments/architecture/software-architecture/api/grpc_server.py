from concurrent import futures
import grpc
import product_pb2
import product_pb2_grpc
from store import STORE

def product_message(item):
    return product_pb2.Product(**item)

def request_dict(request):
    return {
        'sku': request.sku, 'title': request.title, 'description': request.description,
        'category': request.category, 'price': request.price, 'currency': request.currency,
        'stock_qty': request.stock_qty, 'status': request.status, 'seller_id': request.seller_id,
    }

class ProductService(product_pb2_grpc.ProductServiceServicer):
    def Create(self, request, context):
        return product_message(STORE.create(request_dict(request)))
    def Get(self, request, context):
        item = STORE.get(request.id)
        if not item: context.abort(grpc.StatusCode.NOT_FOUND, 'Product not found')
        return product_message(item)
    def List(self, request, context):
        filters = {k: v for k, v in {'category': request.category, 'status': request.status, 'seller_id': request.seller_id}.items() if v}
        return product_pb2.ProductList(items=[product_message(x) for x in STORE.list(**filters)])
    def Update(self, request, context):
        patch = {k: v for k, v in request_dict(request.product).items() if v not in ('', 0, 0.0)}
        item = STORE.update(request.id, patch)
        if not item: context.abort(grpc.StatusCode.NOT_FOUND, 'Product not found')
        return product_message(item)
    def Delete(self, request, context):
        return product_pb2.DeleteResult(deleted=STORE.delete(request.id))

def serve(address='127.0.0.1:50051'):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=4))
    product_pb2_grpc.add_ProductServiceServicer_to_server(ProductService(), server)
    server.add_insecure_port(address)
    server.start()
    print(f'gRPC {address}')
    return server

if __name__ == '__main__':
    serve().wait_for_termination()
