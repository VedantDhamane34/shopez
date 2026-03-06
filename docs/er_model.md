ShopEZ – Database Entities and Attributes
1. User
Represents customers and administrators who access the platform.
Attributes:
•	userId (Primary Key)
•	name
•	email
•	password
•	role (User/Admin)
•	phone
•	address
•	createdAt
________________________________________
2. Product
Represents all items available for purchase on the platform.
Attributes:
•	productId (Primary Key)
•	name
•	description
•	price
•	stock
•	categoryId (Foreign Key)
•	rating
•	imageURL
•	createdAt
________________________________________
3. Category
Represents product categories used to organize items in the catalog.
Attributes:
•	categoryId (Primary Key)
•	categoryName
•	description
________________________________________
4. Cart
Represents products temporarily added by users before checkout.
Attributes:
•	cartId (Primary Key)
•	userId (Foreign Key)
•	productId (Foreign Key)
•	quantity
•	addedAt
________________________________________
5. Order
Represents completed purchases made by users.
Attributes:
•	orderId (Primary Key)
•	userId (Foreign Key)
•	totalPrice
•	orderStatus
•	paymentStatus
•	orderDate
________________________________________
6. OrderItem
Represents individual products within an order.
Attributes:
•	orderItemId (Primary Key)
•	orderId (Foreign Key)
•	productId (Foreign Key)
•	quantity
•	price
________________________________________
7. Review
Represents feedback given by users for products.
Attributes:
•	reviewId (Primary Key)
•	userId (Foreign Key)
•	productId (Foreign Key)
•	rating
•	comment
•	createdAt
________________________________________
8. Payment
Represents payment transactions associated with orders.
Attributes:
•	paymentId (Primary Key)
•	orderId (Foreign Key)
•	paymentMethod
•	paymentStatus
•	paymentDate
•	transactionId

