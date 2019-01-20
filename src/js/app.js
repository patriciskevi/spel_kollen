// Bet Class: Represents one Bet

class Powerplay {

    constructor() {
        this.bets = [];
        this.getLocalStorage();
    }

    getLocalStorage() {
        let bets = [];
        this.bets = [];

        if (localStorage.getItem('bets') === null) {
            bets = [];
        } else {
            bets = JSON.parse(localStorage.getItem('bets'));
        }
        bets.forEach((bet) => this.bets.push({
            name: bet.name,
            win: parseInt(bet.win),
            sum: parseInt(bet.sum),
            id: parseInt(bet.id),
            date: bet.date,
        }));
    }

    setLocalStorage() {
        localStorage.setItem('bets', JSON.stringify(this.bets));
    }

    getPlayersTotalBets() {

        const players = [];
        for (let bet of this.bets) {
            const player = players.find(player => player.name === bet.name);
            if (!player) {
                players.push({
                    name: bet.name,
                    win: bet.win,
                    sum: bet.sum,
                    id: bet.id,
                    date: bet.date,
                });
            } else {
                player.win += bet.win;
                player.sum += bet.sum;
            }
        }
        return players;
    }

    betDelete(id) {
        this.bets = this.bets.filter((bet) => {
            return bet.id != id;
        });
        this.renderApp();
    }

    betAdd(event) {
        const name = event.target.elements.name.value;
        const date = event.target.elements.date.value;
        const sum = event.target.elements.sum.value;
        let win = event.target.elements.win.value;

        if (date === '' || name === '' || sum === '') {
            this.showAlertMessage('Fyll i fälten');
            return;
        }

        event.target.elements.name.value = '';
        event.target.elements.date.value = '';
        event.target.elements.sum.value = '';
        event.target.elements.win.value = '';

        if (win === '' || win == 0) {
            win = 0;
        }

        this.bets.push({
            name,
            win: parseInt(win),
            sum: parseInt(sum),
            id: this.bets.length + 1,
            date
        });

        //this.showAlertMessage('Spel tillagt');
        //this.showAlert('Spel tillagt', 'btn');

        this.renderApp();
    }

    showAlertMessage(message) {
        alert(message);
    }

    renderPlayersTotalBets() {
        const tbody = document.createElement('tbody');

        for (let player of this.getPlayersTotalBets()) {
            const row = tbody.insertRow(0);
            row.innerHTML = `
                <td>${player.name}</td>
                <td>${player.sum}</td>
                <td>${player.win - player.sum}</td>
            `;
        }
        document.querySelector('#total-bets').innerHTML = tbody.innerHTML;
    }

    renderBetList() {
        const tbody = document.createElement('tbody');

        for (let bet of this.bets) {
            const row = tbody.insertRow(0);
            row.innerHTML = `
                <td>${bet.date}</td>
                <td>${bet.name}</td>
                <td>${bet.sum}</td>
                <td>${bet.win}</td>
                <td>${bet.win - bet.sum}</td>
                <td><a class="btn btn-small delete" id="${bet.id}" onClick="powerplay.betDelete(${bet.id});">
                <i class="material-icons">delete_forever</i></a></td>
            `;
        }
        document.querySelector('#bets').innerHTML = tbody.innerHTML;
    }

    renderApp() {
        this.setLocalStorage();
        this.renderBetList();
        this.renderPlayersTotalBets();

    }
}

const powerplay = new Powerplay();

document.addEventListener('DOMContentLoaded', () => {

    powerplay.renderBetList();
    powerplay.renderPlayersTotalBets();

    document.querySelector('#bet-form').addEventListener('submit', event => {
        event.preventDefault();
        powerplay.betAdd(event);
    });

    document.querySelector('#saveButton').addEventListener('click', function () {
        let date = new Date();
        let blob = new Blob([localStorage.getItem('bets')], {
            type: 'text/plain; charset=utf-8'
        });
        saveAs(blob, `spel_kollen_
            ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.txt`);
    });
});