//https://github.com/heapwolf/prompt-sync
const promptSync = require('prompt-sync');
const prompt = promptSync({ sigint: true });

function showContacts(addressbook) {
  console.log();
  for (contact of addressbook)
    console.log(`${contact.name} (${contact.email}): ${contact.phone}`);
  console.log();
}

function addContact(addressbook) {
  const name  = prompt('Enter name: ').trim();
  const phone = prompt('Enter phone: ').trim();
  const email = prompt('Enter email: ').trim();

  const newContact = {
    name: name,
    phone: phone,
    email: email
  };
  addressbook.push(newContact);

  console.log(`\n${name} was added.\n`);
}

function deleteContact(addressbook) {
  const pattern = prompt('Enter a part of their name: ').trim();

  let idx = null;
  for (let i = 0; i < addressbook.length; ++i)
    // indexOf() returns -1 if the substring is not found in the string
    if (addressbook[i]['name'].indexOf(pattern) >= 0)
      idx = i;

  if (idx === null) {
    console.log('\nContact Not found!\n');
    return;
  }

  const deletedName = addressbook[idx]['name'];
  addressbook.splice(idx, 1);

  console.log(`\n${deletedName} was deleted.\n`);
}

module.exports = {
  showContacts,
  addContact,
  deleteContact
};
