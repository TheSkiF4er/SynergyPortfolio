<?php
declare(strict_types=1); foreach(glob(__DIR__.'/src/*.php') as $file) require_once $file;
use UserSystem\{User,Client,Administrator,Authentication,Roles,Permissions,UserException};
$storage=__DIR__.'/storage'; if(!is_dir($storage)) mkdir($storage,0777,true);
try {
 $user=new User('Анна','anna@example.test','Strong!1'); $client=new Client('Иван','ivan@example.test','Strong!2'); $admin=new Administrator('Максим','max@example.test','Strong!3');
 echo $user->describe().PHP_EOL.$client->describe().PHP_EOL.$admin->describe().PHP_EOL;
 $clone=clone $user; echo 'Clone: '.$clone->describe().PHP_EOL; echo 'Active: '.($user->isActive()?'yes':'no').PHP_EOL; $user->activate(); echo 'Active: '.($user->isActive()?'yes':'no').PHP_EOL; $user->deactivate();
 $auth=new Authentication(); echo 'Auth: '.($auth->authenticate($user,'anna@example.test','Strong!1')?'OK':'FAIL').PHP_EOL;
 $roles=new Roles();$roles->assign($user,'editor');$permissions=new Permissions();$permissions->grant($user,'articles.write');echo 'Role/permission: '.($roles->has($user,'editor')&&$permissions->has($user,'articles.write')?'OK':'FAIL').PHP_EOL;
 foreach([$user,$clone] as $n=>$object){$file=$storage.'/user'.$n.'.txt';file_put_contents($file,serialize($object));$restored=unserialize((string)file_get_contents($file),['allowed_classes'=>[User::class]]);echo 'Restored: '.$restored->describe().PHP_EOL;unlink($file);} 
 try{$user->missingMethod();}catch(UserException $e){echo 'Magic: '.$e->getMessage().PHP_EOL;}
} catch(UserException $e){echo 'User error: '.$e->getMessage().PHP_EOL;} finally { echo 'Resources released'.PHP_EOL; }
