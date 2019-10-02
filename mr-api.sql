DROP DATABASE IF EXISTS mrapi;
CREATE DATABASE mrapi;

\c mrapi;

CREATE TABLE users (
  ID SERIAL,
  username VARCHAR UNIQUE NOT NULL,
  password TEXT NOT NULL,
  bio TEXT,
  hobbies TEXT,
  image_url TEXT,
  user_id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  update_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE recipes (
  ID SERIAL,
  recipe_id VARCHAR PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR NOT NULL,
  cook_time VARCHAR NOT NULL,
  image_url TEXT,
  ingredients TEXT NOT NULL,
  directions TEXT NOT NULL,
  portion VARCHAR,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  update_at TIMESTAMP NOT NULL DEFAULT NOW(),
  owner VARCHAR REFERENCES users(user_id)
);

CREATE TABLE likes (
  ID SERIAL PRIMARY KEY,
  fav_recipe_id VARCHAR REFERENCES recipes(recipe_id),
  fav_user_id VARCHAR REFERENCES users(user_id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  update_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  ID SERIAL PRIMARY KEY,
  review_recipe_id VARCHAR REFERENCES recipes(recipe_id),
  review_user_id VARCHAR REFERENCES users(user_id),
  review TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  update_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE follows (
  ID SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(user_id),
  following_user VARCHAR REFERENCES users(user_id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  update_at TIMESTAMP NOT NULL DEFAULT NOW()
);
