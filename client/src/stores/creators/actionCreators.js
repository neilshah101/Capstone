import * as actionTypes from '../actions/actionTypes'
import axios from 'axios'

export const loadProducts = () => {
    return(dispatch) => {
        

        // api call to fetch all products 
        fetch('/all-products')
            .then(response => response.json())
            .then (products => {
                // console.log(products)
                dispatch ({type:actionTypes.Products_Loaded, payload: products})
        }).catch(error => {
            console.log(error)
        })

        // api call to fetch all vegetables 
        fetch('/all-products/vegetable')
            .then(response => response.json())
            .then (vegetable => {
                // console.log(vegetable)
                dispatch ({type:actionTypes.Products_Loaded_VEGETABLE, payload: vegetable})
        }).catch(error => {
            console.log(error)
        })

        // api call to fetch all FRUIT 
        fetch('/all-products/fruit')
            .then(response => response.json())
            .then (fruit => {
                // console.log(fruit)
                dispatch ({type:actionTypes.Products_Loaded_FRUIT, payload: fruit})
        }).catch(error => {
            console.log(error)
        })

        // api call to fetch all flower 
        fetch('/all-products/flower')
            .then(response => response.json())
            .then (flower => {
                // console.log(flower)
                dispatch ({type:actionTypes.Products_Loaded_FLOWER, payload: flower})
        }).catch(error => {
            console.log(error)
        })

    }
}
export const loadAllUsers = () => {
    return(dispatch) => {
        const token = localStorage.getItem('adminToken')


        // api call to fetch all admins 
        fetch('http://localhost:5000/admin/all-admins', {
            method: 'GET',
            headers: {
                'authorization':`Bearer ${token}`,
                
            }})
            .then(response => response.json())
            .then (admins => {
                // console.log(products)
                dispatch ({type:actionTypes.Admin_Loaded, payload: admins})
        }).catch(error => {
            console.log(error)
        })

        // api call to fetch all staff 
        fetch('http://localhost:5000/admin/all-staff', {
            method: 'GET',
            headers: {
                'authorization':`Bearer ${token}`,
                'Content-type': 'application/json'
            }})
            .then(response => response.json())
            .then (staff => {
                // console.log(vegetable)
                dispatch ({type:actionTypes.Staff_Loaded, payload: staff})
        }).catch(error => {
            console.log(error)
        })

        // api call to fetch all users 
        fetch('http://localhost:5000/admin/all-users', {
            method: 'GET',
            headers: {
                'authorization':`Bearer ${token}`,
                'Content-type': 'application/json'
            }})
            .then(response => response.json())
            .then (user => {
                // console.log(fruit)
                dispatch ({type:actionTypes.Users_Loaded, payload: user})
        }).catch(error => {
            console.log(error)
        })

       

    }
}

export const LoadOrders = () => {
    return(dispatch) => {
        const token = localStorage.getItem('adminToken')

        // api call to fetch all orders 
        fetch('http://localhost:5000/all-orders', {
            method: 'GET',
            headers: {
                'authorization':`Bearer ${token}`,
                'Content-type': 'application/json'
            }})
            .then(response => response.json())
            .then (orders => {
                // console.log(products)
                dispatch ({type:actionTypes.Orders_Loaded, payload: orders})
        }).catch(error => {
            console.log(error)
        })

        // api call to fetch all completed-orders 
        fetch('http://localhost:5000/completed-orders', {
            method: 'GET',
            headers: {
                'authorization':`Bearer ${token}`,
                'Content-type': 'application/json'
            }})
            .then(response => response.json())
            .then (orders => {
                // console.log(vegetable)
                dispatch ({type:actionTypes.Completed_Orders_Loaded, payload: orders})
        }).catch(error => {
            console.log(error)
        })

        // api call to fetch all pending-orders 
        fetch('http://localhost:5000/pending-orders', {
            method: 'GET',
            headers: {
                'authorization':`Bearer ${token}`,
                'Content-type': 'application/json'
            }})
            .then(response => response.json())
            .then (orders => {
                // console.log(fruit)
                dispatch ({type:actionTypes.Pending_Orders_Loaded, payload: orders})
        }).catch(error => {
            console.log(error)
        })

       

    }
}


export const deleteProduct = (_id, props) => {
    return(dispatch) => {
        const token = localStorage.getItem('adminToken')
        console.log(token)
        fetch(`http://localhost:5000/admin/delete-product/${_id}`, {
            method: 'DELETE',
            headers: {
                'authorization':`Bearer ${token}`,
                'Content-type': 'application/json'
            }})
            .then(response => response.json())
            .then (products => {
                if(products.success) {
                    alert("Product Is deleted")
                    window.location.reload(false);
                    
                }
        }).catch(error => {
            console.log(error)
        })
    }
}


export const onMoreDetails = (items) => {
    return {
        type: actionTypes.onMoreDetails,
        payload: items
    }
}

export const onAddToCart = (product) => {
    return {
        type: actionTypes.onAddToCart,
        payload: product
    }
}


export const onUpdateAddress = (address) => {
    return {
        type: actionTypes.onUpdateAddress,
        payload: address
    }
}

export const OrderConformation = (OrderConformation) => {
    return {
        type: actionTypes.OrderConformation,
        payload: OrderConformation
    }
}




// export const onAddToCart = (product, qty) => (getState => {
//     return {
//         type: actionTypes.onAddToCart,
//         payload: {
//             product,
//             qty
//         }
//     }
//     localStorage.setItem('cart', JSON.stringify(getState().cart))
// })


// export const removeFromCart = (product) => {
//     return {
//         type: actionTypes.REMOVE_FROM_CART,
//         payload: product
//     }
// }