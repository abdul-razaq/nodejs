// Admin related products controller
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  // create a new product from our Product model and immediately save it to the database
  const product = new Product(title, price, description, imageUrl);
  product
    .save()
    .then(result => {
      console.log('Created product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      if (err) console.log(err);
    });
};

// exports.getEditProduct = (req, res, next) => {
//   // grab the product we wanna edit and pass in the information into this view
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const { productId } = req.params;
//   // Get products that are only created by the currently logged in user in order to edit them
//   req.user
//     .getProducts({ where: { id: productId } })
//     .then(products => {
//       const product = products[0];
//       if (!product) {
//         return res.redirect('/');
//       }
//       res.render('admin/edit-product', {
//         pageTitle: 'Add Product',
//         editing: editMode,
//         product,
//       });
//     })
//     .catch(err => {
//       if (err) console.log(err);
//     });
// };

exports.postEditProduct = (req, res, next) => {
  const { productId } = req.body;
  const { title, price, imageUrl, description } = req.body;
  Product.findByPk(productId)
    .then(product => {
      (product.title = title),
        (product.price = price),
        (product.imageUrl = imageUrl),
        (product.description = description);
      // save the updated data to the database
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => {
      if (err) console.log(err);
    });
};

exports.getAllProducts = async (req, res, next) => {
  // Find all Products that only belong to the currently logged in user
  const products = await req.user.getProducts();
  res.render('admin/products', { pageTitle: 'All Products', products });
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  // Delete a product that belongs to the currently logged in user
  await Product.findByPk(productId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log('PRODUCT DESTROYED');
      res.redirect('/admin/products');
    })
    .catch(err => {
      if (err) console.log(err);
    });
};
