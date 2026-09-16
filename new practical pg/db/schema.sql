

-- create the table of the user
-- to store the account  and user hashed password 
CREATE TABLE  IF NOT EXISTS users (
    id  SERIAL PRIMARY KEY,
    username  VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(225) UNIQUE NOT NULL,
    password_hash TEXT    NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
    
);

-- for the refresh token  table for the user and server understanding

CREATE TABLE IF NOT EXISTS refresh_token(
    id     SERIAL PRIMARY KEY,
    user_id   INTEGER NOT NULL REFERENCES USERS(id) ON DELETE CASCADE,
    token    TEXT NOT NULL UNIQUE 
    expires_at  TIMESTAMP  NOT NULL,
    revoked   BOOLEAN NOT NULL DEFAULT FALSE, 
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()

);

-- create the index  for the  find efficently  authenticate   token of the user  
CREATE INDEX IF NOT EXISTS  idx_refresh_token_user_id ON  refresh_token(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_token_token  ON refresh_token(token); 