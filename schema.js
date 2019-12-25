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
  CloudinaryImage
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
    username: {
      type: Text,
      isUnique: true,
    },
    email: {
      type: Text,
      isUnique: true,
    },
    phone: { type: Text },
    company: { type: Text },
    address: { type: Text },
    city: { type: Text },
    countryCode: { type: Text },
    isAdmin: { type: Checkbox },
    password: {
      type: Password,
    },
  },
  //To create an initial user you can temporarily remove access controls
  // access: {
  //   read: access.userIsAdminOrOwner,
  //   update: access.userIsAdminOrOwner,
  //   create: access.userIsAdmin,
  //   delete: access.userIsAdmin,
  //   auth: true,
  // },
}

exports.Product = {
  fields: {
    title: { type: Text },
    SKU: { type: Text , isUnique: true },
    price: { type: Float },
    image: { type: Text },
    imageHover: { type: Text },
    description: { type: Text },
    detailDescription: { type: Wysiwyg },
    additionalInfo: { type: Wysiwyg },
    availability: { type: Text },
    categories: {
      type: Relationship,
      ref: 'ProductCategory',
      many: true,
    },
    tags: {
      type: Relationship,
      ref: 'ProductTag',
      many: true,
    },
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
    orderStatus: { type: Text },
    date: { type: DateTime, format: 'DD/MM/YYYY' },
    name: { type: Text },
    company: { type: Text },
    email: { type: Text },
    phone: { type: Text },
    address: { type: Text },
    city: { type: Text },
    countryCode: { type: Text },
    cartDiscountAmount: { type: Text },
    subtotalAmount: { type: Text },
    totalAmount: { type: Text },
    shippingMethod: { type: Text },
    orderNotes: { type: Text },
    paymentMethod: { type: Text },
    SKU: { type: Text },
    itemOrder: { type: Text },
    itemName: { type: Text },
    quantity: { type: Text },
    itemCost: { type: Text },
    couponCost: { type: Text },
    discountAmount: { type: Text }
  },
  adminConfig: {
    defaultPageSize: 20,
    defaultColumns: 'orderStatus, date',
    defaultSort: 'date',
  },
  labelResolver: item => item.SKU,
};

exports.ProductCategory = {
  fields: {
    name: { type: Text },
    slug: { type: Slug, from: 'name' },
    MenuSelected: { type: Checkbox },
  },
};

exports.ProductTag = {
  fields: {
    name: { type: Text },
    slug: { type: Slug, from: 'name' },
  },
};

exports.Comment = {
  access: {
    create: ({ authentication: { item, listKey }, existingItem }) => true,
    update: ({ authentication: { item, listKey }, existingItem }) => true,
    delete: ({ authentication: { item, listKey }, existingItem }) => true,
  },
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