import test from 'node:test';
import assert from 'node:assert/strict';
import {AppConfig,ChangeStatusCommand,MemoryRepository,OrderBuilder,PremiumPricing,PriceAtMost,ProductFactory,UnitOfWork} from './dist/index.js';
test('creational',()=>{assert.equal(AppConfig.instance,AppConfig.instance);assert.equal(new OrderBuilder().buyer('u').add('p').build().items.length,1)});
test('strategy/specification',()=>{const p=ProductFactory.create('digital','A',100);assert.equal(new PremiumPricing().price(p.price),90);assert.equal(new PriceAtMost(100).isSatisfiedBy(p),true)});
test('command/repository/uow',()=>{const p=ProductFactory.create('digital','A',100);const c=new ChangeStatusCommand(p,'active');c.execute();c.undo();assert.equal(p.status,'draft');const repo=new MemoryRepository();const u=new UnitOfWork();u.register(()=>repo.save(p));u.commit();assert.equal(repo.get(p.id)?.title,'A')});
