import {
    sushiImg,
    curryImg,
    lasagnaImg,
    cupcakeImg,
    burgerImg,
    pancakeImg,
  } from '../assets/images/Food/Index';
  
  export const categories = [
    { name: 'Snacks', icon: 'Sandwich' },
    { name: 'Main Course', icon: 'UtensilsCrossed' },
    { name: 'Beverages', icon: 'CupSoda' },
    { name: 'Dessert', icon: 'IceCream' },
    { name: 'Offers', icon: 'Tag' },
  ];
  
  export const allFoodItems = [
    { 
      id: 1,
      image: sushiImg,
      name: "Sushi Platter",
      price: 499.00,
      discountType: 'Percentage',
      discountValue: 20,
      description: "Fresh sushi selection",
      category: 'Snacks',
      tags: ['bestseller']
    },
    {
      id: 2,
      image: curryImg,
      name: "Chicken Curry",
      price: 389,
      discountType: 'Percentage',
      discountValue: 20,
      description: "Spicy chicken curry",
      category: 'Main Course',
      tags: ['bestseller']
    },
    {
      id: 3,
      image: lasagnaImg,
      name: "Lasagna",
      price: 199,
      discountType: 'Percentage',
      discountValue: 20,
      description: "Classic Italian lasagna",
      category: 'Main Course',
      tags: ['bestseller']
    },
    {
      id: 4,
      image: cupcakeImg,
      name: "Cupcake",
      price: 170,
      discountType: 'Percentage',
      discountValue: 20,
      description: "Sweet vanilla cupcake",
      category: 'Dessert',
      tags: ['bestseller']
    },

    {
      id: 5,
      image: burgerImg,
      name: "Burger",
      price: 499,
      discountType: 'Percentage',
      discountValue: 20,
      description: "Classic beef burger",
      category: 'Snacks',
      tags: ['recommended']
    },
    {
      id: 6,
      image: pancakeImg,
      name: "Pancake",
      price: 169,
      discountType: 'Percentage',
      discountValue: 20,
      description: "Fluffy breakfast pancakes",
      category: 'Snacks',
      tags: ['recommended']
    },
    {
      id: 7,
      image: burgerImg,
      name: "Cheese Burger",
      price: 399,
      discountType: 'Percentage',
      discountValue: 20,
      description: "Juicy cheeseburger",
      category: 'Snacks',
      tags: ['recommended']
    },
    {
      id: 8,
      image: curryImg,
      name: "Paneer Curry",
      price: 349,
      discountType: 'Percentage',
      discountValue: 20,
      description: "Vegetarian curry dish",
      category: 'Main Course',
      tags: ['recommended']
    },  
       {
        id: 9,
        name: "Mexican Appetizer",
        price: 499,
        image: sushiImg,
        discountType: 'Percentage',
      discountValue: 20,
        description: "Spicy mexican starter",
        category: 'Snacks',
        tags: ['Bestseller']
      },
      {
        id: 10,
        name: "Pork Skewer",
        price: 399,
        image: burgerImg,
        discountType: 'Percentage',
      discountValue: 20,
        description: "Grilled meat skewers",
        category: 'Snacks',
        tags: ['Bestseller']
      },
      {
        id: 11,
        name: "Spring Rolls",
        price: 299,
        image: pancakeImg,
        discountType: 'Percentage',
      discountValue: 20,
        description: "Crispy vegetable rolls",
        category: 'Snacks',
        tags: ['Bestseller']
      },

      {
        id: 12,
        name: "Chicken Curry",
        price: 650,
        image: curryImg,
        discountType: 'Percentage',
      discountValue: 20,
        description: "Traditional Indian curry",
        category: 'Main Course',
        tags: ['Bestseller']
      },
      {
        id: 13,
        name: "Beef Steak",
        price: 899,
        image: burgerImg,
        discountType: 'Percentage',
        discountValue: 20,
        description: "Premium cut steak",
        category: 'Main Course',
        tags: ['Bestseller']
      },
      {
        id: 14,
        name: "Pasta Alfredo",
        price: 599,
        discountType: 'Percentage',
      discountValue: 20,
        image: lasagnaImg,
        description: "Creamy Italian pasta",
        category: 'Main Course',
        tags: ['Bestseller']
      },
      {
        id: 15,
        name: "Fish & Chips",
        price: 699,
        image: sushiImg,
        discountType: 'Percentage',
      discountValue: 20,
        description: "British classic dish",
        category: 'Main Course',
        tags: ['Bestseller']
      },

        {
        id: 16,
        name: "Fresh Lemonade",
        price: 149,
        discountType: 'Percentage',
      discountValue: 20,
        image: pancakeImg,
        description: "Homemade lemon drink",
        category: 'Beverages',
        tags: ['Bestseller']
      },
      {
        id: 17,
        name: "Iced Tea",
        price: 129,
        discountType: 'Percentage',
      discountValue: 20,
        image: cupcakeImg,
        description: "Refreshing cold tea",
        category: 'Beverages',
        tags: ['Bestseller']
      },
      {
        id: 18,
        name: "Smoothie",
        price: 199,
        discountType: 'Percentage',
      discountValue: 20,
        image: burgerImg,
        description: "Mixed fruit smoothie",
        category: 'Beverages',
        tags: ['Bestseller']
      },

      {
        id: 19,
        name: "Chocolate Cake",
        price: 349,
        discountType: 'Percentage',
        discountValue: 20,
        image: cupcakeImg,
        description: "Rich chocolate dessert",
        category: 'Dessert',
        tags: ['Bestseller']
      },
      {
        id: 20,
        name: "Ice Cream Sundae",
        price: 249,
        discountType: 'Percentage',
      discountValue: 20,
        image: pancakeImg,
        description: "Vanilla ice cream treat",
        category: 'Dessert',
        tags: ['Bestseller']
      },
      {
        id: 21,
        name: "Cheesecake",
        price: 399,
        discountType: 'Percentage',
      discountValue: 20,
        image: lasagnaImg,
        description: "New York style cheesecake",
        category: 'Dessert',
        tags: ['Bestseller']
      },

        {
        id: 22,
        name: "Combo Meal - 20% OFF",
        price: 499,
        discountType: 'Percentage',
        discountValue: 20,
        image: burgerImg,
        description: "Burger with fries and drink",
        category: 'Offers',
        tags: ['recommended']
      },
      {
        id: 23,
        name: "Happy Hour - Buy 1 Get 1",
        price: 699,
        image: sushiImg,
        discountType: 'Percentage',
      discountValue: 20,
        description: "Cocktail special offer",
        category: 'Offers',
        tags: ['']
        }

  ];
  export const foodItems = allFoodItems;
export const addFoodItem = (newItem) => {
  allFoodItems.push(newItem);
};

export const updateFoodItem = (updatedItem) => {
  const index = allFoodItems.findIndex(item => item.id === updatedItem.id);
  if(index >= 0) {
    allFoodItems[index] = updatedItem;
  }
};

export const deleteFoodItem = (id) => {
  const index = allFoodItems.findIndex(item => item.id === id);
  if(index >= 0) {
    allFoodItems.splice(index, 1);
  }
};