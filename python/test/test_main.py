import unittest
from unittest.mock import patch

# https://stackoverflow.com/a/34738440
import io
import sys

# So that `python test/test_main.py` works
# and `python test_main.py` works when in the 'test' directory
sys.path += ['src', '../src']

import contacts

# As the code is main.py not in a function or a class, nor is it a proper
# module, some real pains have to be taken in order to run the code. 
# The importlib library is used here to dynamically load/reload and run the main.py file
import importlib
def load_main():
  if 'main' in sys.modules:
    # The sys.modules.get() is necessary to avoid an
    # "argument must be a module" error
    # https://bugs.python.org/msg385765
    importlib.reload(sys.modules.get('main'))
  else:
    importlib.import_module('main')

class MainTest(unittest.TestCase):

  def setUp(self):
    self.captured = io.StringIO()
    sys.stdout = self.captured

  def tearDown(self):
    self.captured = None

  def __assert_argument_is_an_addressbook(self, arg):
    self.assertEqual(type(arg), type([]))
    self.assertEqual(type(arg[0]), type({}))
    self.assertTrue('name' in arg[0])
    self.assertTrue('email' in arg[0])
    self.assertTrue('phone' in arg[0])

  @patch('contacts.show_contacts')
  def test_should_call_the_show_contacts_function(self, mocked_show_contacts):
    inputs = f'{1}\n{4}\n'
    sys.stdin = io.StringIO(inputs)
    load_main()

    self.assertEqual(mocked_show_contacts.call_count, 1)

    arg = mocked_show_contacts.call_args_list[0][0][0]
    self.__assert_argument_is_an_addressbook(arg)

  @patch('contacts.add_contact')
  def test_should_call_the_add_contact_function(self, mocked_add_contact):
    inputs = f'{2}\n{4}\n'
    sys.stdin = io.StringIO(inputs)
    load_main()

    self.assertEqual(mocked_add_contact.call_count, 1)

    arg = mocked_add_contact.call_args_list[0][0][0]
    self.__assert_argument_is_an_addressbook(arg)

  @patch('contacts.delete_contact')
  def test_should_call_the_delete_contact_function(self, mocked_delete_contact):
    inputs = f'{3}\n{4}\n'
    sys.stdin = io.StringIO(inputs)
    load_main()

    self.assertEqual(mocked_delete_contact.call_count, 1)

    arg = mocked_delete_contact.call_args_list[0][0][0]
    self.__assert_argument_is_an_addressbook(arg)

  @patch('builtins.print')
  def test_should_quit_the_program(self, mocked_print):
    inputs = f'{4}\n'
    sys.stdin = io.StringIO(inputs)
    load_main()

    expected_output = [
      '[1] Display all contacts',
      '[2] Add a new contact',
      '[3] Delete a contact',
      '[4] Exit',
      '\nGoodbye!\n'
    ]

    for i, line in enumerate(expected_output):
      self.assertEqual(mocked_print.call_args_list[i][0][0], line)

  @patch('builtins.print')
  def test_should_detect_invalid_menu_selections(self, mocked_print):
    inputs = f'{5}\n{4}\n'
    sys.stdin = io.StringIO(inputs)
    load_main()

    expected_output = [
      '[1] Display all contacts',
      '[2] Add a new contact',
      '[3] Delete a contact',
      '[4] Exit',
      '\nThat selection is not valid, please try again!\n'
    ]

    for i, line in enumerate(expected_output):
      self.assertEqual(mocked_print.call_args_list[i][0][0], line)

if __name__ == '__main__':
  unittest.main()
