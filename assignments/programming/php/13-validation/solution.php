<?php
declare(strict_types=1);
function validateRegistration(array $input): array {
    $errors=[]; foreach(['name','login','email','password'] as $field){ if(trim((string)($input[$field]??''))==='') $errors[$field]='Поле обязательно.'; }
    $name=(string)($input['name']??''); if($name!=='' && !preg_match("/^[\\p{L} '-]+$/u",$name)) $errors['name']='Допустимы буквы, пробел, дефис и апостроф.';
    $login=(string)($input['login']??''); if($login!=='' && !preg_match('/^[A-Za-z0-9_-]{2,20}$/',$login)) $errors['login']='Логин: 2–20 латинских букв, цифр, - или _.';
    $email=(string)($input['email']??''); if($email!=='' && filter_var($email,FILTER_VALIDATE_EMAIL)===false) $errors['email']='Некорректный e-mail.';
    $password=(string)($input['password']??''); if($password!=='' && !preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{6,}$/',$password)) $errors['password']='Пароль: минимум 6 символов, верхний/нижний регистр, цифра и спецсимвол.';
    return $errors;
}
