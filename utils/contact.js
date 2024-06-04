const fs = require("fs");

// Create Folder when empty
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// Create File when empty
const dataPath = "./data/contact.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// Get contact data
const loadContact = () => {
  const file = fs.readFileSync("data/contact.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

// Find a contact data
const findContact = (name) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase()
  );
  return contact;
};

// Write / overwrite contacts.json file whit new contact data
const saveContacts = (newContacts) => {
  fs.writeFileSync("data/contact.json", JSON.stringify(newContacts));
};

// Add new contact
const addContact = (newContact) => {
  const newContacts = loadContact();
  newContacts.push(newContact);
  saveContacts(newContacts);
};

// Check for duplicate data
const duplicateData = (value) => {
  const contacts = loadContact();
  return contacts.find(
    (contact) =>
      contact.name.toLowerCase() === value.name.toLowerCase() ||
      contact.email === value.email ||
      contact.phone === value.phone
  );
};

// Check for duplicate Name
const duplicateName = (value) => {
  const contacts = loadContact();
  return contacts.find(
    (contact) => contact.name.toLowerCase() === value.toLowerCase()
  );
};

// Check for duplicate Email
const duplicateEmail = (value) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.email === value);
};

// Check for duplicate Email
const duplicatePhone = (value) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.phone === value);
};

// Delete Contact
const deleteContact = (name) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.name !== name);
  saveContacts(filteredContacts);
};

// Edit Contacts
const editContacts = (newContact) => {
  const contacts = loadContact();

  // Delete contact same as whith old conntact
  const filteredContacts = contacts.filter(
    (contact) => contact.name !== newContact.oldName
  );
  const getNewContact = {
    name: newContact.name,
    email: newContact.email,
    phone: newContact.phone,
  };
  filteredContacts.push(getNewContact);
  saveContacts(filteredContacts);
};

module.exports = {
  loadContact,
  findContact,
  addContact,
  duplicateData,
  deleteContact,
  duplicateName,
  duplicateEmail,
  duplicatePhone,
  editContacts,
};
