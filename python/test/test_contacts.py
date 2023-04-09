import unittest
from unittest.mock import patch

# https://stackoverflow.com/a/34738440
import io
import sys

# So that `python test/test_contacts.py` works
# and `python test_contacts.py` works when in the 'test' directory
sys.path += ['src', '../src']

import contacts

@patch('builtins.print')
class ContactsTest(unittest.TestCase):

  def setUp(self):
    self.captured = io.StringIO()
    sys.stdout = self.captured

    self.addressbook = [
      { 'name': 'Bruce Wayne', 'phone': '555-123-4567', 'email': 'bruce@wayne.com' },
      { 'name': 'Clark Kent', 'phone': '555-222-3333', 'email': 'clark@dailyplanet.com' },
      { 'name': 'Diana Prince', 'phone': '555-444-5555', 'email': 'diana@amazon.com' },
    ]

  def tearDown(self):
    self.captured = None
  
  def test_should_show_information_of_all_contacts(self, mocked_print):
    contacts.show_contacts(self.addressbook)

    expected_output = [
      None,
      'Bruce Wayne (bruce@wayne.com): 555-123-4567',
      'Clark Kent (clark@dailyplanet.com): 555-222-3333',
      'Diana Prince (diana@amazon.com): 555-444-5555',
      None,
    ]

    for i, line in enumerate(expected_output):
      if line: # Skip blank lines
        self.assertEqual(mocked_print.call_args_list[i][0][0], line)

  def test_should_add_a_new_contact_to_the_addressbook(self, mocked_print):
    contact_to_add = {
      'name': 'Barry Allen',
      'phone': '555-666-7777',
      'email': 'barry@ccpd.com'
    }

    inputs = f"{contact_to_add['name']}\n{contact_to_add['phone']}\n{contact_to_add['email']}\n"
    sys.stdin = io.StringIO(inputs)

    expected_length = len(self.addressbook) + 1
    contacts.add_contact(self.addressbook)

    self.assertEqual(len(self.addressbook), expected_length)

    added_contact = self.addressbook.pop()
    self.assertEqual(added_contact['name'], 'Barry Allen')
    self.assertEqual(added_contact['phone'], '555-666-7777')
    self.assertEqual(added_contact['email'], 'barry@ccpd.com')

    self.assertEqual(mocked_print.call_args_list[0][0][0], '\nBarry Allen was added.\n')

  def test_should_delete_a_contact_given_a_partial_name(self, mocked_print):
    name_to_delete = 'Clark Kent'
    search_pattern = 'Ken'

    inputs = f'{search_pattern}\n'
    sys.stdin = io.StringIO(inputs)

    expected_length = len(self.addressbook) - 1
    contacts.delete_contact(self.addressbook)

    self.assertEqual(len(self.addressbook), expected_length)
    self.assertEqual(mocked_print.call_args_list[0][0][0], f'\n{name_to_delete} was deleted.\n')

  def test_should_delete_a_contact_given_a_full_name(self, mocked_print):
    name_to_delete = 'Diana Prince'
    search_pattern = name_to_delete

    inputs = f'{search_pattern}\n'
    sys.stdin = io.StringIO(inputs)

    expected_length = len(self.addressbook) - 1
    contacts.delete_contact(self.addressbook)

    self.assertEqual(len(self.addressbook), expected_length)
    self.assertEqual(mocked_print.call_args_list[0][0][0], f'\n{name_to_delete} was deleted.\n')

  def test_should_not_delete_a_contact_without_a_matching_name(self, mocked_print):
    search_pattern = 'foobar'

    inputs = f'{search_pattern}\n'
    sys.stdin = io.StringIO(inputs)

    expected_length = len(self.addressbook)
    contacts.delete_contact(self.addressbook)

    self.assertEqual(len(self.addressbook), expected_length)
    self.assertEqual(mocked_print.call_args_list[0][0][0], '\nContact Not found!\n')

if __name__ == '__main__':
  unittest.main()
