const dotenv = require('dotenv');
const mongoose = require('mongoose');
const chalk = require('chalk');
const { prompt, Select, NumberPrompt } = require('enquirer');
const Product = require('../src/models/product.model');
const Category = require('../src/models/category.model');
const faker = require('faker');

async function setup() {
  dotenv.config();

  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(
      chalk.green(`Database is connected to ${process.env.DATABASE_URL}`)
    );

    const collectionPrompt = new Select({
      name: 'collection',
      message: 'Choose a collection',
      choices: ['Products', 'Categories'],
    });

    const collectionChoice = await collectionPrompt.run();

    const numberPrompt = new NumberPrompt({
      name: 'number',
      message: 'Number of documents to be inserted',
    });

    const numberChoice = await numberPrompt.run();

    if(collectionChoice === 'Products') {
      let documents = [];
      for (let i = 0; i < numberChoice; i += 1) {
        const product = await getProduct();
        documents.push(product);
      }

      try {
        const products = await Product.insertMany(documents);
        console.log(`${products.length} products inserted`);
      } catch(e) {
        console.log(e);
      }
    }

    if(collectionChoice === 'Categories') {
      let documents = [];
      for (let i = 0; i < numberChoice; i += 1) {
        const category = await getCategory();
        documents.push(category);
      }

      try {
        const categories = await Category.insertMany(documents);
        console.log(`${categories.length} categories inserted`);
      } catch(e) {
        console.log(e);
      }
    }

    process.kill(process.pid, 'SIGTERM');
  } catch (error) {
    console.log(error);
    process.kill(process.pid, 'SIGTERM');
  }
}

async function getProduct() {
  const categories = await Category.find();
  const category = categories[Math.floor(Math.random() * categories.length)];
  const name = faker.commerce.productName();
  const sku = faker.random.uuid();
  const description = faker.commerce.productDescription();
  const price = faker.commerce.price(10, 1000);
  const inventory = faker.random.number(200);
  const image = `https://placeimg.com/640/480/tech?random=${Math.round(
    Math.random() * 1000
  )}`;
  return { name, sku, description, price, inventory, image, category: category.id };
}

async function getCategory() {
  const name = faker.commerce.productName();
  const image = `https://placeimg.com/640/480/tech?random=${Math.round(
    Math.random() * 1000
  )}`;
  const status = 'active';
  return { name, image, status };
}

setup();
