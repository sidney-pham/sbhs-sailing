// Dependencies and Setup
let express = require('express'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  members = require('./routes/members'),
  app = express();

const port = parseInt(process.argv[2], 10) || process.env.PORT || '3000';

// Compress response bodies for all requests.
app.use(compression());

// Enable reading of POST bodies.
app.use(bodyParser.json({type: 'application/json'}));

// Routers
let membersRouter = express.Router();

membersRouter.get('/', members.getAllMembers);
membersRouter.post('/', members.createMember);
membersRouter.get('/:id', members.lookupMember, members.getSingleMember);
membersRouter.patch('/:id', members.lookupMember, members.updateMember);
membersRouter.delete('/:id', members.lookupMember, members.removeMember);





app.use('/api/member', membersRouter);

app.listen(port, function() {
  console.log(`App listening on port ${port}!`);
});