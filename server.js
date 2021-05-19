require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 5000
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const Product =require('./models/product')
const Admin =require('./models/Admin')
const StaffMember = require('./models/StaffMember')
const Customer = require('./models/Customer')
const Cart =require('./models/Cart')
const cors = require('cors')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


// Connect DB
connectDB()


// Middleware
app.use(cors())
app.use(express.json())
app.use('/auth', require('./routes/authRoutes'))
app.use('/admin', require('./routes/adminRoutes'))
app.use('/customer', require('./routes/customerRoutes'))
app.use('/staff', require('./routes/staffMemberRoutes'))
// error handler - should be *last* piece of middleware
app.use(errorHandler)



// route to get all products 
app.get('/all-products', (req, res) => {
  Product.find({}, (error, product) => {
    if(error) {
      res.json({error: 'Unable to fetch products!'}) 
    } else {
      res.json(product)
    }
  })
})



//route to get product by all vegetable
app.get('/all-products/vegetable', (req, res) => {
  
  Product.find({
    category: "vegetable",
  }, (error, posts) => {
    if(error) {
      res.json({error: 'Unable to fetch products!'}) 
    } else {
      res.json(posts)
    }
  })
})



//route to get product by all fruit
app.get('/all-products/fruit', (req, res) => {
  
  Product.find({
    category: "fruit",
  }, (error, posts) => {
    if(error) {
      res.json({error: 'Unable to fetch products!'}) 
    } else {
      res.json(posts)
    }
  })
})


//route to get product by all flowers
app.get('/all-products/flower', (req, res) => {
  
  Product.find({
    category: "flowers",
  }, (error, posts) => {
    if(error) {
      res.json({error: 'Unable to fetch products!'})
    } else {
      res.json(posts)
    }
  })
})

///////////////////////////////////////////////
//  below is the section for getting all types of orders
//////////////////////////////////////////////


//routes to get all order history
app.get('/all-orders', (req, res) => {
  
  Cart.find({}, (error, posts) => {
    if(error) {
      res.json({error: 'Unable to fetch orders!'})
    } else {
      res.json(posts)
    }
  })
})


//routes to get all completed-orders history
app.get('/completed-orders', (req, res) => {
  
  Cart.find({
    is_delivered: true,
  }, (error, posts) => {
    if(error) {
      res.json({error: 'Unable to fetch products!'})
    } else {
      res.json(posts)
    }
  })
})


//routes to get all pending-orders history
app.get('/pending-orders', (req, res) => {
  
  Cart.find({
    is_delivered: false,
  }, (error, posts) => {
    if(error) {
      res.json({error: 'Unable to fetch products!'})
    } else {
      res.json(posts)
    }
  })
})

//routes to change the delivery status to delivered
app.patch('/change_to_delivered/:cartId', (req, res) => {

  const cartId = req.params.cartId 
  
  

  const update_delivery_status = {
    is_delivered : true
  }

  Cart.findByIdAndUpdate(cartId, update_delivery_status, (error, result) => {
      if(error) {
          res.json({error: 'Unable to updated'})
      } else {
          res.json({success: true})
      }
  })

})


//routes to change the delivery status to not delivered
app.patch('/change_to_not_delivered/:cartId', (req, res) => {

  const cartId = req.params.cartId 

  const update_delivery_status = {
    is_delivered : false
  }

  Cart.findByIdAndUpdate(cartId, update_delivery_status, (error, result) => {
      if(error) {
          res.json({error: 'Unable to updated'})
      } else {
          res.json({success: true})
      }
  })

})

///////////////////////////////////////////////
// below is the section for posting orders after a successful payment only
//////////////////////////////////////////////

app.post ('/order-confirmation', (req, res) => {

  const fullname = req.body.fullname
  const street1 = req.body.address.street1
  const street2 = req.body.address.street2
  const city = req.body.address.city
  const state = req.body.address.state
  const zipcode = req.body.address.zipcode
  const images = req.body.cart.images 
  const title = req.body.cart.title
  const description = req.body.cart.description 
  const rate = req.body.cart.rate 
  const per = req.body.cart.per
  const category = req.body.cart.category 
  const subcategory = req.body.cart.subcategory 
  const phone = req.body.phone
  // const OrderConformation = req.body.OrderConformation
  const is_delivered = false

 console.log(req.body)
  let cart = new Cart({
    fullname:fullname,
    address:req.body.address,
  //   address:[{ 
  //     street1:street1,
  //     street2:street2,
  //     city:city,
  //     state:state,
  //     zipcode:zipcode,
  // }],
    phone: phone,
    // OrderConformation: OrderConformation,
   cart:req.body.cart,
    is_delivered: is_delivered,

  })
  // console.log(cart)
  // const newTitle = cart.cart.map(item => console.log(item))
  // console.log(newTitle)


  cart.save((error) => {
    if(error) {
      res.json({error: 'Unable to save the cart!'})
    } else {
      res.json({success: true, message: 'New cart Saved'})
    }
  })

})


// stripe payment route #1 - now superseded
// app.post('/payment', (req, res) => {
//   const { product, token } = req.body

  // console.log('PRODUCT: ', product.name)
  // console.log('PRICE: $', product.rate)
  // const idempotencyKey = Math.random()

  // return stripe.customers.create({
  //     email: token.email,
  //     source: token.id
  // }).then(customer => {
  //     stripe.charges.create({
//           amount: Math.round(product.rate * 100),
//           currency: 'usd',
//           customer: customer.id,
//           receipt_email: token.email,
//           description: `Purchase from FruveFlow`,
//           shipping: {
//               name: token.card.name,
//               address: {
//                   country: token.card.address_country
//               }
//           }
//       }, {idempotencyKey})
//   }).then(result => {
//     console.log(result)
//     res.status(200).json(result)
//     })
//   .catch(err => console.log(err))
// })


// stripe payment route #2 - now fully functional!
app.post('/nonmodalpayment', cors(), async (req, res) => {
  let {amount, id} = req.body
  try {
    const payment = await stripe.paymentIntents.create({
      amount, 
      currency: 'USD',
      description: 'FruVe Flow',
      payment_method: id,
      confirm: true
    })
    console.log('Payment', payment)
    res.json({
      message: "Payment successful",
      success: true
    })
  } catch (error) {
      console.log('Error', error)
      res.json({
        message: 'Payment failed',
        success: false
      })
  }
})


if(process.env.NODE_ENV === 'production') {
  app.use(express.static((path.join(__dirname, 'client/build'))))
}


const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


// makes giant server errors concise and simple to read
process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err}`)
  server.close(() => process.exit(1))
})


app.get(‘*’, (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
 })