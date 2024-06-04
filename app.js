const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { query, validationResult, body } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const {
  loadContact,
  findContact,
  addContact,
  duplicateData,
  deleteContact,
  duplicateName,
  duplicateEmail,
  editContacts,
} = require("./utils/contact");

const app = express();
const port = 3000;

// Use ejs
app.set("view engine", "ejs");

app.use(expressLayouts); // Third-Party middleware
app.use(express.static("image")); // Built-in middleware
app.use(express.urlencoded({ extended: true })); // Built-in middleware

// Flash Configuration
app.use(cookieParser("scret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "scret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Home Page
app.get("/", (req, res) => {
  const mahasiswa = [
    {
      name: "Kanzun",
      email: "kanzun@gmail.com",
    },
    {
      name: "Bairuha",
      email: "bairuha@gmail.com",
    },
    {
      name: "Sangar",
      email: "sangar@gmail.com",
    },
  ];

  res.render("index", {
    name: "Kanzun Bairuha",
    title: "Home Page",
    mahasiswa,
    layout: "layouts/main-layout",
  });
});

// About Page
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Page",
    layout: "layouts/main-layout",
  });
});

// Contact Page
app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", {
    title: "Contact Page",
    layout: "layouts/main-layout",
    contacts,
    msg: req.flash("msg"),
  });
});

// Add Contact Page
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add Contact Page",
    layout: "layouts/main-layout",
  });
});

// Proccess Add Contact Page
app.post(
  "/contact",
  [
    body().custom((value) => {
      const duplicate = duplicateData(value);
      if (duplicate) {
        throw new Error(
          "Contact already in use, Please use a different email or phone number"
        );
      }
      return true;
    }),

    body("email").isEmail().withMessage("Email is invalid"),
    body("phone").isMobilePhone("id-ID").withMessage("Phone number is invalid"),
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      // return res.send({ errors: result.array() });
      return res.render("add-contact", {
        title: "Add Contact Page",
        layout: "layouts/main-layout",
        errors: result.array(),
      });
    } else {
      const newContact = req.body;
      addContact(newContact);
      // Send flash message
      req.flash("msg", "Contact added successfully!");
      res.redirect("/contact");
    }
  }
);

// Delete Contact
app.get("/contact/delete/:name", (req, res) => {
  const contact = findContact(req.params.name);

  // If contact not found
  if (!contact) {
    res.status(404);
    res.send("<h4>404</h4>");
  } else {
    const name = req.params.name;
    deleteContact(name);
    req.flash("msg", "Deleted contact is successfully!");
    res.redirect("/contact");
  }
});

// Edit Contact Page
app.get("/contact/edit/:name", (req, res) => {
  const contact = findContact(req.params.name);
  res.render("edit-contact", {
    title: "Edit Contact Page",
    layout: "layouts/main-layout",
    contact,
  });
});

// Proccess Edit Contact Page
app.post(
  "/contact/update",
  [
    body("name").custom((value, { req }) => {
      const duplicate = duplicateName(value);
      const chekContact = value !== req.body.oldName && duplicate;
      if (chekContact) {
        throw new Error("Name already exist, Please use a different Name");
      }
      return true;
    }),

    body("email").custom((value, { req }) => {
      const duplicate = duplicateEmail(value);
      const chekContact = value !== req.body.oldEmail && duplicate;
      if (chekContact) {
        throw new Error("Email already exist, Please use a different Email");
      }
      return true;
    }),

    body("phone").custom((value, { req }) => {
      const duplicate = duplicateData(value);
      const chekContact = value !== req.body.oldPhone && duplicate;
      if (chekContact) {
        throw new Error("Phone already exist, Please use a different Phone");
      }
      return true;
    }),

    body("email").isEmail().withMessage("Email is invalid"),
    body("phone").isMobilePhone("id-ID").withMessage("Phone number is invalid"),
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      // return res.send({ errors: result.array() });
      return res.render("edit-contact", {
        title: "Edit Contact Page",
        layout: "layouts/main-layout",
        errors: result.array(),
        contact: req.body,
      });
    } else {
      const newContact = req.body;
      editContacts(newContact);
      // Send flash message
      req.flash("msg", "Edit Contact successfully!");
      res.redirect("/contact");
    }
  }
);

// Detail Contact Page
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail", {
    title: "Detail Contact Page",
    layout: "layouts/main-layout",
    contact,
  });
});

app.use((req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
