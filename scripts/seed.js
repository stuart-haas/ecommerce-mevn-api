const dotenv = require('dotenv');
const mongoose = require('mongoose');
const chalk = require('chalk');
const { prompt, Select, NumberPrompt } = require('enquirer');
const Product = require('../src/models/product.model');
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
      choices: ['Products', 'Categories', 'Users'],
    });

    await collectionPrompt.run();

    const numberPrompt = new NumberPrompt({
      name: 'number',
      message: 'Number of documents to be inserted',
    });

    const numberChoice = await numberPrompt.run();

    let documents = [];
    for (let i = 0; i < numberChoice; i += 1) {
      const product = getProduct();
      documents.push(product);
    }

    const products = await Product.insertMany(documents);

    console.log(products);

    process.kill(process.pid, 'SIGTERM');
  } catch (error) {
    console.log(error);
    process.kill(process.pid, 'SIGTERM');
  }
}

function getProduct() {
  const name = faker.commerce.productName();
  const sku = faker.random.uuid();
  const description = faker.commerce.productDescription();
  const price = faker.commerce.price(10, 1000);
  const inventory = faker.random.number(200);
  const image = `https://placeimg.com/640/480/tech?random=${Math.round(
    Math.random() * 1000
  )}`;
  return { name, sku, description, price, inventory, image };
}

setup();
