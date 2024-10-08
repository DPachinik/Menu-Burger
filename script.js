


const menu = document.getElementById('menu');
const modal = document.getElementById('cart-modal');
const items = document.getElementById('cart-items');
const totalValue = document.getElementById('cart-total');
const close = document.getElementById('close-modal-btn');
const checkout = document.getElementById('checkout-btn');
const counter= document.getElementById('cart-count');
const cartBtn=document.getElementById('cart-btn');
const adressInput=document.getElementById('adress');
const adressWarn=document.getElementById('adress-warn');

let cart=[];
//Activar Modal
cartBtn.addEventListener('click', function(){
    modal.style.display='flex'
    });

//Desactivar Modal
modal.addEventListener('click', function(e){
if(e.target===modal){
    modal.style.display='none'
}
})
close.addEventListener('click',function(){
    modal.style.display='none'
})

//Guardar items al carrito
menu.addEventListener('click',function(event){

    let parentsButton = event.target.closest('.add-to-card-btn')
    if(parentsButton){
        const name=parentsButton.getAttribute('data-name')
        const price=parseFloat(parentsButton.getAttribute('data-price'))
        addToCart(name,price)
        
    }

})

//funcion para agregar items al carrito (lista)
function addToCart(name,price){
    const existing=cart.find(items=>items.name===name);
    if(existing){
        existing.quantity+=1;
    }else{    
        cart.push({
        name,
        price,
        quantity:1,
    })}
 //llamar funcion para renderizar itemns
    updateCardModal();

}

// funcion para renderizar items al carrito
function updateCardModal(){
    items.innerHTML='';
    let total=0;

    cart.forEach(item=>{
        const cartItemsElement=document.createElement('div')
        cartItemsElement.innerHTML=`
            <div class='flex justify-between border-b py-2'>
                <div>
                    <p class='font-semibold'>${item.name}</p>
                    <p>Precio: Gs. ${item.price.toLocaleString('es-PY')}</p>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <button class='remove-item text-red-500 font-medium' data-item='${item.name}'>Eliminar</button>
            </div>
        `
        items.appendChild(cartItemsElement)
        total+=item.price*item.quantity
    })
    totalValue.textContent = total.toLocaleString('es-PY', {
        style: 'currency',
        currency: 'PYG',
        minimumFractionDigits: 0
    });

    counter.innerHTML=cart.length;
    
}

//funcion para remover items del carrito

items.addEventListener('click', function(event){
    if(event.target.classList.contains('remove-item')){
        const nameItem=event.target.getAttribute('data-item')
        removeItems(nameItem);
    }
})
//funcion para remover items del carrito
function removeItems(nameItem){
    const index = cart.findIndex(element=>element.name===nameItem);
    if(index!=-1){
        const itemDelete=cart[index];
        if(itemDelete.quantity>1){
            itemDelete.quantity-=1;
            updateCardModal();
            return;
        }
        cart.splice(index,1);
        updateCardModal();
        }
    }

//funcion para manejar input
adressInput.addEventListener('input', function(event){
    const inputValue=event.target.value;
    if(inputValue!==''){
        adressInput.classList.remove('border-red-500')
        adressWarn.classList.add('hidden');
    }
})

//Funcion para manejar boton de finalizar pedido
checkout.addEventListener('click', function(){

    //verificamos si el local esta en horario de atencion
    const isOpen=checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, el restaurant se encuentra cerrado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            }
          }).showToast();
        return
    }


    //verificamos si existe algun articulo en el pedido y si se coloco la direccion
    if(cart.length===0)return;
    if(adressInput.value===''){
        adressWarn.classList.remove('hidden');
        adressInput.classList.add('border-red-500')
        return
    }
    //enviamos los pedidos a traves de la Api de WhastApp
    const cartItems=cart.map(item=>{
        return( `Pedido:${item.name}
            Precio:Gs ${item.price.toLocaleString('es-PY')} 
            Cantidad:(${item.quantity})
            `)
       
    }).join('\n');
    
    const message=encodeURIComponent(cartItems)
    const phone='+595984583766';
    window.open(`https://wa.me/${phone}?text=${message} Total=${totalValue.textContent} Direccion=${adressInput.value}`, "_blank")
    cart=[];
    updateCardModal();
})

// FUNCION PARA CONTROLAR EL HORARIO DE ATENCION
function  checkRestaurantOpen(){
    const dateDay=new Date();
    const time=dateDay.getHours();
    return time>=17 && time<=23;
    
}

const isOpen=checkRestaurantOpen();
const open=document.getElementById('date')
if(isOpen){
    open.classList.remove('bg-red-600')
    open.classList.add('bg-green-700')
}else{
    open.classList.add('bg-red-600')
    open.classList.remove('bg-green-700')
}