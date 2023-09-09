CREATE DATABASE admin_panel;
CREATE DATABASE sogo;

CREATE USER 'adminUI'@'localhost' IDENTIFIED BY 'adminUI';
GRANT ALL PRIVILEGES ON admin_panel.* TO 'adminUI'@'localhost';

CREATE USER 'sogo'@'localhost' IDENTIFIED BY 'sogo';
GRANT ALL PRIVILEGES ON sogo.* TO 'sogo'@'localhost';
GRANT SELECT ON admin_panel.* TO 'sogo'@'localhost';

FLUSH PRIVILEGES;

