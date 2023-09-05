import "./style.css";
import axios from "axios";
import { z } from "zod";

// validation
const PizzaSchema = z.object ({
  id: z.number(),
  name: z.string(),
  toppings: z.string().array(),
  url: z.string(),
})

type Pizza = z.infer<typeof PizzaSchema>

const OrderSchema = z.object ({
  orderedPizzas: z.string().array(),
  name: z.string(),
  zipCode: z.string(),
  city: z.string(),
  street: z.string(),
  houseNumber: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  id: z.string(),
})

type Order = z.infer<typeof OrderSchema>


// app state

let pizzas: Pizza[] = []
let selectedPizza: Pizza | null = null
let orders: Order[] = []

// mutations

const getPizzas = async () => {

  const response = await axios.get("http://localhost:3333/api/pizza")

  const result = PizzaSchema.array().safeParse(response.data)
  if (!result.success)
    pizzas = []
  else
    pizzas = result.data
}

const getOrders = async () => {
  const response = await axios.get("http://localhost:3333/api/admin")

  const result = OrderSchema.array().safeParse(response.data)
  
  if(!result.success){
    orders = []
  }else{
    orders = result.data
  }
}

// render

const renderMain = (pizzas: Pizza[]) => {
  
  const content = `
    <h1 class="text-black">PIZZAS</h1>
    ${ pizzas.map(pizza => 
      `<div class="card flex-column bg-gray-500 gap-2 m-5 p-2">
        <h1 id="p-name">${pizza.name}</h1>
        <div>
          <button id="edit">edit</button>
          <button id="delete">delete</button>
        </div>
      </div>`
    ).join("")
    }`
  
  document.getElementById("main")!.innerHTML = content
}

const renderOrders = (orders: Order[]) => {
  const content = `
    <h1>CURRENT ORDERS</h1>
    ${orders.map(order =>
      `<div>
        <h2>${order.id}</h2>
        <p>${order.name}</p>
        <p>ordered amount: ${order.orderedPizzas.length} </p>
      </div>
      `
      )}
  `
  document.getElementById("orders")!.innerHTML = content
}

// eventlisteners

const init = async () => {
  await getPizzas()
  /* await getOrders() */
  if (pizzas.length)
    renderMain(pizzas)
  /* if(orders)
    renderOrders(orders) */
}


init()
