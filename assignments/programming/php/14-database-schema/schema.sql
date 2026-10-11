CREATE DATABASE IF NOT EXISTS synergy_php CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE synergy_php;
CREATE TABLE IF NOT EXISTS clients (id INT AUTO_INCREMENT PRIMARY KEY, full_name VARCHAR(256) NOT NULL, phone VARCHAR(256) NOT NULL);
CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(256) NOT NULL);
CREATE TABLE IF NOT EXISTS material (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(256) NOT NULL);
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientID INT NOT NULL, productID INT NOT NULL, materialID INT NOT NULL,
  order_date DATE NOT NULL,
  CONSTRAINT fk_orders_client FOREIGN KEY (clientID) REFERENCES clients(id),
  CONSTRAINT fk_orders_product FOREIGN KEY (productID) REFERENCES products(id),
  CONSTRAINT fk_orders_material FOREIGN KEY (materialID) REFERENCES material(id)
);
INSERT INTO clients(full_name,phone) VALUES ('Иванов Иван Иванович','+7 900 000-00-01'),('Петрова Анна Сергеевна','+7 900 000-00-02'),('Сидоров Максим Олегович','+7 900 000-00-03');
INSERT INTO products(name) VALUES ('Стол'),('Стул'),('Шкаф');
INSERT INTO material(name) VALUES ('Дуб'),('Сосна'),('Берёза');
INSERT INTO orders(clientID,productID,materialID,order_date) VALUES (1,1,1,'2026-09-01'),(2,2,2,'2026-09-02'),(3,3,3,'2026-09-03');
