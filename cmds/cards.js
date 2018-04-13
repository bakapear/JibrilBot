const got = require("got");

module.exports = {
    name: ["cards"],
    desc: "Starts a card game.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        msg.channel.send("Not done yet.");
    }
}

async function createDeck(shuffled, count) {
    var url = "https://deckofcardsapi.com/api/deck/new/";
    if(shuffled) url += "shuffle/"
    if(count) url += "?deck_count=" + count;
    var body = (await got(url, {json: true})).body;
    return body;
}

async function drawCard(deckId, count, bottom) {
    var url = `https://deckofcardsapi.com/api/deck/${deckId}/draw`;
    if(bottom) url += "/bottom";
    if(count) url += "?count=" + count;
    var body = (await got(url, {json: true})).body;
    return body;
}

async function shuffleDeck(deckId) {
    var url = `https://deckofcardsapi.com/api/deck/${deckId}/shuffle`;
    var body = (await got(url, {json: true})).body;
    return body;
}

async function addToPile(deckId, pile, cards) {
    var url = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pile}/add/?cards=${cards.join(",")}`;
    var body = (await got(url, {json: true})).body;
    return body;
}

async function shufflePile(deckId, pile) {
    var url = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pile}/shuffle`;
    var body = (await got(url, {json: true})).body;
    return body;
}

async function listPile(deckId, pile) {
    var url = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pile}/list`;
    var body = (await got(url, {json: true})).body;
    return body;
}

async function drawFromPile(deckId, pile, cards, count, bottom) {
    var url = `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pile}/draw`;
    if(count) url += "?count=" + count;
    if(cards) url += "?cards=" + cards.join(",");
    if(bottom) url += "/bottom";
    var body = (await got(url, {json: true})).body;
    return body;
}