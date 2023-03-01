let mockConsoleLog;

// The prompt-sync module exports a default function so some pains have to be taken here to mock it properly
// See: https://stackoverflow.com/a/68906447
let mockPrompt;
jest.mock('prompt-sync', () => {
  return () => {
    return x => mockPrompt(x);
  }
});

// Load the contacts module after prompt-sync is mocked so that it can use the mocked prompt-sync
const contacts = require('../src/contacts');

let addressbook;

describe('Contacts', () => {

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

    addressbook = [
      { name: 'Bruce Wayne',  phone: '555-123-4567', email: 'bruce@wayne.com' },
      { name: 'Clark Kent',   phone: '555-222-3333', email: 'clark@dailyplanet.com' },
      { name: 'Diana Prince', phone: '555-444-5555', email: 'diana@amazon.com' }
    ];
  });

  afterEach(() =>
    mockConsoleLog.mockRestore()
  );

  it('should show information of all contacts', () => {
    contacts.showContacts(addressbook);

    const expectedOutput = [
      undefined,
      'Bruce Wayne (bruce@wayne.com): 555-123-4567',
      'Clark Kent (clark@dailyplanet.com): 555-222-3333',
      'Diana Prince (diana@amazon.com): 555-444-5555',
      undefined
    ];

    expectedOutput.forEach((line, i) =>
      expect(mockConsoleLog.mock.calls[i][0]).toBe(line)
    );
  });

  it('should add a new contact to the addressbook', async () => {
    const contactToAdd = {
      name: 'Barry Allen',
      phone: '555-666-7777',
      email: 'barry@ccpd.com'
    };

    mockPrompt = prompt => {
      let result;
      switch(prompt) {
        case 'Enter name: ':  result = contactToAdd.name;  break;
        case 'Enter phone: ': result = contactToAdd.phone; break;
        case 'Enter email: ': result = contactToAdd.email; break;
      }
      return result;
    }

    const expectedLength = addressbook.length + 1;
    contacts.addContact(addressbook);

    expect(addressbook.length).toBe(expectedLength);

    const addedContact = addressbook.pop();
    expect(addedContact.name).toBe(contactToAdd.name);
    expect(addedContact.phone).toBe(contactToAdd.phone);
    expect(addedContact.email).toBe(contactToAdd.email);
    expect(mockConsoleLog.mock.calls[0][0]).toBe(`\n${contactToAdd.name} was added.\n`);
  });

  it('should delete a contact given a partial name', () => {
    const nameToDelete = 'Clark Kent';
    const searchPattern = 'Ken';

    mockPrompt = () => searchPattern;

    const expectedLength = addressbook.length - 1;
    contacts.deleteContact(addressbook);

    expect(addressbook.length).toBe(expectedLength);
    expect(mockConsoleLog.mock.calls[0][0]).toBe(`\n${nameToDelete} was deleted.\n`);
  });

  it('should delete a contact given a full name', () => {
    const nameToDelete = 'Diana Prince';
    const searchPattern = nameToDelete;

    mockPrompt = () => searchPattern;

    const expectedLength = addressbook.length - 1;
    contacts.deleteContact(addressbook);

    expect(addressbook.length).toBe(expectedLength);
    expect(mockConsoleLog.mock.calls[0][0]).toBe(`\n${nameToDelete} was deleted.\n`);
  });

  it('should not delete a contact without a matching name', () => {
    const searchPattern = 'foobar';

    mockPrompt = () => searchPattern;

    const expectedLength = addressbook.length;
    contacts.deleteContact(addressbook);

    expect(addressbook.length).toBe(expectedLength);
    expect(mockConsoleLog.mock.calls[0][0]).toBe('\nContact Not found!\n');
  });
});
