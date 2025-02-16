-- Criar o banco de dados
DROP DATABASE IF EXISTS game_manager;
CREATE DATABASE game_manager;

-- Conectar ao banco de dados
\c game_manager;

-- Remover tabelas existentes
DROP TABLE IF EXISTS rounds;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS folders;

-- Remover tipo enum
DROP TYPE IF EXISTS status_enum;

-- Criar as tabelas
CREATE TABLE folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INTEGER REFERENCES folders(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NOT NULL,
    points INTEGER DEFAULT 0,
    victories INTEGER DEFAULT 0,
    rounds INTEGER DEFAULT 0,
    general_boca INTEGER DEFAULT 0,
    general INTEGER DEFAULT 0,
    riscos INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    folder_id INTEGER REFERENCES folders(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'finished')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rounds (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL,
    match_id INTEGER REFERENCES matches(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'finished')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 