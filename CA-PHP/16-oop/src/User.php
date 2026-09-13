<?php
declare(strict_types=1); namespace UserSystem;
final class User extends AbstractPerson { use ActiveStatus; public function getName():string{return $this->name;} public function getEmail():string{return $this->email;} public function getAge():int{return $this->age;} public function verifyPassword(string $password):bool{return password_verify($password,$this->passwordHash);} public function describe():string{return "{$this->name}, {$this->age}, {$this->email}";} public function roleName():string{return 'user';} }
