const catchAsync = require('../errors/catchAsyncErrors');
const prisma = require('../database/prisma');

exports.createOrders = catchAsync(async (req, res, next) => {
  const { data: orders } = req.body;

  if (orders.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No orders provided',
    });
  }

  const ordersToCreate = orders.map(order => {
    const orderItems = order.orderitems.map(orderItem => {
      delete orderItem.orderId;
      delete orderItem.id;
      return orderItem;
    });

    return prisma.orders.create({
      data: {
        id: order.id,
        customerName: order.customerName,
        total: order.total,
        orderItems: {
          create: orderItems,
        },
      },
    });
  });

  await prisma.$transaction(ordersToCreate);

  return res.status(201).json({
    status: 'success',
    message: 'Orders created',
  });
});

exports.deleteAllOrders = catchAsync(async (req, res, next) => {
  await prisma.orderItems.deleteMany();
  await prisma.orders.deleteMany();

  return res.status(200).json({
    status: 'success',
    message: 'Toppings deleted',
  });
});
