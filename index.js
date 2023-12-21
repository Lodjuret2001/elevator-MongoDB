const express = require('express');
const app = express();
app.use(express.json());


//app.get
//app.post
//app.put
//app.delete

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));