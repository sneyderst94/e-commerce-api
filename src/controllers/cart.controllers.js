const catchError = require("../utils/catchError");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ProductImg = require("../models/ProductImg");

const getAll = catchError(async (req, res) => {
  const results = await Cart.findAll({
    include: [
      {
        model: Product,
        include: ProductImg,
      },
    ],
    where: { userId: req.user.id },
  });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const { productId, quantity } = req.body;
  const result = await Cart.create({
    userId: req.user.id,
    productId,
    quantity,
  });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Cart.findByPk(id, {
    include: [
      {
        model: Product,
        include: ProductImg,
      },
    ],
  });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await Cart.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const result = await Cart.update(
    { quantity },
    {
      where: { id },
      returning: true,
    }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
};
