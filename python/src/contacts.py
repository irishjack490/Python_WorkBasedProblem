from main import addressbook

def show_contacts(addressbook):
  print(addressbook)

def add_contact(addressbook):
  name = input('Enter Name: ').strip()
  phone = input('Enter phone number: ').strip()
  email = input('Enter email: ').strip()

  new_contact = {
        'name': name,
        'phone': phone,
        'email': email
    }
  addressbook.append(new_contact)

def delete_contact(addressbook):
  pattern = input('Enter a part of their name: ').srip()
  idx = None

  for i, contact in enumerate(addressbook):
        # find() returns -1 if the substring is not found in the string
        if pattern in contact['name']:
            idx = i

  if idx is None:
        print('\nContact Not found!\n')
        return

  deleted_name = addressbook[idx]['name']
  del addressbook[idx]
  print(f'\n{deleted_name} was deleted.\n')

delete_contact(addressbook)

