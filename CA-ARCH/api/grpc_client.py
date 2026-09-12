import json, grpc
def ser(v): return json.dumps(v).encode()
def de(v): return json.loads(v.decode())
channel=grpc.insecure_channel('127.0.0.1:50051')
def call(name,payload): return channel.unary_unary(f'/markethub.product.v1.ProductService/{name}',request_serializer=ser,response_deserializer=de)(payload)
if __name__=='__main__':
    p=call('Create',{'sku':'LAB-1','title':'Demo','description':'gRPC','category':'digital','price':199.0,'currency':'RUB','stock_qty':10,'status':'active','seller_id':'seller-1'})
    print('created',p);print('get',call('Get',{'id':p['id']}));print('list',call('List',{'category':'digital'}));print('updated',call('Update',{'id':p['id'],'product':{'title':'Updated'}}));print('deleted',call('Delete',{'id':p['id']}))
