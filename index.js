const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text, Checkbox, Password, Relationship, Float, CloudinaryImage } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');

const PROJECT_NAME = "yankeesim";
const { User, Product, Post, PostCategory, Comment } = require('./schema');


const keystone = new Keystone({
    name: PROJECT_NAME,
    adapter: new Adapter(),
});

keystone.createList('User', User);
keystone.createList('Product', Product);
keystone.createList('Post', Post);
keystone.createList('PostCategory', PostCategory);
keystone.createList('Comment', Comment);

keystone.createItems({
    User: [{name: 'kiennguyensys', email: 'tkien2703@gmail.com', isAdmin: true, password: '123456abc'}]
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    // To create an initial user you can temporarily remove the authStrategy below
    new AdminUIApp(),
  ],
};
