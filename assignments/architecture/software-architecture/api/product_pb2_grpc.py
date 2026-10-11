# Generated-style gRPC bindings for product.proto.
import grpc
import product_pb2 as product__pb2

class ProductServiceStub:
    def __init__(self, channel):
        self.Create = channel.unary_unary('/markethub.product.v1.ProductService/Create', request_serializer=product__pb2.ProductRequest.SerializeToString, response_deserializer=product__pb2.Product.FromString)
        self.Get = channel.unary_unary('/markethub.product.v1.ProductService/Get', request_serializer=product__pb2.IdRequest.SerializeToString, response_deserializer=product__pb2.Product.FromString)
        self.List = channel.unary_unary('/markethub.product.v1.ProductService/List', request_serializer=product__pb2.ProductFilter.SerializeToString, response_deserializer=product__pb2.ProductList.FromString)
        self.Update = channel.unary_unary('/markethub.product.v1.ProductService/Update', request_serializer=product__pb2.UpdateRequest.SerializeToString, response_deserializer=product__pb2.Product.FromString)
        self.Delete = channel.unary_unary('/markethub.product.v1.ProductService/Delete', request_serializer=product__pb2.IdRequest.SerializeToString, response_deserializer=product__pb2.DeleteResult.FromString)

class ProductServiceServicer:
    def Create(self, request, context): context.abort(grpc.StatusCode.UNIMPLEMENTED, 'Not implemented')
    def Get(self, request, context): context.abort(grpc.StatusCode.UNIMPLEMENTED, 'Not implemented')
    def List(self, request, context): context.abort(grpc.StatusCode.UNIMPLEMENTED, 'Not implemented')
    def Update(self, request, context): context.abort(grpc.StatusCode.UNIMPLEMENTED, 'Not implemented')
    def Delete(self, request, context): context.abort(grpc.StatusCode.UNIMPLEMENTED, 'Not implemented')

def add_ProductServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
        'Create': grpc.unary_unary_rpc_method_handler(servicer.Create, request_deserializer=product__pb2.ProductRequest.FromString, response_serializer=product__pb2.Product.SerializeToString),
        'Get': grpc.unary_unary_rpc_method_handler(servicer.Get, request_deserializer=product__pb2.IdRequest.FromString, response_serializer=product__pb2.Product.SerializeToString),
        'List': grpc.unary_unary_rpc_method_handler(servicer.List, request_deserializer=product__pb2.ProductFilter.FromString, response_serializer=product__pb2.ProductList.SerializeToString),
        'Update': grpc.unary_unary_rpc_method_handler(servicer.Update, request_deserializer=product__pb2.UpdateRequest.FromString, response_serializer=product__pb2.Product.SerializeToString),
        'Delete': grpc.unary_unary_rpc_method_handler(servicer.Delete, request_deserializer=product__pb2.IdRequest.FromString, response_serializer=product__pb2.DeleteResult.SerializeToString),
    }
    server.add_generic_rpc_handlers((grpc.method_handlers_generic_handler('markethub.product.v1.ProductService', rpc_method_handlers),))
