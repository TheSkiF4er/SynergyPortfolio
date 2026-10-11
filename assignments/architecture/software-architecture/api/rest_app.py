from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from store import STORE
app = FastAPI(title='MarketHub REST Product API')
class ProductInput(BaseModel):
    sku:str; title:str; description:str=''; category:str='general'; price:float=Field(ge=0); currency:str='RUB'; stock_qty:int=Field(default=0,ge=0); status:str='active'; seller_id:str
class ProductPatch(BaseModel):
    sku:str|None=None; title:str|None=None; description:str|None=None; category:str|None=None; price:float|None=Field(default=None,ge=0); currency:str|None=None; stock_qty:int|None=Field(default=None,ge=0); status:str|None=None; seller_id:str|None=None
@app.post('/products', status_code=201)
def create_product(body:ProductInput): return STORE.create(body.model_dump())
@app.get('/products')
def list_products(category:str|None=None,status:str|None=None,seller_id:str|None=None): return STORE.list(category=category,status=status,seller_id=seller_id)
@app.get('/products/{product_id}')
def get_product(product_id:str):
    item=STORE.get(product_id)
    if not item: raise HTTPException(404,'Product not found')
    return item
@app.patch('/products/{product_id}')
def update_product(product_id:str, body:ProductPatch):
    item=STORE.update(product_id, body.model_dump(exclude_none=True))
    if not item: raise HTTPException(404,'Product not found')
    return item
@app.delete('/products/{product_id}', status_code=204)
def delete_product(product_id:str):
    if not STORE.delete(product_id): raise HTTPException(404,'Product not found')
