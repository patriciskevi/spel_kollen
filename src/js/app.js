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
        Store.getBets().forEach(bet => UI.addBetToList(bet));
        UI.renderTotalList();
    }

    static renderTotalList() {
        let players = [];
        for (let bet of Store.getBets()) {
            const player = players.find(player => player.name === bet.name);
            if (!player) {
                players.push(bet);
            } else {
                player.win = parseInt(player.win) + parseInt(bet.win);
                player.sum = parseInt(player.sum) + parseInt(bet.sum);
            }
        }

        let list = document.querySelector('#total-list');
        const tbody = document.createElement('tbody');
        players.forEach(player => {
            const row = tbody.insertRow(0);
            row.innerHTML = `
                <td>${player.name}</td>
                <td>${player.sum}</td>
                <td>${player.win - player.sum}</td>

            `;
            // console.log(`${player.name} sum: ${player.win - player.sum} kr`);
        });
        list.innerHTML = tbody.innerHTML;
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

            <td><a href="#" class="btn btn-small delete" id="${bet.id}"><i class="material-icons">delete_forever</i></a></td>
        `;

        list.insertBefore(row, list.childNodes[0]);
    }

    static deleteBet(el) {
        if (el.parentElement.classList.contains('delete')) {
            el.parentElement.parentElement.parentElement.remove();
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
        bet = {
            date: bet.date,
            name: bet.name,
            win: bet.win,
            sum: bet.sum,
            id: bets.length
        }
        bets.push(bet);
        localStorage.setItem('bets', JSON.stringify(bets));
        return bet;
    }

    static removeBet(id) {
        localStorage.setItem('bets', JSON.stringify(
            Store.getBets().filter((bet) => {
                console.log('to remove: ' + id + 'bet.id: ' + bet.id);

                return bet.id != id
            })
        ));
    }
}

function saveData() {
    const saveData = document.querySelector('#saveButton');

    saveData.addEventListener('click', function () {
        let date = new Date();
        let blob = new Blob([localStorage.getItem('bets')], {
            type: 'text/plain; charset=utf-8'
        });
        saveAs(blob, `spel_kollen_
            ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.txt`);
    });
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
        let bet = new Bet(date, name, sum, win);

        // Add bet to store
        bet = Store.addBet(bet);

        // Add bet to UI
        UI.addBetToList(bet);

        UI.renderTotalList();

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


    console.log(e.target.parentElement.id);
    //Remove bet from store
    Store.removeBet(e.target.parentElement.id);

    UI.renderTotalList();

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