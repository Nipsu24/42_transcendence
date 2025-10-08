<h1 align="center">Transcendence (The Pong)</h1>

> Hive Helsinki (School 42) final project (Rank06/06) of core curriculum.

<h2 align="center">
	<a href="#about">About</a>
	<span> · </span>
  <a href="#Website">Website</a>
	<span> · </span>
  <a href="#Worksplit">Worksplit</a>
	<span> · </span>
	<a href="#requirements">Requirements</a>
	<span> · </span>
	<a href="#instructions">Instructions</a>
  <span> · </span>
  <a href="#architecture">Architecture</a>
</h2>

## About
The repository contains a web-based pong game which runs in a containerised environment using Docker. The tech stack consists of a TypeScrip.JS/React frontend with connection via RESTful APIs to a Node.JS/Fastify backend which uses the Prisma client to store and retrieve data from a SQLite database - (see also [Architecture](#architecture)).  
[View Miro Board](https://miro.com/app/board/uXjVI1VJGHY=/)

## Website
The website consists of following features:
- user login (incl. Google's authentification service)
- user management
  -  Change name, password
  -  Choose avatar or upload custom avatar image
  -  add friends
  -  stats overview (victories, defeats, match records) for both logged-in user and added friends
- Pong game
  - Player vs. AI
  - Player vs. Player
  - Tournament mode
  - 3D animations


## Worksplit
[Erno](https://github.com/ernobyl): Pong-Game, Oponent AI - Module Count: 1 Major  
[Hanni](https://github.com/thehanbear): Front-End UI with tailwind, standard user management (frontend), support on multiple devices and browsers - Module Count: 1 Major, 3 Minor  
[Katja](https://github.com/kootee):  Graphics module (additional assist with main game, game customisation) - Module Count: 1 Major  
[Marius](https://github.com/Nipsu24): Backend with fastify framework, using SQLite DB, overall architecture (test and prod environment), user management backend - Module Count: 1 Major, 1 Minor  
[Matti](https://github.com/MRinkinen): Google Sign-in authentification, user management (password hashing, backend) - Module Count: 1 Major  

Overall Module Count: 7 Major in total

## Requirements
- docker & docker-compose

## Instructions

### 1. Compiling the website

Install docker/docker-compose on your machine, navigate to the repository and build the project with:

```
$ make 
```

Open a browser window and type in the following address:
```
localhost:8443
```
Confirm 'insecure' connection

### 2. Navigation on the website
Main start screen:
<img width="2880" height="1506" alt="Bildschirmfoto 2025-08-21 um 15 57 27" src="https://github.com/user-attachments/assets/1c939ef3-abe8-4b27-88b4-b71876e073c5" />

Login:
<img width="2880" height="1506" alt="Bildschirmfoto 2025-08-21 um 15 58 13" src="https://github.com/user-attachments/assets/3cae1505-0bb4-4e45-a6e9-14b31414ec0d" />

Profile Section (main menu):
<img width="2880" height="1506" alt="Bildschirmfoto 2025-08-21 um 15 58 28" src="https://github.com/user-attachments/assets/2f6e9cf1-fac4-4505-ac70-a7e7e09c69a1" />

Profile Section (sub-menu):
<img width="2880" height="1506" alt="Bildschirmfoto 2025-08-21 um 15 58 41" src="https://github.com/user-attachments/assets/5341add6-0a6a-4160-9b68-b87b0cd2713f" />

Editing view in sub-menu:
<img width="2712" height="1554" alt="Bildschirmfoto 2025-08-21 um 16 14 23" src="https://github.com/user-attachments/assets/9fe0e9cd-99f1-40d7-b24e-3be4dad7d801" />


Friends section:
<img width="2880" height="1506" alt="Bildschirmfoto 2025-08-21 um 15 59 02" src="https://github.com/user-attachments/assets/0d734f08-4e0d-4c5f-a4e0-78972b96b8f0" />

Main Game menu:
<img width="2880" height="1506" alt="Bildschirmfoto 2025-08-21 um 15 59 43" src="https://github.com/user-attachments/assets/f4ffe1c5-1d59-4625-8280-a0d8b4f3c5e6" />

Game sub-menu:
<img width="2880" height="1506" alt="Bildschirmfoto 2025-08-21 um 15 59 57" src="https://github.com/user-attachments/assets/b3ffd012-41f7-4439-a337-0f6f7c4d7312" />

Game:
<img width="2712" height="1554" alt="Bildschirmfoto 2025-08-21 um 16 15 00" src="https://github.com/user-attachments/assets/5f84ce18-70d8-444f-85cd-ea635973c25f" />


## Architecture
Prod environment:
<img width="2498" height="1800" alt="Bildschirmfoto 2025-08-21 um 16 09 24" src="https://github.com/user-attachments/assets/184c63ee-b5a7-49b5-a8bd-e4b4cc3a93ef" />

Frontend testing:
<img width="2498" height="1800" alt="Bildschirmfoto 2025-08-21 um 16 08 35" src="https://github.com/user-attachments/assets/b21eb49c-a0e4-4b0f-a70d-722578b4a141" />

Backend testing:
<img width="2174" height="1554" alt="Bildschirmfoto 2025-08-21 um 16 12 11" src="https://github.com/user-attachments/assets/db9fbb9d-1a00-4819-a56e-25921787db2a" />
