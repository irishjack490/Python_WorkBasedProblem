//https://github.com/heapwolf/prompt-sync
const promptSync = require('prompt-sync');
const prompt = promptSync({ sigint: true });

const contacts = require('./contacts');

const addressbook = [
  { name: 'Bruce Wayne', phone: '555-123-4567', email: 'bruce@wayne.com' },
  { name: 'Clark Kent', phone: '555-222-3333', email: 'clark@dailyplanet.com' },
  { name: 'Diana Prince', phone: '555-444-5555', email: 'diana@amazon.com' }
];

function menu() {
  console.log('[1] Display all contacts');
  console.log('[2] Add a new contact');
  console.log('[3] Delete a contact');
  console.log('[4] Exit');
}

function main() {
  let run = true;
  while(run) {
    menu();
    const selection = Number(prompt('Enter a selection: '));

    switch(selection) {
      case 1: contacts.showContacts(addressbook);  break;
      case 2: contacts.addContact(addressbook);    break;
      case 3: contacts.deleteContact(addressbook); break;
      case 4: run = false; break;
      default: console.log('\nThat selection is not valid, please try again!\n');
    }
  }

  console.log('\nGoodbye!\n');
}

main();
