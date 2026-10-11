<?php
declare(strict_types=1); namespace UserSystem;
abstract class AbstractPerson {
    protected string $name; protected string $email; protected string $passwordHash; protected int $age; protected string $identifier;
    public function __construct(string $name,string $email,string $password){ if(trim($name)===''||filter_var($email,FILTER_VALIDATE_EMAIL)===false) throw new UserException('Некорректные данные пользователя.'); $this->name=$name;$this->email=$email;$this->passwordHash=password_hash($password,PASSWORD_DEFAULT);$this->age=random_int(18,80);$this->identifier=bin2hex(random_bytes(4)); }
    abstract public function describe(): string; abstract public function roleName(): string;
    public function __get(string $name):mixed{ throw new UserException("Свойство {$name} не существует или недоступно."); }
    public function __set(string $name,mixed $value):void{ throw new UserException("Нельзя установить свойство {$name}."); }
    public function __call(string $name,array $args):mixed{ throw new UserException("Метод {$name} не существует."); }
    public function __clone(){ $this->identifier=bin2hex(random_bytes(4)); $this->age=random_int(18,80); }
}
