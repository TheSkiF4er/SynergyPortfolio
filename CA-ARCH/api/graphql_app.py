from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from graphql import build_schema, graphql_sync
from store import STORE
SDL = '''
type Product { id: ID!, sku: String!, title: String!, description: String!, category: String!, price: Float!, currency: String!, stock_qty: Int!, status: String!, seller_id: String! }
input ProductInput { sku:String!, title:String!, description:String="", category:String="general", price:Float!, currency:String="RUB", stock_qty:Int=0, status:String="active", seller_id:String! }
input ProductPatch { sku:String, title:String, description:String, category:String, price:Float, currency:String, stock_qty:Int, status:String, seller_id:String }
type Query { product(id:ID!):Product, products(category:String,status:String,seller_id:String):[Product!]! }
type Mutation { createProduct(input:ProductInput!):Product!, updateProduct(id:ID!,input:ProductPatch!):Product, deleteProduct(id:ID!):Boolean! }
'''
schema = build_schema(SDL)
schema.get_type('Query').fields['product'].resolve = lambda _obj,_info,id: STORE.get(id)
schema.get_type('Query').fields['products'].resolve = lambda _obj,_info,**kw: STORE.list(**kw)
schema.get_type('Mutation').fields['createProduct'].resolve = lambda _obj,_info,input: STORE.create(input)
schema.get_type('Mutation').fields['updateProduct'].resolve = lambda _obj,_info,id,input: STORE.update(id,input)
schema.get_type('Mutation').fields['deleteProduct'].resolve = lambda _obj,_info,id: STORE.delete(id)
app = FastAPI(title='MarketHub GraphQL Product API')
@app.post('/graphql')
async def graphql_endpoint(request:Request):
    body=await request.json(); result=graphql_sync(schema, body.get('query',''), variable_values=body.get('variables'))
    payload={'data':result.data}
    if result.errors: payload['errors']=[{'message':e.message} for e in result.errors]
    return JSONResponse(payload, status_code=400 if result.errors else 200)
