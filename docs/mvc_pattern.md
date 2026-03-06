# MVC Pattern

The ShopEZ backend follows the Model-View-Controller (MVC) architectural pattern. This pattern helps organize the application into separate components, making the system easier to maintain, scale, and manage.

## Model

The Model represents the data structure of the application and interacts directly with the database. In ShopEZ, models are defined using Mongoose schemas to represent collections in MongoDB.

Examples of models include:
- User Model
- Product Model
- Order Model
- Review Model
- Category Model
- Payment Model

These models define the structure of the data stored in the database and enforce validation rules.

## View

The View represents the user interface of the application. In the ShopEZ platform, the view layer is implemented using React.js. It is responsible for displaying data to users and capturing user interactions such as product browsing, cart management, and order placement.

React components dynamically render data received from the backend APIs.

## Controller

Controllers handle the business logic of the application. They receive requests from the client, process the data, interact with the models, and return appropriate responses.

Examples include:
- Authentication Controller (login and registration)
- Product Controller (product operations)
- Order Controller (order processing)
- Review Controller (product reviews)

Controllers ensure that the system processes requests efficiently and maintains proper separation between data handling and user interface logic.

## MVC Structure in Backend

backend
│
├── models
│   ├── userModel.js
│   ├── productModel.js
│   └── orderModel.js
│
├── controllers
│   ├── authController.js
│   ├── productController.js
│   └── orderController.js
│
├── routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
│
└── server.js