const {DateTimeResolver} = require('graphql-scalars');

const {Query} = require('./resolvers/query');
const {Mutation} = require('./resolvers/mutation');
const {User} = require('./resolvers/user');
const {Event} = require('./resolvers/event');
const {EventBookClub} = require('./resolvers/eventBookClub');
const {Tag} = require('./resolvers/tag');
const {AuthResponse} = require('./resolvers/authResponse');
const {Review} = require('./resolvers/review');
const {EventSchedule} = require('./resolvers/eventSchedule');
const {TagConnection} = require('./resolvers/tagConnection');
const {EventConnection} = require('./resolvers/eventConnection');

module.exports = {
  Query,
  Mutation,
  User, // Done(Arin)
  Event, // Done(SeongJae)
  EventBookClub, // Done(SiHyun)
  Tag, // Done(SeongJae)
  AuthResponse,
  Review, // Done(SeongJae)
  EventSchedule, // Done(SeongJae)
  TagConnection,
  EventConnection,
  DateTime: DateTimeResolver,
};
