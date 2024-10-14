
![Logo](https://github.com/carolinecobucci/plant-ecommerce/raw/main/src/assets/compass%20uol%20header.jpeg)
# CompassCar API 🚗

Esta API fornece funcionalidades para gerenciar uma locadora de carros, permitindo que os usuários realizem operações como:
- **Autenticação**: Registro e login de usuários com diferentes níveis de acesso. 
- **CRUD de Carros**: Adicionar, atualizar, excluir e listar veículos.
- **CRUD de Clientes**: Gerenciar informações dos clientes, incluindo cadastro e consulta. 
- **CRUD de Usuários**: Criar, consultar e deletar usuários.
- **Pedidos de Locação**: Criar, consultar e cancelar locações de veículos.
 
## Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados em sua máquina:

- [Node.js](https://nodejs.org/) 
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Instruções de Instalação

Siga os passos abaixo para clonar o repositório e configurar o projeto:

1. **Clonar o repositório**

   Abra o terminal e execute o seguinte comando:

   ```bash
   git clone https://github.com/Gabreel-Araujo/AWS_NODE_AGO24_DESAFIO_02_EQUIPE_BATMAN.git
   cd AWS_NODE_AGO24_DESAFIO_02_EQUIPE_BATMAN>

## Instruções de Instalação

Siga os passos abaixo para clonar o repositório e configurar o projeto:

1. **Clonar o repositório**
   Abra o terminal e execute o seguinte comando:

   ```bash
   git clone https://github.com/Gabreel-Araujo/AWS_NODE_AGO24_DESAFIO_02_EQUIPE_BATMAN.git
   cd AWS_NODE_AGO24_DESAFIO_02_EQUIPE_BATMAN
    ```
    
2. **Instalar dependências**
	 ```bash
   npm install
	  ```
3.  **Configurar variáveis de ambiente**
Renomeie os arquivos `.env.example` e `docker-compose.yml.example` removendo a extensão `.example`:
	 ```bash
	  mv .env.example .env
	  mv docker-compose.yml.example docker-compose.yml
	```
4. **Criar a instância do banco de dados**
Execute o comando abaixo para iniciar o Docker e criar a instância do banco de dados:
	 ```bash
	  docker-compose up -d
	```
5. **Executar migrations**
Execute o seguinte comando para rodar as migrações e criar as tabelas:
	```bash
	npm run migrate:run
	```
6. **Rodar o servidor**
Finalmente, execute o comando abaixo para iniciar o servidor:
	```bash
	npm run dev
	```

## Documentação da API

A documentação da API pode ser acessada através do Swagger. Após iniciar o servidor, abra o navegador e vá para a rota `/api-docs/`.

## Equipe
- **Álvaro Silva Garcia** - [GitHub](https://github.com/Alvarosig)
- **Gabriel Alves** - [GitHub](https://github.com/Gabreel-Araujo)
- **Izabela Araujo** - [GitHub](https://github.com/izzyraraujo)
- **Roney Benyhe Rodrigues** - [GitHub](https://github.com/RoneyBenyhe)
- **Sara Ferreira** - [GitHub](https://github.com/saraferreira10)


