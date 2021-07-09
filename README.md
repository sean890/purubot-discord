paimon bot for discord: https://top.gg/bot/779160543109709824

***Sequelize commands***
> npx sequelize-cli model:generate --name Url --attributes url:string,shortUrl:string

> npx sequelize-cli db:migrate

***Migrating local database tables (not including table contents) to Heroku***

$ heroku run bash

Running bash on ⬢ nameful-wolf-12818... up, run.5074 (Free)

~ $ sequelize db:migrate

Source: https://stackabuse.com/adding-a-postgresql-database-to-a-node-js-app-on-heroku/

***Heroku check free dyno hours***
> heroku ps -a paimon-bot-1

***Heroku database backup commands***
> heroku pg:backups:capture --app paimon-bot-1

> heroku pg:backups:restore b101 DATABASE_URL --app paimon-bot-1

Source: https://devcenter.heroku.com/articles/heroku-postgres-backups

Migrate bot to another heroku account guide made by me: https://docs.google.com/document/d/1TSiYy0kbLhJDD0d15oV83LOrE3aetfM0J_qTSBqg_RE
