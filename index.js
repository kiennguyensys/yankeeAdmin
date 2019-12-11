const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text, Checkbox, Password, Relationship, Float, CloudinaryImage } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');


const PROJECT_NAME = "yankeesim";
const { User, Product, ProductCategory, Order, Post, PostCategory, PostTag, Comment, Review, Notification, ContactForm } = require('./schema');


const keystone = new Keystone({
    name: PROJECT_NAME,
    adapter: new Adapter(),
    cookieSecret: "bd69a98acde93bc1d1e9ef337d13c98774acbe0ec05489ef2874afaf9b4f54c3",
    secureCookies: true,
});

keystone.createList('User', User);
keystone.createList('Product', Product);
keystone.createList('Post', Post);
keystone.createList('PostCategory', PostCategory);
keystone.createList('PostTag', PostTag);
keystone.createList('ProductCategory', ProductCategory);
keystone.createList('ProductReview', Review);
keystone.createList('Order', Order);
keystone.createList('PostComment', Comment);
keystone.createList('Notification', Notification);
keystone.createList('ContactForm', ContactForm);


// keystone.createItems({
//     User: [{name: 'kiennguyensys', email: 'tkien2703@gmail.com', isAdmin: true, password: '123456abc'}]
// });

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: {
    identityField: 'email',
    secretField: 'password',
  },
});

const admin = new AdminUIApp();

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    // To create an initial user you can temporarily remove the authStrategy below
    admin,
  ],
};
