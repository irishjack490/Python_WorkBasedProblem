import contacts

addressbook = [
  { 'name': 'Bruce Wayne', 'phone': '555-123-4567', 'email': 'bruce@wayne.com' },
  { 'name': 'Clark Kent', 'phone': '555-222-3333', 'email': 'clark@dailyplanet.com' },
  { 'name': 'Diana Prince', 'phone': '555-444-5555', 'email': 'diana@amazon.com' }
]

def menu():
  print('[1] Display all contacts')
  print('[2] Add a new contact')
  print('[3] Delete a contact')
  print('[4] Exit')

def main():
  run = True
  while(run):
    menu()
    selection = int(input('Enter a selection: '))

    match selection:
      case 1: contacts.show_contacts(addressbook)
      case 2: contacts.add_contact(addressbook)
      case 3: contacts.delete_contact(addressbook)
      case 4: run = False
      case _: print('\nThat selection is not valid, please try again!\n')
  
  print('\nGoodbye!\n')

main()
