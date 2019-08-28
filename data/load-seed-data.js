const client = require('../lib/client');
const todos = require('./todo');

Promise.all(
    todos.map(todo => {
        return client.query(`
            INSERT INTO todos (name)
            VALUES ($1)
            RETURNING *;
        `,
        [todo])
            .then(result => result.rows[0]);
    })
)
    .then(
        () => console.log('seed data load complete'),
        err => console.log('Load Seed Data Error: ' + err)
    )
    .then(() => {
        client.end();
    });