const { connectToDatabase } = require('../src/db/index.js');
const { User } = require('../src/models/authentication/User.models.js');

async function checkAndCreateUser() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    // Check if sample user exists
    let user = await User.findOne({ name: 'sample' });
    
    if (user) {
      console.log('User found:', {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        pincode: user.pincode
      });
    } else {
      console.log('Sample user not found. Creating...');
      
      // Create sample user
      user = new User({
        name: 'sample',
        email: 'sample@gmail.com',
        phoneNumber: '9988009988',
        pincode: '110001',
        password: 'sample123'
      });
      
      await user.save();
      console.log('Sample user created successfully:', {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        pincode: user.pincode
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkAndCreateUser(); 