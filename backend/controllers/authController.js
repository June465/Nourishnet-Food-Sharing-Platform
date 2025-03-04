const users = []; // In-memory store for demo

exports.register = (req, res) => {
  const { name, email, contact, role, password, categories, region, requirements } = req.body;
  // Simple check for existing email
  if(users.find(u => u.email === email)){
    return res.json({ success: false, message: "User already exists." });
  }
  const newUser = { id: Date.now(), name, email, contact, role, password, categories, region, requirements };
  users.push(newUser);
  res.json({ success: true, message: `Registered as ${role}`, user: newUser });
};

exports.login = (req, res) => {
  const { identifier, password } = req.body;
  // Find user by email or contact
  const user = users.find(u => (u.email === identifier || u.contact === identifier) && u.password === password);
  if(user){
    res.json({ success: true, user });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
};
