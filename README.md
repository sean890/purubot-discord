paimon bot for discord developed by puru

***Sequelize commands***
> npx sequelize-cli model:generate --name Url --attributes url:string,shortUrl:string

> npx sequelize-cli db:migrate

***Migrating local database tables (not including table contents) to Heroku***
$ heroku run bash

Running bash on ⬢ nameful-wolf-12818... up, run.5074 (Free)

~ $ sequelize db:migrate

Source:
https://stackabuse.com/adding-a-postgresql-database-to-a-node-js-app-on-heroku/