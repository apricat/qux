# qux

Qux is a *quizz* application that uses _Web Worker Push Notifications_ to prompt users periodically with questions.

![alt text][preview]

[preview]: https://github.com/apricat/qux/blob/master/public/images/notification-preview.png "Notification!"

It relies on a MEAN stack, that is, `Mongodb`, `Expressjs`, `Angularjs`, `Nodejs`, to support its features.

## Prerequisites

You will need `nodejs` and a `mongodb` database.

## Installation

First checkout the project:

	git clone https://github.com/apricat/qux.git

Using a text editor, replace the `config.mongodb` line in the `config-default.js` file with your own configuration.

	config.mongodb = "mongodb://<dbuser>:<dbpassword>@ds035806.mlab.com:35806/<dbname>";

Save the modified file as `config.js`.

Navigate to the directory from the command line, and run the `npm install` command to fetch all required packages.

	npm install

Run `node server.js`.

> App listening on port 8080

If the installation was successful, you should be able to access the quizz using your web browser at the `localhost:8080` address.
