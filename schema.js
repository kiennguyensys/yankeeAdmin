const {
  File,
  Float,
  Integer,
  Text,
  Slug,
  Relationship,
  Select,
  Password,
  Checkbox,
  CalendarDay,
  DateTime,
  OEmbed,
  Content,
} = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');

//Access Control
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }
  return { id: user.id };
};
const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};
const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };


exports.User = {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: { type: Checkbox },
    password: {
      type: Password,
    },
  },
  //To create an initial user you can temporarily remove access controls
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
}

exports.Product = {
  fields: {
    title: { type: Text },
    price: { type: Float},
    image: { type: Text },
    imageHover: { type: Text },
    description: { type: Text },
    detailDescription: { type: Wysiwyg },
    additionalInfo: { type: Wysiwyg },
    information: {
      type: Text,
    },
    updated: { type: DateTime, format: 'DD/MM/YYYY' },
    categories: {
      type: Relationship,
      ref: 'ProductCategory',
      many: true,
    },
    isFeatured: { type: Checkbox }
  },
  adminConfig: {
    defaultPageSize: 20,
    defaultColumns: 'title, price',
    defaultSort: 'title',
  },
  labelResolver: item => item.title,
};

exports.Post = {
  fields: {
    title: { type: Text },
    image:{ type: Text },
    slug: { type: Slug, from: 'title' },
    brief_description: { type: Text },
    author: {
      type: Relationship,
      ref: 'User',
    },
    categories: {
      type: Relationship,
      ref: 'PostCategory',
      many: true,
    },
    tags: {
      type: Relationship,
      ref: 'PostTag',
      many: true,
    },
    status: {
      type: Select,
      defaultValue: 'draft',
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }],
    },
    body: { type: Wysiwyg },
    posted: { type: DateTime, format: 'DD/MM/YYYY' },
  },
  adminConfig: {
    defaultPageSize: 20,
    defaultColumns: 'title, status',
    defaultSort: 'title',
  },
  labelResolver: item => item.title,
};

exports.PostCategory = {
  fields: {
    name: { type: Text },
    slug: { type: Slug, from: 'name' },
  },
};

exports.PostTag = {
  fields: {
    name: { type: Text },
    slug: { type: Slug, from: 'name' },
  },
};

exports.Notification = {
  fields: {
    title: { type: Text },
    image: { type: Text },
    slug: { type: Slug, from: 'title' },
    author: {
      type: Relationship,
      ref: 'User',
    },
    body: { type: Wysiwyg },
    posted: { type: DateTime, format: 'DD/MM/YYYY' },
  },
  adminConfig: {
    defaultPageSize: 20,
    defaultColumns: 'title',
    defaultSort: 'title',
  },
  labelResolver: item => item.title,
};

exports.ContactForm = {
  fields: {
    name: { type: Text },
    email: { type: Text },
    tel: { type: Text },
    body: { type: Wysiwyg },
    posted: { type: DateTime, format: 'DD/MM/YYYY' },
  },
  adminConfig: {
    defaultPageSize: 20,
    defaultColumns: 'name, tel',
    defaultSort: 'email',
  },
  labelResolver: item => item.email,
};

exports.Order = {
  fields: {
    userID: { type: Integer },
    itemID: { type: Integer },
    quantity: { type: Integer },
    info: { type: Text },
    paymentMethod: { type: Text},
    isProceeding: { type: Checkbox },
    isDone: { type: Checkbox },
    date: { type: DateTime, format: 'DD/MM/YYYY' },
  },
  adminConfig: {
    defaultPageSize: 20,
    defaultColumns: 'itemID, quantity, paymentMethod',
    defaultSort: 'date',
  },
  labelResolver: item => item.userID,
};

exports.ProductCategory = {
  fields: {
    name: { type: Text },
    slug: { type: Slug, from: 'name' },
    MenuSelected: { type: Checkbox },
  },
};

exports.Comment = {
  fields: {
    body: { type: Text, isMultiline: true },
    originalPost: {
      type: Relationship,
      ref: 'Post',
    },
    author: {
      type: Relationship,
      ref: 'User',
    },
    posted: { type: DateTime },
  },
  labelResolver: item => item.body,
};

exports.Review = {
  fields: {
    ratingStarsNumber: { type: Integer },
    body: { type: Text, isMultiline: true },
    originalProduct: {
      type: Relationship,
      ref: 'Product',
    },
    author: {
      type: Relationship,
      ref: 'User',
    },
    posted: { type: DateTime },
  },
  labelResolver: item => item.body,
};