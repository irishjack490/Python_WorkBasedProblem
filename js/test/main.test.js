let mockConsoleLog;

// The prompt-sync module exports a default function so some pains have to be taken here to mock it properly
// See: https://stackoverflow.com/a/68906447
let mockPrompt;
jest.mock('prompt-sync', () => {
  return () => {
    return x => mockPrompt(x);
  }
});

// Mock the entire contacts module
jest.mock('../src/contacts');
const contacts = require('../src/contacts');

const expectedAddressbook = expect.arrayContaining([
  expect.objectContaining({
    name: expect.any(String),
    phone: expect.any(String),
    email: expect.any(String)
  })
]);

describe('The main program', () => {

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
  });

  it('should call the showContacts function', () => {
    mockPrompt = jest.fn()
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(4);

    jest.isolateModules ( () => require('../src/main') );
    expect(contacts.showContacts).toHaveBeenCalledTimes(1);
    expect(contacts.showContacts).toHaveBeenCalledWith(expectedAddressbook);
  });

  it('should call the addContact function', () => {
    mockPrompt = jest.fn()
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(4);

    jest.isolateModules ( () => require('../src/main') );
    expect(contacts.addContact).toHaveBeenCalledTimes(1);
    expect(contacts.addContact).toHaveBeenCalledWith(expectedAddressbook);
  });

  it('should call the deleteContact function', () => {
    mockPrompt = jest.fn()
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(4);

    jest.isolateModules ( () => require('../src/main') );
    expect(contacts.deleteContact).toHaveBeenCalledTimes(1);
    expect(contacts.deleteContact).toHaveBeenCalledWith(expectedAddressbook);
  });

  it('should quit the program', () => {
    mockPrompt = jest.fn()
      .mockReturnValueOnce(4);

    jest.isolateModules ( () => require('../src/main') );

    const expectedOutput = [
      '[1] Display all contacts',
      '[2] Add a new contact',
      '[3] Delete a contact',
      '[4] Exit',
      '\nGoodbye!\n'
    ];

    expectedOutput.forEach((line, i) =>
      expect(mockConsoleLog.mock.calls[i][0]).toBe(line)
    );
  });

  it('should detect invalid menu selections', () => {
    mockPrompt = jest.fn()
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(4);

    jest.isolateModules ( () => require('../src/main') );

    const expectedOutput = [
      '[1] Display all contacts',
      '[2] Add a new contact',
      '[3] Delete a contact',
      '[4] Exit',
      '\nThat selection is not valid, please try again!\n'
    ];

    expectedOutput.forEach((line, i) =>
      expect(mockConsoleLog.mock.calls[i][0]).toBe(line)
    );
  });
});
