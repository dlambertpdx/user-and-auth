require('dotenv').config();

// App Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const client = require ('./lib/client');

// Auth
const ensureAuth = require('./lib/auth/ensure-auth');
const createAuthRoutes = require('./lib/auth/create-auth-routes');
const authRoutes = createAuthRoutes({
    selectUser(email) {
        return client.query(`
            SELECT id, email, hash, display_name as "displayName"
            FROM users
            WHERE email = $1;
        `,
        [email]
        ).then(result => result.rows[0]);
    },
    insertUser(user, hash) {
        return client.query(`
            INSERT into users (email, hash, display_name)
            VALUES ($1, $2, $3)
            RETURNING id, email, display_name as "displayName";
        `,
        [user.email, hash, user.displayName]
        ).then(result => result.rows[0]);
    }
});


const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev')); // http logging
app.use(cors()); // CORS enabling 
app.use(express.static('public')); // enable serving files from public folder
app.use(express.json()); // enable reading incoming json data

// setup auth routes
app.use('/api/auth', authRoutes);

app.use('/api', ensureAuth);

app.get('/api/todos', (req, res) => {
    const showAll = (req.query.show && req.query.show.toLowerCase() === 'all');
    const where = showAll ? '' : 'WHERE inactive = FALSE';

    client.query(`
        SELECT
            id,
            name,
            inactive
        FROM todos
        ${where}
        ORDER BY name;
    `)
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        });
});

app.post('/api/todos', (req, res) => {
    const todo = req.body;
    client.query(`
        INSERT INTO todos (name)
        VALUES ($1)
        RETURNING *;
    `,
    [todo.name]
    )
        .then(result => {
            res.json(result.rows[0]);
        })
        .catch(err => {
            if(err.code === '23505'){
                res.status(400).json({
                    error: `Todo "${todo.name}" already exists`
                });
            }
            res.result(500).json({
                error: err.message || err
            });
        });
});

app.put('/api/todos/:id', (req, res) => {
    const id = req.params.id;
    const todo = req.body;

    client.query(`
        UPDATE todos
        SET     name = $2,
                inactive = $3
        WHERE   id = $1
        RETURNING *;        
    `,
    [id, todo.name, todo.inactive]
    )
        .then(result => {
            res.json(result.rows[0]);  
        })
        .catch(err => {
            if(err.code === '23505') {
                res.status(400).json({
                    error: `Todo "${todo.name}" already exits`
                });
            }
            res.status(500).json({
                error: err.message || err
            });
        });
});

app.delete ('/api/todos/:id', (req, res) => {
    const id = req.params.id;

    client.query(`
        DELETE FROM todos
        WHERE id = $1
        RETURNING *;
    `,
    [id]
    )
        .then(result => {
            res.json(result.rows[0]);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        });
});



app.listen(PORT, () => {
    console.log('server is running on PORT', PORT);
});