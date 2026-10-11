export type Product = {id:string; kind:'digital'|'service'; title:string; price:number; status:'draft'|'active'|'archived'};
export class ProductFactory { static create(kind:Product['kind'],title:string,price:number):Product{return{id:crypto.randomUUID(),kind,title,price,status:'draft'}} }
export class OrderBuilder { private buyerId=''; private items:string[]=[]; buyer(id:string){this.buyerId=id;return this} add(id:string){this.items.push(id);return this} build(){if(!this.buyerId||!this.items.length)throw new Error('Invalid order');return{buyerId:this.buyerId,items:[...this.items]}} }
export class AppConfig { private static value:AppConfig|undefined; readonly currency='RUB'; private constructor(){} static get instance(){return this.value??(this.value=new AppConfig())} }
export interface PaymentGateway {pay(amount:number):Promise<string>}
export type LegacyPSP={makePayment(payload:{sum:number}):Promise<{id:string}>};
export class LegacyPaymentAdapter implements PaymentGateway {constructor(private readonly psp:LegacyPSP){} async pay(amount:number){return (await this.psp.makePayment({sum:amount})).id} }
export class LoggingPaymentDecorator implements PaymentGateway {constructor(private readonly inner:PaymentGateway,private readonly log:(m:string)=>void){} async pay(amount:number){this.log(`pay:${amount}`);return this.inner.pay(amount)} }
export class CheckoutFacade {constructor(private readonly payment:PaymentGateway){} async checkout(total:number){const paymentId=await this.payment.pay(total);return{paymentId,total}} }
export interface PricingStrategy {price(base:number):number}
export class RegularPricing implements PricingStrategy {price(base:number){return base}}
export class PremiumPricing implements PricingStrategy {price(base:number){return base*.9}}
export class EventBus {private listeners=new Map<string,Set<(p:unknown)=>void>>();on(e:string,fn:(p:unknown)=>void){const set=this.listeners.get(e)??new Set();set.add(fn);this.listeners.set(e,set);return()=>set.delete(fn)}emit(e:string,p:unknown){this.listeners.get(e)?.forEach(fn=>fn(p))}}
export class ChangeStatusCommand {private previous:Product['status'];constructor(private product:Product,private next:Product['status']){this.previous=product.status}execute(){this.product.status=this.next}undo(){this.product.status=this.previous}}
export interface Repository<T extends{id:string}>{get(id:string):T|undefined;save(value:T):void}
export class MemoryRepository<T extends{id:string}> implements Repository<T>{private data=new Map<string,T>();get(id:string){return this.data.get(id)}save(value:T){this.data.set(value.id,value)}}
export interface Specification<T>{isSatisfiedBy(value:T):boolean}
export class PriceAtMost implements Specification<Product>{constructor(private readonly limit:number){}isSatisfiedBy(value:Product){return value.price<=this.limit}}
export class UnitOfWork {private actions:(()=>void)[]=[];register(action:()=>void){this.actions.push(action)}commit(){for(const action of this.actions)action();this.actions=[]}rollback(){this.actions=[]}}
