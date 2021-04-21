const Modal = {
    open(){
        // Abrir Modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },
    close(){
        // Fechar Modal
        // Remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
}


function toggle_visibility() {   
    //console.log(document.querySelector('.modal-overlay'));
    document.querySelector('.modal-overlay').classList.toggle('active');
        
 }

 
const Storage = {
    get(){
        //console.log(localStorage)
        return JSON.parse(localStorage.getItem("dev.finances:transactions"))||
        []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions",
        JSON.stringify(transactions)
        //Transformando uma string em array
        )
    }
}


 /**
  *  Funcionalidade
  *     Nesse objeto imaginar quais funcionalidades serão executas
  *         Eu preciso somar as entradas 
  *         depois somar as saídas e criar um total que será entradas menos as saídas
  */
 
 //Lista de objetos
 /*const transactions = [
     {     
        description:'Luz',
        amount: -50001,
        date: '20/04/2021', 
    },
     {
        description:'WebSite',
        amount: 500012,
        date: '20/04/2021', 
    },
     {
        description:'Internet',
        amount: -20000,
        date: '20/04/2021', 
    },
    {
        description:'APP',
        amount: -10000,
        date: '20/04/2021', 
    }
]*/
 // Funções
 const Transaction = {
     // all:transctions - Refetorar colocanndo todos os transactions nessa componente
     // No futuro a const transactions não irá existir
     // Trocar o all: transctions pelos itens
     //all: transactions,
     all: Storage.get(),

     add(transaction){
        Transaction.all.push(transaction)
        //console.log(Transaction.all)
        App.reload()
     },

     remove(index){
         Transaction.all.splice(index, 1)
         App.reload()
     },

     incomes(){
         let income = 0;         
         // somar as entradas
         // para cada transação, se ela forma se for maior que zero
         Transaction.all.forEach(transaction =>{
            if(transaction.amount>0){
                // somar a uma variável e retornar a variável.
                income += transaction.amount;
            }
         })
         
         return income;
     },
     expenses(){
         //somas as saídas
         let expense = 0;         
         // somar as saídas
         // para cada transação, se ela forma se for menor que zero
         Transaction.all.forEach(transaction =>{
            if(transaction.amount<0){
                // somar a uma variável e retornar a variável.
                expense += transaction.amount;
            }
         })
         
         return expense;
     },
     total(){
         // calcular entrada - saídas
         return Transaction.incomes() + Transaction.expenses();
     }
     
     

 }

 /**
  * Substituir os dados do HTML com os dados do JS  
  */
const DOM = {
    transactionsContainer: document.querySelector('#data_table tbody'),
    
    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction,index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)


    },
    
    innerHTMLTransaction(transaction,index){    
        
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        
        const amount = Utils.formatCurrency(transaction.amount)

        const html =`            
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover T">
                </td>            
            `
        return html
    },

    updateBalance() {
        document.
            getElementById('incomeDisplay')
            .innerHTML= Utils.formatCurrency(Transaction.incomes());
        document.
            getElementById('expenseDisplay')
            .innerHTML=Utils.formatCurrency(Transaction.expenses());
        document.
            getElementById('totalDisplay')
            .innerHTML=Utils.formatCurrency(Transaction.total());
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML=""
    }

}

const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g,"") 
        //          /\D/ -> Expressão regular ache tudo que não é número.
        // Ache tudo que não é número e troque por nada ""
        value = Number(value)/100

        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency:"BRL"
        })
        return signal + value
    },

    formatAmount(value){
        value = Number(value) * 100
        //value = Number(value.replace(/\,\./g, "")) * 100
        //Retirar , e . de com expressão global
        return value
    },
    formatDate(date){
        //console.log(date);
        //const splittedDate = date.split("0")
        //console.log( splittedDate); // {"2" , "21-","4-21"}
        const splittedDate = date.split("-")
        //console.log( splittedDate) // {"2021" , "04","21"}
       //console.log(`${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`)
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    //Pegando o elemento inteiro
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateField(){
        //console.log(Form.getValues()) 
        const {description, amount, date} = Form.getValues()

        if ( description.trim()==="" ||
            date.trim()==="" ||
            amount.trim()==="" )
            {
                throw new Error("Por favor, preencha todos os campos")
            }
    },
    
    formatValues(){
       // console.log("Formatar os dados")
       let {description, amount, date} = Form.getValues()
       
       amount = Utils.formatAmount(amount);
       
       date = Utils.formatDate(date);

       return {
           description,
           amount,
           date
       }
    },

    saveTransaction(transaction){
        Transaction.add(transaction)
    },

    clearFields(){
        Form.description.value =""
        Form.amount.value =""
        Form.date.value =""

    },
    
    submit(event){
        event.preventDefault()

        try {
            // 1° Se todas as informações foram preenchidas
            Form.validateField()
            // Se fim, formatar os dados para salvar.
            const transaction = Form.formatValues()
            // salvar
            Form.saveTransaction(transaction)
            // depois limpar os dados do formulário
            Form.clearFields()
            // Fechar o Modal / tela de cadastro
            Modal.close()
            
        } catch (error) {
            alert(error.message)
        }
        
    }
}


const App ={
    init() {
        /*transactions.forEach( transaction => {
            DOM.addTransaction(transaction)
        });*/
        /**
         * Maneiras de executar
         * 1°
         * Transaction.all.forEach( function (transaction,index) {
         *   DOM.addTransaction(transaction,index)  }); 
         * 2°
         * Transaction.all.forEach( (transaction,index) => {
         * DOM.addTransaction(transaction,index)});
         *
         * 3°Como existe apenas uma função pode chamar direto
         */
        Transaction.all.forEach(DOM.addTransaction)    
        
        DOM.updateBalance()
        
        Storage.set(Transaction.all)
    },

    reload(){
        DOM.clearTransactions()
        App.init()
    },
    
}

//Storage.set("TEste alololo")
//Storage.get()
App.init()

/*
DOM.addTransaction(transactions[0])
DOM.addTransaction(transactions[1])
DOM.addTransaction(transactions[2])
*/

/*Transaction.add({
    description: "OiOi",
    amount: 300,
    date:'23/01/2021'
})*/

//Transaction.remove(0)
