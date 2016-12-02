# Node JS App for Mobile API (OAuth Bearer Token)

## Why?
I was prototyping a video streaming backend but using just pure Express JS/Passport JS won't speed up my development time to prototype.

So i decided to opensource this and who knows this might be something my future employers would want to see.

## Installation
run `npm install` in your terminal/shell.

## Configuration
You will need to have `.env` file in the root directory of this app with the following:
```
NODE_ENV=development
SECRET_KEY='yoursecretkey'
```
you can generate your secret key using Ruby `rake` with `rake secret`

For database, you will need PostgreSQL running on your local machine with user `devel` and password `password`.
