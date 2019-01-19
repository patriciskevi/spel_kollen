// Bet Class: Represents one Bet
class Bet {
    constructor(date, name, sum, win) {
        this.date = date;
        this.name = name;
        this.sum = sum;
        this.win = win;
    }
}

// UI Class: Handle the UI
class UI {
    static displayBets() {
        const bets = Store.getBets();

        bets.forEach(bet => UI.addBetToList(bet));
    }



    static addBetToList(bet) {
        const list = document.querySelector('#bet-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${bet.date}</td>
            <td>${bet.name}</td>
            <td>${bet.sum}</td>
            <td>${bet.win}</td>
            <td>${bet.win - bet.sum}</td>
            <td><a href="#" class="btn btn-small delete"</a>X</td>
        `;

        list.insertBefore(row, list.childNodes[0]);

        M.updateTextFields();
    }

    static deleteBet(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert  ${className}`;
        div.appendChild(document.createTextNode(message));
        const section = document.querySelector('.input-section');
        const insert = document.querySelector('.insert');
        section.insertBefore(div, insert);

        // Disepears after 2 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000);
    }

    static clearFields() {
        document.querySelector('.datepicker').value = '';
        document.querySelector('#name').value = '';
        document.querySelector('#sum').value = '';
        document.querySelector('#win').value = '';
    }
}

// Store Class: Handles the Storage
class Store {
    static getBets() {
        let bets;
        if (localStorage.getItem('bets') === null) {
            bets = [];
        } else {
            bets = JSON.parse(localStorage.getItem('bets'));
        }

        return bets;
    }

    static addBet(bet) {
        const bets = Store.getBets();
        bets.push(bet);
        localStorage.setItem('bets', JSON.stringify(bets));
    }

    static removeBet(date) {
        const bets = Store.getBets();

        bets.forEach((bet, index) => {
            if (bet.date === date) {
                bets.splice(index, 1);
            }
        });

        localStorage.setItem('bets', JSON.stringify(bets));
    }
}

// Event: Display Bets
document.addEventListener('DOMContentLoaded', UI.displayBets);

// Event: Add a bet
document.querySelector('#bet-form').addEventListener('submit', e => {
    // Prevent actual submit
    e.preventDefault();

    // Get form valus
    const date = document.querySelector('.datepicker').value;
    const name = document.querySelector('#name').value;
    const sum = document.querySelector('#sum').value;
    let win = document.querySelector('#win').value;

    // Validate
    if (date === '' || name === '' || sum === '') {
        // Show error message
        alert('Fyll i fälten');

        //UI.showAlert('Fyll i fälten');
    } else {
        if (win === '' || win == 0) {
            win = 0;
        }

        // Instantiate Bet
        const bet = new Bet(date, name, sum, win);

        // Add bet to UI
        UI.addBetToList(bet);

        // Add bet to store
        Store.addBet(bet);

        // Show success message
        UI.showAlert('Spel tillagt', 'btn');

        // Clear fields on submit
        UI.clearFields();
    }
});

// Event: Remove a bet
document.querySelector('#bet-list').addEventListener('click', e => {
    // Remove bet from UI
    UI.deleteBet(e.target);


    //Remove bet from store
    Store.removeBet(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Spel borttaget', 'red btn');
});





// Could be localStorage.
// let items = [];

// function add() {
//     const item = document.querySelector('#item');
//     items.push(item.value);

//     // Clear input.
//     item.value = '';

//     // Re-render after each add.
//     render();
// }

// function deleteTheShit(id) {
//     items = items.slice(0, 1);

//     render();
// }

// function render() {
//     const list = document.querySelector('#test');
//     list.innerHTML = '<ul>' + items.reverse().reduce(
//         (content, item) => content + `<li>${item}</li><button class="btn waves-effect waves-light" onClick="deleteTheShit();" name="action">delete</button>`
//     ) + '</ul>';
// }

// static render() {
//     const list = document.querySelector('#bet-list');
//     list.innerHTML = '<ul>' + items.reverse().reduce(
//         (content, item) => content + `<li>${item}</li> onClick="deleteTheShit();" name="action">delete</button>`
//     ) + '</ul>';
// }